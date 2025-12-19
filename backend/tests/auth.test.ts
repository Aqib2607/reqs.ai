import request from 'supertest';
import app from '../src/app';
import User from '../src/models/User';
import jwt from 'jsonwebtoken';

jest.mock('../src/models/User');
jest.mock('jsonwebtoken');

describe('Auth Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should signup a new user', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (User.create as jest.Mock).mockResolvedValue({
            _id: '123',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedpassword',
        });
        (jwt.sign as jest.Mock).mockReturnValue('mocked-token');

        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                passwordConfirm: 'password123'
            });

        expect(res.status).toBe(201);
        expect(res.body.status).toBe('success');
        expect(res.body.token).toBe('mocked-token');
    });

    it('should login a user', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({
            _id: '123',
            email: 'test@example.com',
            password: 'hashedpassword',
            correctPassword: jest.fn().mockResolvedValue(true)
        });
        (jwt.sign as jest.Mock).mockReturnValue('mocked-token');

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.status).toBe(200);
        expect(res.body.token).toBe('mocked-token');
    });
});
