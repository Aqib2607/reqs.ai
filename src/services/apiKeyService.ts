import api from './api';

export const apiKeyService = {
    getKeys: async () => {
        const response = await api.get('/api-keys');
        return response.data;
    },

    addKey: async (key: string, label: string) => {
        const response = await api.post('/api-keys', { key, label });
        return response.data;
    },

    deleteKey: async (id: string) => {
        const response = await api.delete(`/api-keys/${id}`);
        return response.data;
    }
};
