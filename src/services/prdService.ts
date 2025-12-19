import api from './api';

export const prdService = {
    generatePRD: async (planId: string) => {
        const response = await api.post(`/prds/plans/${planId}/generate`);
        return response.data;
    },

    getPRD: async (id: string) => {
        const response = await api.get(`/prds/${id}`);
        return response.data;
    },

    getPRDs: async (params?: { planId?: string; status?: string }) => {
        const response = await api.get('/prds', { params });
        return response.data;
    },

    exportPRD: async (id: string, format: 'pdf' | 'markdown' | 'json') => {
        // For export, we might need to handle blob response for PDF
        const response = await api.get(`/prds/${id}/export`, {
            params: { format },
            responseType: format === 'pdf' ? 'blob' : 'json'
        });
        return response;
    }
};
