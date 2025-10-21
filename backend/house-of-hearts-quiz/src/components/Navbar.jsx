import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem('isAuthenticated') === 'true';
    const isStudent = localStorage.getItem('isStudent') === 'true';
    const studentInfo = JSON.parse(localStorage.getItem('studentInfo') || '{}');

    const handleLogout = () => {
        if (isAdmin) {
            localStorage.removeItem('isAuthenticated');
        }
        if (isStudent) {
            localStorage.removeItem('isStudent');
            localStorage.removeItem('studentInfo');
        }
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand" onClick={() => navigate('/')}>House of Hearts Quiz</div>
            <div className="navbar-user">
                {isStudent && (
                    <span className="user-info">Student: {studentInfo.name}</span>
                )}
                {isAdmin && (
                    <>
                        <button className="dashboard-button" onClick={() => navigate('/admin')}>Admin Dashboard</button>
                        <span className="user-info">Admin</span>
                    </>
                )}
                {(isAdmin || isStudent) && (
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
