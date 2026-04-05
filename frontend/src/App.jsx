import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';

const RootRedirect = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center gradient-bg">
                <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return <LandingPage />;
    return <Navigate to={user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'} replace />;
};

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<RootRedirect />} />
                        <Route path="/landing" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/student-dashboard"
                            element={
                                <ProtectedRoute role="student">
                                    <StudentDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/teacher-dashboard"
                            element={
                                <ProtectedRoute role="teacher">
                                    <TeacherDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
