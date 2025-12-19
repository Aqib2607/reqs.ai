import request from 'supertest';
import app from '../src/app';
import Feedback from '../src/models/feedback.model';

// Mock the Feedback model
jest.mock('../src/models/feedback.model');

describe('Feedback API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new feedback', async () => {
        // Mock the create method to return a dummy feedback object
        (Feedback.create as jest.Mock).mockResolvedValue({
            type: 'bug',
            message: 'This is a test bug report',
            rating: 5,
            email: 'test@example.com',
            createdAt: new Date()
        });

        const res = await request(app)
            .post('/api/v1/feedback')
            .send({
                type: 'bug',
                message: 'This is a test bug report',
                rating: 5,
                email: 'test@example.com'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.status).toEqual('success');
        expect(res.body.data.feedback.message).toEqual('This is a test bug report');
    });

    it('should handle errors gracefully', async () => {
        // Mock create to throw an error
        (Feedback.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

        const res = await request(app)
            .post('/api/v1/feedback')
            .send({
                type: 'bug',
                message: 'will fail'
            });

        // Expecting 500 because our global handler catches it
        expect(res.statusCode).toEqual(500);
    });
});
