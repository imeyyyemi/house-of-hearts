import { useState } from 'react';
import axios from 'axios';
import './CreateQuiz.css';

const CreateQuiz = () => {
    const [currentStep, setCurrentStep] = useState('quiz'); // 'quiz' or 'questions'
    const [quizData, setQuizData] = useState({
        title: '',
        description: ''
    });
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleQuizDataChange = (e) => {
        const { name, value } = e.target;
        setQuizData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        setCurrentQuestion(prev => ({
            ...prev,
            options: newOptions
        }));
    };

    const handleQuestionChange = (e) => {
        const { name, value } = e.target;
        setCurrentQuestion(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addQuestion = () => {
        if (questions.length >= 25) {
            setError('Maximum 25 questions allowed');
            return;
        }
        if (!currentQuestion.questionText || !currentQuestion.correctAnswer ||
            currentQuestion.options.some(opt => !opt)) {
            setError('Please fill all fields for the question');
            return;
        }
        setQuestions(prev => [...prev, currentQuestion]);
        setCurrentQuestion({
            questionText: '',
            options: ['', '', '', ''],
            correctAnswer: ''
        });
        setError('');
    };

    const handleSubmitQuiz = async (e) => {
        e.preventDefault();
        try {
            if (questions.length === 0) {
                setError('Please add at least one question before saving the quiz.');
                return;
            }

            console.log('Creating quiz with data:', { ...quizData, questions });

            // Create the quiz with all data at once
            const response = await axios.post('http://localhost:8080/api/admin/quizzes', {
                ...quizData,
                questions: questions
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('Quiz creation response:', response.data);

            if (response.data && response.data.id) {
                setSuccess(true);
                setQuizData({ title: '', description: '' });
                setQuestions([]);
                setCurrentStep('quiz');
                setError('');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            console.error('Quiz creation error:', err);
            setError(err.response?.data?.error || 'Failed to create quiz. Please try again.');

            // Check if it's an authorization error
            if (err.response?.status === 401) {
                localStorage.removeItem('isAuthenticated');
                window.location.href = '/'; // Redirect to login
            }
        }
    };

    if (currentStep === 'quiz') {
        return (
            <div className="create-quiz-container">
                <h2>Create New Quiz</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Quiz created successfully!</div>}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!quizData.title || !quizData.description) {
                        setError('Please fill all fields');
                        return;
                    }
                    setCurrentStep('questions');
                    setError('');
                }}>
                    <div className="form-group">
                        <label htmlFor="title">Quiz Title:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={quizData.title}
                            onChange={handleQuizDataChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={quizData.description}
                            onChange={handleQuizDataChange}
                            required
                        />
                    </div>
                    <button type="submit">Next: Add Questions</button>
                </form>
            </div>
        );
    }

    return (
        <div className="create-quiz-container">
            <h2>Add Questions to Quiz</h2>
            <h3>Quiz: {quizData.title}</h3>
            <p>Questions added: {questions.length}/25</p>
            {error && <div className="error-message">{error}</div>}

            <div className="question-form">
                <div className="form-group">
                    <label htmlFor="questionText">Question:</label>
                    <input
                        type="text"
                        id="questionText"
                        name="questionText"
                        value={currentQuestion.questionText}
                        onChange={handleQuestionChange}
                        required
                    />
                </div>

                {currentQuestion.options.map((option, index) => (
                    <div className="form-group" key={index}>
                        <label htmlFor={`option${index}`}>Option {index + 1}:</label>
                        <input
                            type="text"
                            id={`option${index}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            required
                        />
                    </div>
                ))}

                <div className="form-group">
                    <label htmlFor="correctAnswer">Correct Answer:</label>
                    <select
                        id="correctAnswer"
                        name="correctAnswer"
                        value={currentQuestion.correctAnswer}
                        onChange={handleQuestionChange}
                        required
                    >
                        <option value="">Select correct answer</option>
                        {currentQuestion.options.map((option, index) => (
                            option && <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className="button-group">
                    <button type="button" onClick={addQuestion} disabled={questions.length >= 25}>
                        Add Question
                    </button>
                    <button type="button" onClick={handleSubmitQuiz} disabled={questions.length === 0}>
                        Finish & Save Quiz
                    </button>
                </div>
            </div>

            {questions.length > 0 && (
                <div className="questions-preview">
                    <h3>Added Questions:</h3>
                    {questions.map((q, index) => (
                        <div key={index} className="question-preview">
                            <p><strong>Q{index + 1}:</strong> {q.questionText}</p>
                            <ul>
                                {q.options.map((opt, i) => (
                                    <li key={i} style={opt === q.correctAnswer ? {color: 'green'} : {}}>
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CreateQuiz;
