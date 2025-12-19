import request from 'supertest';
import app from '../src/app';
import Plan from '../src/models/Plan';
import User from '../src/models/User';
import jwt from 'jsonwebtoken';

jest.mock('../src/models/Plan');
jest.mock('../src/models/User');
jest.mock('jsonwebtoken');

describe('Plan Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a plan', async () => {
        // Mock Auth Middleware by mocking jwt.verify and User.findById
        (jwt.verify as jest.Mock).mockReturnValue({ id: '123' });
        (User.findById as jest.Mock).mockResolvedValue({ _id: '123' });

        (Plan.create as jest.Mock).mockResolvedValue({
            _id: 'plan123',
            user: '123',
            title: 'Test Plan',
            content: 'Plan Content'
        });

        const res = await request(app)
            .post('/api/v1/plans')
            .set('Authorization', 'Bearer validtoken')
            .send({
                title: 'Test Plan',
                content: 'Plan Content'
            });

        // 201 Created
        expect(res.status).toBe(201);
        expect(res.body.data.plan.title).toBe('Test Plan');
    });

    it('should get all plans for user', async () => {
        (jwt.verify as jest.Mock).mockReturnValue({ id: '123' });
        (User.findById as jest.Mock).mockResolvedValue({ _id: '123' });

        // Mock Plan.find.sort
        const mockSort = jest.fn().mockResolvedValue([]);
        (Plan.find as jest.Mock).mockReturnValue({
            sort: mockSort
        });

        const res = await request(app)
            .get('/api/v1/plans')
            .set('Authorization', 'Bearer validtoken');

        expect(res.status).toBe(200);
        expect(res.body.results).toBeDefined();
    });
});
