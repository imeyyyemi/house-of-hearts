import { useState } from 'react';
import axios from 'axios';
import './StudentLogin.css';
import { useNavigate } from 'react-router-dom';

const StudentLogin = () => {
    const [credentials, setCredentials] = useState({
        studentId: '',
        name: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // For now, we'll just store the student info in localStorage
            localStorage.setItem('studentInfo', JSON.stringify(credentials));
            localStorage.setItem('isStudent', 'true');
            navigate('/student/quizzes');
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="student-login-container">
            <h2>Student Login</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="studentId">Student ID:</label>
                    <input
                        type="text"
                        id="studentId"
                        name="studentId"
                        value={credentials.studentId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Full Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={credentials.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default StudentLogin;
