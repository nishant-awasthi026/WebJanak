"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReactCodeFromDescription = void 0;
const flow_1 = require("@genkit-ai/flow");
const ai_1 = require("@genkit-ai/ai");
const googleai_1 = require("@genkit-ai/googleai");
const zod_1 = require("zod");
// Define input/output schemas
const InputSchema = zod_1.z.object({
    description: zod_1.z.string().describe('Text description of the UI to generate'),
});
const OutputSchema = zod_1.z.object({
    code: zod_1.z.string().describe('Generated HTML/React code'),
});
// Define the flow for generating React code from description
exports.generateReactCodeFromDescription = (0, flow_1.defineFlow)({
    name: 'generateReactCodeFromDescription',
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
}, async (input) => {
    const prompt = `You are an expert React developer. Generate a complete, production-ready React component based on this description: "${input.description}"

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
    const response = await (0, ai_1.generate)({
        model: googleai_1.gemini20FlashExp,
        prompt: prompt,
    });
    // Clean up the response - remove markdown code blocks if present
    let cleanedCode = response.text().replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
    return {
        code: cleanedCode,
    };
});
