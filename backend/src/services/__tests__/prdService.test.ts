import { generatePRDInternal } from '../prdService';
import { GoogleGenerativeAI } from '@google/generative-ai';

jest.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
            generateContent: jest.fn().mockResolvedValue({
                response: { text: () => '{ "title": "Test PRD" }' }
            })
        })
    }))
}));

describe('PRDService', () => {
    describe('generatePRDInternal', () => {
        it('should call Gemini API and return JSON', async () => {
            const mockPlan = { ideaText: "Test Idea" };

            const result = await generatePRDInternal('fake-key', mockPlan);

            expect(GoogleGenerativeAI).toHaveBeenCalledWith('fake-key');
            expect(result).toEqual({ title: "Test PRD" });
        });
    });
});
