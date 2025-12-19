import { GoogleGenerativeAI } from '@google/generative-ai';
import AppError from '../utils/AppError';

export const generatePRDInternal = async (apiKey: string, planContent: any) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      You are an expert Product Manager.
      Based on the following project plan, generate a detailed Product Requirements Document (PRD).

      Project Plan:
      ${JSON.stringify(planContent)}

      Return ONLY valid JSON with the following structure:
      {
        "title": "Project Title",
        "vision": "Product Vision statement",
        "userPersonas": [
          {"role": "User Role", "description": "Description", "goals": ["Goal 1"]}
        ],
        "userStories": [
          {"role": "As a...", "action": "I want to...", "benefit": "So that..."}
        ],
        "functionalRequirements": [
          {"id": "FR-01", "description": "Requirement description", "priority": "High"}
        ],
        "nonFunctionalRequirements": [
           {"category": "Security", "requirement": "..."}
        ],
        "techStackResults": ["React", "Node.js", "MongoDB"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from text
    let jsonStr = text;
    if (text.includes('```json')) {
      jsonStr = text.split('```json')[1].split('```')[0];
    } else if (text.includes('```')) {
      jsonStr = text.split('```')[1].split('```')[0];
    }

    return JSON.parse(jsonStr);
  } catch (error: any) {
    console.error('Gemini PRD Generation Error:', error);
    throw new AppError(`Failed to generate PRD: ${error.message}`, 500);
  }
};
