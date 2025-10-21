import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TakeQuiz.css';

const TakeQuiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadQuiz();
    }, [quizId]);

    const loadQuiz = async () => {
        try {
            console.log('Loading quiz with ID:', quizId);
            const response = await axios.get(`http://localhost:8080/api/student/quizzes/${quizId}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log('Quiz data received:', response.data);
            if (response.data && response.data.questions) {
                setQuiz(response.data);
                setAnswers(new Array(response.data.questions.length).fill(''));
                setError('');
            } else {
                throw new Error('Invalid quiz data received');
            }
        } catch (err) {
            console.error('Error loading quiz:', err);
            setError('Failed to load quiz: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleAnswer = (answer) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answer;
        setAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(curr => curr + 1);
        }
    };

    const previousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(curr => curr - 1);
        }
    };

    const submitQuiz = async () => {
        if (answers.some(answer => answer === '')) {
            setError('Please answer all questions before submitting');
            return;
        }

        try {
            const studentInfo = JSON.parse(localStorage.getItem('studentInfo') || '{}');
            const response = await axios.post(
                `http://localhost:8080/api/student/quizzes/${quizId}/submit`,
                {
                    studentId: studentInfo.studentId,
                    studentName: studentInfo.name,
                    answers: answers.map((answer, index) => ({
                        questionId: quiz.questions[index].id,
                        answer: answer
                    }))
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setResult(response.data);
        } catch (err) {
            setError('Failed to submit quiz: ' + (err.response?.data?.error || err.message));
            console.error('Error submitting quiz:', err);
        }
    };

    if (!quiz) {
        return <div className="loading">Loading quiz...</div>;
    }

    if (result) {
        return (
            <div className="quiz-result">
                <h2>Quiz Results</h2>
                <div className="result-details">
                    <p>Total Questions: {result.totalQuestions}</p>
                    <p>Correct Answers: {result.correctAnswers}</p>
                    <p>Percentage: {result.percentage.toFixed(2)}%</p>
                    <div className={`result-status ${result.passed ? 'passed' : 'failed'}`}>
                        {result.passed ? 'PASSED!' : 'FAILED'}
                    </div>
                </div>
                <button onClick={() => navigate('/student/quizzes')}>Back to Quizzes</button>
            </div>
        );
    }

    const currentQ = quiz.questions[currentQuestion];

    return (
        <div className="take-quiz-container">
            <h2>{quiz.title}</h2>
            <p className="quiz-description">{quiz.description}</p>
            <div className="quiz-progress">
                Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
            {error && <div className="error-message">{error}</div>}

            <div className="question-container">
                <h3>{currentQ.text}</h3>
                <div className="options-container">
                    {currentQ.options.map((option, index) => (
                        <button
                            key={index}
                            className={`option-button ${answers[currentQuestion] === option ? 'selected' : ''}`}
                            onClick={() => handleAnswer(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <div className="navigation-buttons">
                <button
                    onClick={previousQuestion}
                    disabled={currentQuestion === 0}
                >
                    Previous
                </button>
                {currentQuestion === quiz.questions.length - 1 ? (
                    <button
                        onClick={submitQuiz}
                        className="submit-button"
                    >
                        Submit Quiz
                    </button>
                ) : (
                    <button
                        onClick={nextQuestion}
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default TakeQuiz;
