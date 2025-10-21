import { useNavigate } from 'react-router-dom';
import './LoginSelection.css';

const LoginSelection = () => {
    const navigate = useNavigate();

    return (
        <div className="login-selection-container">
            <h2>Welcome to House of Hearts Quiz</h2>
            <div className="login-options">
                <div className="login-option admin" onClick={() => navigate('/admin-login')}>
                    <h3>Admin Login</h3>
                    <p>Create and manage quizzes</p>
                </div>
                <div className="login-option student" onClick={() => navigate('/student-login')}>
                    <h3>Student Login</h3>
                    <p>Take quizzes and view your results</p>
                </div>
            </div>
        </div>
    );
};

export default LoginSelection;
