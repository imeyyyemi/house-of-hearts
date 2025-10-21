import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CreateQuiz from './components/CreateQuiz'
import Login from './components/Login'
import StudentLogin from './components/StudentLogin'
import QuizList from './components/QuizList'
import TakeQuiz from './components/TakeQuiz'
import Navbar from './components/Navbar'
import LoginSelection from './components/LoginSelection'
import AdminDashboard from './components/AdminDashboard'
import EditQuiz from './components/EditQuiz'
import './App.css'

const PrivateRoute = ({ children, allowedRole }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isStudent = localStorage.getItem('isStudent') === 'true';

  // Admin routes require admin authentication
  if (allowedRole === 'admin') {
    return isAuthenticated ? children : <Navigate to="/admin-login" />;
  }

  // Student routes require student login
  if (allowedRole === 'student') {
    return isStudent ? children : <Navigate to="/student-login" />;
  }

  // Default deny
  return <Navigate to="/" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const isStudent = localStorage.getItem('isStudent') === 'true';

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LoginSelection />} />
            <Route path="/admin-login" element={!isAuthenticated ? <Login /> : <Navigate to="/create-quiz" />} />
            <Route path="/student-login" element={!isAuthenticated ? <StudentLogin /> : <Navigate to="/student/quizzes" />} />

            {/* Admin Routes */}
            <Route
              path="/create-quiz"
              element={
                <PrivateRoute allowedRole="admin">
                  <CreateQuiz />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRole="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/edit-quiz/:quizId"
              element={
                <PrivateRoute allowedRole="admin">
                  <EditQuiz />
                </PrivateRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student/quizzes"
              element={
                <PrivateRoute allowedRole="student">
                  <QuizList />
                </PrivateRoute>
              }
            />
            <Route
              path="/take-quiz/:quizId"
              element={
                <PrivateRoute allowedRole="student">
                  <TakeQuiz />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
