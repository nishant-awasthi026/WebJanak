require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve generated projects
app.use('/generated', express.static('generated-projects'));

// Helper function to generate React code using Gemini
async function generateReactCode(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: 'models/gemini-pro' });

        const enhancedPrompt = `You are an expert React developer. Generate a complete, production-ready React component based on this description: "${prompt}"

Requirements:
1. Create a single, self-contained HTML file with React (using CDN)
2. Include inline CSS styles within a <style> tag (use modern, beautiful design with gradients, shadows, and animations)
3. Use React hooks (useState, useEffect) where appropriate
4. Make it responsive and mobile-friendly
5. Add smooth animations and transitions
6. Use a modern color palette (avoid plain colors, use gradients and complementary colors)
7. Include proper semantic HTML
8. Make it interactive and engaging

Return ONLY valid HTML code that can be directly saved as an .html file and opened in a browser. Do not include any explanations or markdown formatting - just the raw HTML code starting with <!DOCTYPE html>.`;

        const result = await model.generateContent(enhancedPrompt);
        const response = await result.response;
        let generatedCode = response.text();

        // Clean up the response - remove markdown code blocks if present
        generatedCode = generatedCode.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

        return generatedCode;
    } catch (error) {
        console.error('Error generating code:', error);
        throw error;
    }
}

// API Routes

// Generate React UI from text
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        console.log('Generating React code for prompt:', prompt);

        // Generate code using Gemini
        const generatedCode = await generateReactCode(prompt);

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
            files: ['index.html']
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
            files: metadata.files
        });

    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({
            error: 'Failed to generate code',
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
