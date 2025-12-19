import api from './api';

export const authService = {
    signup: async (data: any) => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },

    login: async (data: any) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    logout: async () => {
        // Optionally call backend logout
        // await api.post('/auth/logout');
        localStorage.removeItem('token');
    },

    getMe: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },

    changePassword: async (data: any) => {
        const response = await api.patch('/users/me/password', data);
        return response.data;
    }
};
