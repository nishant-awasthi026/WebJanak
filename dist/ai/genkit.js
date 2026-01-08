"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ai = void 0;
const core_1 = require("@genkit-ai/core");
const googleai_1 = require("@genkit-ai/googleai");
// Initialize Genkit with Google AI plugin
exports.ai = (0, core_1.configureGenkit)({
    plugins: [
        (0, googleai_1.googleAI)({
            apiKey: process.env.GEMINI_API_KEY || '',
        }),
    ],
});
