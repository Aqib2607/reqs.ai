import { signToken } from '../authService';
import jwt from 'jsonwebtoken';
// Mock config directly without importing if we mock the module? 
// Or better, import the default.
import config from '../../config';

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../config', () => ({
    __esModule: true,
    default: {
        jwtSecret: 'test-secret',
        jwtExpiresIn: '1h'
    }
}));

describe('AuthService', () => {
    describe('signToken', () => {
        it('should generate a JWT token', () => {
            const userId = '12345';
            (jwt.sign as jest.Mock).mockReturnValue('mocked-token');

            const token = signToken(userId);

            // Access mocked config values if needed, or rely on the mock factory above
            expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, 'test-secret', { expiresIn: '1h' });
            expect(token).toBe('mocked-token');
        });
    });
});
