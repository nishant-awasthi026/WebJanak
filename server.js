require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCNOgouqLQGO7SH7y5lI3Z-ouc3-ikw7e8';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve generated projects
app.use('/generated', express.static('generated-projects'));

// Helper function to generate React code using local Qwen model
async function generateReactCode(prompt) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout

    try {
        console.log('🤖 Using local Qwen model (OpenAI API) for generation...');
        console.time('Generation Duration');

        const systemPrompt = `You are WebJanak AI, an expert UI code generator.
Generate complete, production-ready HTML code with inline CSS and JavaScript.

Requirements:
1. Create a single, self-contained HTML file
2. Include inline CSS styles within a <style> tag (use modern, beautiful design)
3. Use vanilla JavaScript or React (via CDN) where appropriate
4. Make it responsive and mobile-friendly
5. Add smooth animations and transitions
6. Use a modern color palette with gradients
7. Include proper semantic HTML
8. Make it interactive and engaging

Return ONLY valid HTML code starting with <!DOCTYPE html>. No explanations.`;

        // Call local llama-server (Custom Python API)
        const response = await fetch('http://localhost:5000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Model server error: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success || !data.code) {
            throw new Error(data.error || 'Invalid response format from model server');
        }

        let generatedCode = data.code;

        console.timeEnd('Generation Duration');
        return generatedCode;
    } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error generating code with local model:', error);
        console.timeEnd('Generation Duration');

        // Fallback to template if local model fails
        console.log('⚠️  Falling back to template...');
        return getFallbackTemplate(prompt);
    }
}

// Fallback template function
function getFallbackTemplate(prompt) {
    const keywords = prompt.toLowerCase();

    if (keywords.includes('portfolio')) {
        return fs.readFileSync(path.join(__dirname, 'fallback-templates', 'portfolio.html'), 'utf-8');
    } else if (keywords.includes('coffee') || keywords.includes('shop')) {
        return fs.readFileSync(path.join(__dirname, 'fallback-templates', 'coffeeshop.html'), 'utf-8');
    } else if (keywords.includes('dashboard')) {
        return fs.readFileSync(path.join(__dirname, 'fallback-templates', 'dashboard.html'), 'utf-8');
    }

    // Default template
    return fs.readFileSync(path.join(__dirname, 'fallback-templates', 'portfolio.html'), 'utf-8');
}

// API Routes


// Improve code using local model
async function improveCodeWithLocalModel(code) {
    try {
        console.log('✨ Improving code with local model...');

        // Call local model server
        const response = await fetch('http://localhost:5000/enhance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code
            })
        });

        if (!response.ok) {
            throw new Error(`Model server error: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success || !data.code) {
            throw new Error(data.error || 'Invalid response format from model server');
        }

        console.log('✅ Code improved successfully!');
        return data.code;
    } catch (error) {
        console.error('Error improving code with local model:', error);
        throw error;
    }
}

// Generate React UI from text
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, enhance } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        console.log('Generating React code for prompt:', prompt);

        // Generate code using local model
        let generatedCode = await generateReactCode(prompt);

        // Enhance code if requested
        let enhanced = false;
        if (enhance) {
            try {
                generatedCode = await improveCodeWithLocalModel(generatedCode);
                enhanced = true;
            } catch (error) {
                console.error('Enhancement failed, using original code:', error);
                // Continue with original code if enhancement fails
            }
        }

        // Create project folder with timestamp
        const timestamp = Date.now();
        const projectId = `project-${timestamp}`;
        const projectPath = path.join(__dirname, 'generated-projects', projectId);

        // Create directory
        await fs.ensureDir(projectPath);

        // Save the generated HTML file
        const indexPath = path.join(projectPath, 'index.html');
        await fs.writeFile(indexPath, generatedCode, 'utf-8');

        // Create metadata file
        const metadata = {
            id: projectId,
            prompt: prompt,
            createdAt: new Date().toISOString(),
            files: ['index.html'],
            enhanced: enhanced
        };

        await fs.writeFile(
            path.join(projectPath, 'metadata.json'),
            JSON.stringify(metadata, null, 2),
            'utf-8'
        );

        console.log('Project created successfully:', projectId);

        res.json({
            success: true,
            projectId: projectId,
            code: generatedCode,
            previewUrl: `/generated/${projectId}/index.html`,
            files: metadata.files,
            enhanced: enhanced
        });

    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({
            error: 'Failed to generate code',
            details: error.message
        });
    }
});

// Enhance existing code
app.post('/api/enhance-code', async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Code is required' });
        }

        console.log('Enhancing code with local model...');

        const enhancedCode = await improveCodeWithLocalModel(code);

        res.json({
            success: true,
            enhancedCode: enhancedCode
        });

    } catch (error) {
        console.error('Enhancement error:', error);
        res.status(500).json({
            error: 'Failed to enhance code',
            details: error.message
        });
    }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projectsDir = path.join(__dirname, 'generated-projects');

        // Ensure directory exists
        await fs.ensureDir(projectsDir);

        const projects = await fs.readdir(projectsDir);
        const projectList = [];

        for (const projectId of projects) {
            const metadataPath = path.join(projectsDir, projectId, 'metadata.json');

            if (await fs.pathExists(metadataPath)) {
                const metadata = await fs.readJSON(metadataPath);
                projectList.push(metadata);
            }
        }

        // Sort by creation date (newest first)
        projectList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({ projects: projectList });

    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Get specific project details
app.get('/api/projects/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const projectPath = path.join(__dirname, 'generated-projects', projectId);
        const metadataPath = path.join(projectPath, 'metadata.json');
        const indexPath = path.join(projectPath, 'index.html');

        if (!await fs.pathExists(metadataPath)) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const metadata = await fs.readJSON(metadataPath);
        const code = await fs.readFile(indexPath, 'utf-8');

        res.json({
            ...metadata,
            code: code,
            previewUrl: `/generated/${projectId}/index.html`
        });

    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project details' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Generated projects will be saved in: ${path.join(__dirname, 'generated-projects')}`);
});
