import api from './api';

export interface FeedbackData {
    type: 'bug' | 'feature' | 'general';
    message: string;
    rating?: number;
    email?: string;
}

export const submitFeedback = async (data: FeedbackData) => {
    const response = await api.post('/feedback', data);
    return response.data;
};
