import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Error Handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;

        // Handle 401: Unauthorized (Token Expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
            // For now, we just redirect to login on 401. 
            // Refresh token logic can be added here later if needed.
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        // You can also use a toast library here for global error messages
        const message = error.response?.data?.message || 'Something went wrong';
        console.error('API Error:', message);

        return Promise.reject(error);
    }
);

export default api;
