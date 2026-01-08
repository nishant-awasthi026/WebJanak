import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateCode(description: string): Promise<string> {
    try {
        // Use Gemini 1.5 Flash for better quota availability
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are an expert React developer. Generate a complete, production-ready React component based on this description: "${description}"

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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let generatedCode = response.text();

        // Clean up the response - remove markdown code blocks if present
        generatedCode = generatedCode.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

        return generatedCode;
    } catch (error) {
        console.error('Error in generateCode:', error);

        // Return fallback template based on description keywords
        const path = require('path');
        const fs = require('fs-extra');

        let templateName = 'portfolio'; // default
        const descLower = description.toLowerCase();

        if (descLower.includes('coffee') || descLower.includes('cafe') || descLower.includes('shop')) {
            templateName = 'coffeeshop';
        } else if (descLower.includes('dashboard') || descLower.includes('admin') || descLower.includes('analytics')) {
            templateName = 'dashboard';
        } else if (descLower.includes('portfolio') || descLower.includes('developer') || descLower.includes('personal')) {
            templateName = 'portfolio';
        }

        try {
            const templatePath = path.join(__dirname, '..', '..', 'fallback-templates', `${templateName}.html`);
            const fallbackCode = await fs.readFile(templatePath, 'utf-8');
            console.log(`Using fallback template: ${templateName}`);
            return fallbackCode;
        } catch (fallbackError) {
            console.error('Error loading fallback template:', fallbackError);
            throw new Error('Both AI generation and fallback templates failed');
        }
    }
}
