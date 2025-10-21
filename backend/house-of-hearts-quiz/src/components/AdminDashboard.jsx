import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadQuizzes();
    }, []);

    const handleAuthError = (err) => {
        if (err?.response?.status === 401) {
            // session likely expired; force admin to login again
            localStorage.removeItem('isAuthenticated');
            navigate('/admin-login');
            return true;
        }
        return false;
    };

    const loadQuizzes = async () => {
        try {
            // Use the summary endpoint so we reliably get id/title/description/questionCount
            const response = await axios.get('http://localhost:8080/api/student/quizzes', {
                withCredentials: true
            });
            setQuizzes(response.data);
        } catch (err) {
            if (handleAuthError(err)) return;
            setError('Failed to load quizzes');
            console.error('Error loading quizzes:', err);
        }
    };

    const loadAttempts = async (quizId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/quizzes/${quizId}/attempts`, {
                withCredentials: true
            });
            setAttempts(response.data);
            setSelectedQuiz(quizzes.find(q => q.id === quizId));
        } catch (err) {
            if (handleAuthError(err)) return;
            setError('Failed to load quiz attempts');
            console.error('Error loading attempts:', err);
        }
    };

    const handleEditQuiz = (quizId) => {
        navigate(`/edit-quiz/${quizId}`);
    };

    const handleDeleteQuiz = async (quizId) => {
        if (!window.confirm('Are you sure you want to delete this quiz?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/admin/quizzes/${quizId}`, {
                withCredentials: true
            });
            await loadQuizzes(); // Refresh the list
            setSelectedQuiz(null);
            setAttempts([]);
        } catch (err) {
            if (handleAuthError(err)) return;
            setError('Failed to delete quiz');
            console.error('Error deleting quiz:', err);
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h2>Admin Dashboard</h2>
                <div>
                  <button className="create-quiz-btn" onClick={() => navigate('/create-quiz')}>
                      Create New Quiz
                  </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="dashboard-content">
                <div className="quizzes-list">
                    <h3>Your Quizzes</h3>
                    {quizzes.length === 0 ? (
                        <p>No quizzes created yet</p>
                    ) : (
                        <ul>
                            {quizzes.map(quiz => (
                                <li key={quiz.id} className={selectedQuiz?.id === quiz.id ? 'selected' : ''}>
                                    <div className="quiz-item" onClick={() => loadAttempts(quiz.id)}>
                                        <h4>{quiz.title}</h4>
                                        <p>{quiz.description}</p>
                                        <span className="question-count">{quiz.questionCount ?? (quiz.questions?.length || 0)} questions</span>
                                    </div>
                                    <div className="quiz-actions">
                                        <button onClick={() => handleEditQuiz(quiz.id)}>Edit</button>
                                        <button onClick={() => handleDeleteQuiz(quiz.id)} className="delete">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="attempts-list">
                    <h3>Student Attempts {selectedQuiz && `- ${selectedQuiz.title}`}</h3>
                    {!selectedQuiz ? (
                        <p>Select a quiz to view student attempts</p>
                    ) : attempts.length === 0 ? (
                        <p>No attempts for this quiz yet</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Name</th>
                                    <th>Score</th>
                                    <th>Percentage</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attempts.map(attempt => (
                                    <tr key={attempt.id}>
                                        <td>{attempt.studentId}</td>
                                        <td>{attempt.studentName}</td>
                                        <td>{attempt.score}/{attempt.totalQuestions}</td>
                                        <td>{(attempt.percentage ?? 0).toFixed(1)}%</td>
                                        <td className={attempt.passed ? 'passed' : 'failed'}>
                                            {attempt.passed ? 'PASSED' : 'FAILED'}
                                        </td>
                                        <td>{new Date(attempt.attemptDate).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
