import fetch from 'node-fetch'; // Using node-fetch as it's in dependencies

export async function generateCode(description: string): Promise<string> {
    console.log(`🤖 Generating with Local Qwen Model: "${description}"`);
    console.time('Generation Duration');

    // 5 Minute Timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
    }, 300000);

    try {
        const systemPrompt = `You are WebJanak AI, an expert UI code generator.
Generate complete, production-ready HTML code with inline CSS and JavaScript based on the user description.

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

        const response = await fetch('http://localhost:5000/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: description }
                ],
                max_tokens: 4096,
                temperature: 0.7,
                stream: false
            }),
            signal: controller.signal as any // Type cast if needed for node-fetch compatibility
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`Model Server Error: ${response.status} ${response.statusText}`);
        }

        const data: any = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from Local Model');
        }

        let generatedCode = data.choices[0].message.content;

        // Clean up markdown
        generatedCode = generatedCode.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

        console.timeEnd('Generation Duration');
        return generatedCode;

    } catch (error) {
        clearTimeout(timeout);
        console.error('Error in generateCode:', error);
        console.timeEnd('Generation Duration');

        // Fallback Logic
        const path = require('path');
        const fs = require('fs-extra');

        let templateName = 'portfolio';
        const descLower = description.toLowerCase();

        if (descLower.includes('coffee') || descLower.includes('cafe') || descLower.includes('shop')) {
            templateName = 'coffeeshop';
        } else if (descLower.includes('dashboard') || descLower.includes('admin') || descLower.includes('analytics')) {
            templateName = 'dashboard';
        }

        try {
            const templatePath = path.join(__dirname, '..', '..', 'fallback-templates', `${templateName}.html`);
            if (await fs.pathExists(templatePath)) {
                console.log(`⚠️ Using fallback template: ${templateName}`);
                return await fs.readFile(templatePath, 'utf-8');
            }
        } catch (fbError) {
            console.error('Fallback failed:', fbError);
        }

        throw error; // If fallback fails too
    }
}
