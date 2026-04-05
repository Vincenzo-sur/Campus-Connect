import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        department: '',
        subjects: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                department: formData.department,
                subjects: formData.role === 'teacher' ? formData.subjects.split(',').map((s) => s.trim()).filter(Boolean) : [],
            };
            const data = await register(payload);
            navigate(data.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        'w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all';

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-2xl shadow-accent-500/30">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        Create Account
                    </h1>
                    <p className="text-slate-400 mt-2">Join CampusConnect today</p>
                </div>

                {/* Form Card */}
                <div className="glass rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                            <input id="register-name" type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClass} placeholder="John Doe" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <input id="register-email" type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="you@campus.edu" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                                <input id="register-password" type="password" name="password" required minLength={6} value={formData.password} onChange={handleChange} className={inputClass} placeholder="••••••" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm</label>
                                <input id="register-confirm" type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className={inputClass} placeholder="••••••" />
                            </div>
                        </div>

                        {/* Role selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">I am a</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'student' })}
                                    className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 ${formData.role === 'student'
                                            ? 'bg-primary-500/20 border-primary-500 text-primary-300 shadow-lg shadow-primary-500/10'
                                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                        }`}
                                >
                                    🎓 Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'teacher' })}
                                    className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 ${formData.role === 'teacher'
                                            ? 'bg-accent-500/20 border-accent-500 text-accent-300 shadow-lg shadow-accent-500/10'
                                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                        }`}
                                >
                                    👨‍🏫 Teacher
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
                            <input id="register-department" type="text" name="department" required value={formData.department} onChange={handleChange} className={inputClass} placeholder="Computer Science" />
                        </div>

                        {formData.role === 'teacher' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Subjects (comma-separated)</label>
                                <input id="register-subjects" type="text" name="subjects" value={formData.subjects} onChange={handleChange} className={inputClass} placeholder="Data Structures, Algorithms, OS" />
                            </div>
                        )}

                        <button
                            id="register-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
