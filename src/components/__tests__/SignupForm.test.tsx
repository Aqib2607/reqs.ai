import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Signup from '../../pages/Signup';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';

// Mock dependencies
vi.mock('../../services/authService', () => ({
    authService: {
        signup: vi.fn(),
        getMe: vi.fn().mockResolvedValue({ status: 'fail' }),
        logout: vi.fn(),
    }
}));

const renderSignup = () => {
    return render(
        <AuthProvider>
            <BrowserRouter>
                <Signup />
            </BrowserRouter>
        </AuthProvider>
    );
};

describe('Signup Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('renders signup form', () => {
        renderSignup();
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        // Label is "Password", placeholder is dots.
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('updates input values', () => {
        renderSignup();
        const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        expect(nameInput.value).toBe('John Doe');
    });
});
