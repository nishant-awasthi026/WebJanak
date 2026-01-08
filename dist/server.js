"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const actions_1 = require("./app/actions");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
// Serve generated projects
app.use('/generated', express_1.default.static('generated-projects'));
// API Routes
// Generate React UI from text
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        console.log('Generating React code for prompt:', prompt);
        // Generate code using Genkit flow
        const generatedCode = await (0, actions_1.generateCode)(prompt);
        // Create project folder with timestamp
        const timestamp = Date.now();
        const projectId = `project-${timestamp}`;
        const projectPath = path_1.default.join(__dirname, '..', 'generated-projects', projectId);
        // Create directory
        await fs_extra_1.default.ensureDir(projectPath);
        // Save the generated HTML file
        const indexPath = path_1.default.join(projectPath, 'index.html');
        await fs_extra_1.default.writeFile(indexPath, generatedCode, 'utf-8');
        // Create metadata file
        const metadata = {
            id: projectId,
            prompt: prompt,
            createdAt: new Date().toISOString(),
            files: ['index.html'],
        };
        await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'metadata.json'), JSON.stringify(metadata, null, 2), 'utf-8');
        console.log('Project created successfully:', projectId);
        res.json({
            success: true,
            projectId: projectId,
            code: generatedCode,
            previewUrl: `/generated/${projectId}/index.html`,
            files: metadata.files,
        });
    }
    catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({
            error: 'Failed to generate code',
            details: error.message,
        });
    }
});
// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projectsDir = path_1.default.join(__dirname, '..', 'generated-projects');
        // Ensure directory exists
        await fs_extra_1.default.ensureDir(projectsDir);
        const projects = await fs_extra_1.default.readdir(projectsDir);
        const projectList = [];
        for (const projectId of projects) {
            const metadataPath = path_1.default.join(projectsDir, projectId, 'metadata.json');
            if (await fs_extra_1.default.pathExists(metadataPath)) {
                const metadata = await fs_extra_1.default.readJSON(metadataPath);
                projectList.push(metadata);
            }
        }
        // Sort by creation date (newest first)
        projectList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        res.json({ projects: projectList });
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});
// Get specific project details
app.get('/api/projects/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const projectPath = path_1.default.join(__dirname, '..', 'generated-projects', projectId);
        const metadataPath = path_1.default.join(projectPath, 'metadata.json');
        const indexPath = path_1.default.join(projectPath, 'index.html');
        if (!(await fs_extra_1.default.pathExists(metadataPath))) {
            return res.status(404).json({ error: 'Project not found' });
        }
        const metadata = await fs_extra_1.default.readJSON(metadataPath);
        const code = await fs_extra_1.default.readFile(indexPath, 'utf-8');
        res.json({
            ...metadata,
            code: code,
            previewUrl: `/generated/${projectId}/index.html`,
        });
    }
    catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project details' });
    }
});
// Chatbot endpoint for development queries
app.post('/api/chat', async (req, res) => {
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
    }
    catch (error) {
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
    console.log(`📁 Generated projects will be saved in: ${path_1.default.join(__dirname, '..', 'generated-projects')}`);
});
