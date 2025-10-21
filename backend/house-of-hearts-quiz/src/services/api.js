import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const createQuiz = async (quizData) => {
    try {
        const response = await api.post('/admin/quizzes', quizData);
        return response.data;
    } catch (error) {
        console.error('Error creating quiz:', error);
        throw error;
    }
};

export default api;
