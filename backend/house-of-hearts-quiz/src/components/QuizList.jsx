import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './QuizList.css';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadQuizzes();
    }, []);

    const loadQuizzes = async () => {
        try {
            console.log('Loading quizzes for student...');
            const response = await axios.get('http://localhost:8080/api/student/quizzes', { withCredentials: true });
            console.log('Quizzes response:', response);
            setQuizzes(response.data || []);
        } catch (err) {
            console.error('Error loading quizzes:', err);
            setError('Failed to load quizzes: ' + (err.response?.data?.error || err.message));
        }
    };

    const startQuiz = (quizId) => {
        console.log('Start quiz clicked for id:', quizId);
        navigate(`/take-quiz/${quizId}`);
    };

    return (
        <div className="quiz-list-container">
            <h2>Available Quizzes</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="quiz-grid">
                {quizzes.map(quiz => (
                    <div key={quiz.id} className="quiz-card">
                        <h3>{quiz.title}</h3>
                        <p>{quiz.description}</p>
                        <p>Number of questions: {quiz.questionCount ?? (quiz.questions?.length || 0)}</p>
                        <button onClick={() => startQuiz(quiz.id)} disabled={(quiz.questionCount ?? (quiz.questions?.length || 0)) === 0}>
                            Start Quiz
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizList;