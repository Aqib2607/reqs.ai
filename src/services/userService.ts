import api from './api';

export const userService = {
    getProfile: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },

    updateProfile: async (data: { name?: string; email?: string }) => {
        const response = await api.put('/users/me', data);
        return response.data;
    },

    updatePassword: async (data: any) => {
        const response = await api.patch('/users/me/password', data);
        return response.data;
    },

    getDashboardStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    }
};
