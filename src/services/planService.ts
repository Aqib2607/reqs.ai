import api from './api';

export const planService = {
    createPlan: async (data: { ideaText: string; visibility: 'public' | 'private' }) => {
        const response = await api.post('/plans', data);
        return response.data;
    },

    getPlans: async (params?: { page?: number; limit?: number; status?: string }) => {
        const response = await api.get('/plans', { params });
        return response.data;
    },

    getPlan: async (id: string) => {
        const response = await api.get(`/plans/${id}`);
        return response.data;
    },

    updatePlan: async (id: string, data: any) => {
        const response = await api.put(`/plans/${id}`, data);
        return response.data;
    },

    deletePlan: async (id: string) => {
        const response = await api.delete(`/plans/${id}`);
        return response.data;
    }
};
