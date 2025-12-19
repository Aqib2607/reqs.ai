import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from '../../pages/Login';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';

// Mock dependencies
// We need to mock getMe because AuthProvider calls it on mount if token exists
// Or we mock localStorage to return null.
vi.mock('../../services/authService', () => ({
    authService: {
        login: vi.fn(),
        getMe: vi.fn().mockResolvedValue({ status: 'fail' }), // Default to not logged in
        logout: vi.fn(),
    }
}));

const renderLogin = () => {
    return render(
        <AuthProvider>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </AuthProvider>
    );
};

describe('Login Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('renders login form', async () => {
        renderLogin();
        // Wait for loading state if necessary, but initial state is loading=true then false.
        // Assuming AuthProvider renders children after loading?
        // Let's check AuthContext. It renders children immediately? 
        // No, `isLoading` is in value, but children are rendered. 
        // Logic: returns <Provider>{children}</Provider>. Correct.

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        // Use accessible name
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('updates input values', () => {
        renderLogin();
        const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } }); // Correctly set value
        expect(emailInput.value).toBe('test@example.com');
    });
});
