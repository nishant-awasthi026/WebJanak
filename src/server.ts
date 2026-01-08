import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs-extra';
import { generateCode } from './app/actions';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve generated projects
app.use('/generated', express.static('generated-projects'));

// API Routes

// Generate React UI from text
app.post('/api/generate', async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        console.log('Generating React code for prompt:', prompt);

        // Generate code using Genkit flow
        const generatedCode = await generateCode(prompt);

        // Create project folder with timestamp
        const timestamp = Date.now();
        const projectId = `project-${timestamp}`;
        const projectPath = path.join(__dirname, '..', 'generated-projects', projectId);

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
        });
    } catch (error: any) {
        console.error('Generation error:', error);
        res.status(500).json({
            error: 'Failed to generate code',
            details: error.message,
        });
    }
});

// Get all projects
app.get('/api/projects', async (req: Request, res: Response) => {
    try {
        const projectsDir = path.join(__dirname, '..', 'generated-projects');

        // Ensure directory exists
        await fs.ensureDir(projectsDir);

        const projects = await fs.readdir(projectsDir);
        const projectList: any[] = [];

        for (const projectId of projects) {
            const metadataPath = path.join(projectsDir, projectId, 'metadata.json');

            if (await fs.pathExists(metadataPath)) {
                const metadata = await fs.readJSON(metadataPath);
                projectList.push(metadata);
            }
        }

        // Sort by creation date (newest first)
        projectList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.json({ projects: projectList });
    } catch (error: any) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Get specific project details
app.get('/api/projects/:projectId', async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const projectPath = path.join(__dirname, '..', 'generated-projects', projectId);
        const metadataPath = path.join(projectPath, 'metadata.json');
        const indexPath = path.join(projectPath, 'index.html');

        if (!(await fs.pathExists(metadataPath))) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const metadata = await fs.readJSON(metadataPath);
        const code = await fs.readFile(indexPath, 'utf-8');

        res.json({
            ...metadata,
            code: code,
            previewUrl: `/generated/${projectId}/index.html`,
        });
    } catch (error: any) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project details' });
    }
});

// Chatbot endpoint for development queries
app.post('/api/chat', async (req: Request, res: Response) => {
    try {
        const { message, code, language } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log('Chat query:', message);

        // Create context-aware prompt
        const contextPrompt = code
            ? `You are a helpful coding assistant for WebJanak, an Indian government web generator tool. 
      
User's generated code:
\`\`\`html
${code.substring(0, 1000)}...
\`\`\`

User question: ${message}

Provide a helpful, concise answer${language === 'hi' ? ' in Hindi' : ''}. If the question is about the code, reference specific parts. If it's about web development, provide practical guidance.`
            : `You are a helpful web development assistant for WebJanak. User question: ${message}
      
Provide a helpful, concise answer${language === 'hi' ? ' in Hindi' : ''} about web development, React, HTML, CSS, or JavaScript.`;

        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(contextPrompt);
        const response = await result.response;
        const botResponse = response.text();

        res.json({ response: botResponse });
    } catch (error: any) {
        console.error('Chat error:', error);
        res.status(500).json({
            error: 'Chat failed',
            details: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Generated projects will be saved in: ${path.join(__dirname, '..', 'generated-projects')}`);
});
