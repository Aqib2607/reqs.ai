import { generatePlanInternal } from '../geminiService';
import { GoogleGenerativeAI } from '@google/generative-ai';

jest.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
            generateContent: jest.fn().mockResolvedValue({
                response: { text: () => '{ "title": "Test Plan" }' }
            })
        })
    }))
}));

describe('GeminiService', () => {
    describe('generatePlanInternal', () => {
        it('should return generated plan JSON', async () => {
            const result = await generatePlanInternal('fake-key', 'My Idea');

            expect(GoogleGenerativeAI).toHaveBeenCalledWith('fake-key');
            expect(result).toEqual({ title: "Test Plan" });
        });
    });
});
