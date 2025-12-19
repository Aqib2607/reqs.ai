import { GoogleGenerativeAI } from '@google/generative-ai';
import AppError from '../utils/AppError';

export const generatePlanInternal = async (apiKey: string, ideaText: string) => {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
      You are an expert Project Manager and Solutions Architect.
      Create a detailed implementation plan for the following project idea: "${ideaText}".
      
      Return ONLY valid JSON with the following structure:
      {
        "title": "Project Title",
        "summary": "Executive summary",
        "techStack": ["Technique 1", "Technique 2"],
        "phases": [
          {
            "phaseName": "Phase 1: ...",
            "duration": "1 week",
            "tasks": ["Task 1", "Task 2"]
          }
        ]
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from text (sometimes Gemini wraps in markdown code blocks)
        let jsonStr = text;
        if (text.includes('```json')) {
            jsonStr = text.split('```json')[1].split('```')[0];
        } else if (text.includes('```')) {
            jsonStr = text.split('```')[1].split('```')[0];
        }

        return JSON.parse(jsonStr);
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        throw new AppError(`Failed to generate plan: ${error.message}`, 500);
    }
};
