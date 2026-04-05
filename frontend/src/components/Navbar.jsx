import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const dashboardPath = user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard';

    return (
        <nav className="glass sticky top-0 z-50 border-b border-primary-500/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to={dashboardPath} className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-all">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent hidden sm:block">
                            CampusConnect
                        </span>
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        {/* User info */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-slate-200">{user.name}</p>
                                <p className="text-xs text-slate-400 capitalize flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full pulse-dot ${user.role === 'teacher' ? 'bg-emerald-400' : 'bg-blue-400'}`}></span>
                                    {user.role}
                                </p>
                            </div>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/50 rounded-lg transition-all duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
