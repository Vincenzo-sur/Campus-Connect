import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [showBooking, setShowBooking] = useState(false);
    const [bookingSlot, setBookingSlot] = useState(null);
    const [bookingMessage, setBookingMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeSection, setActiveSection] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        fetchAppointments();
        fetchTeachers('');
    }, []);

    const fetchTeachers = async (query) => {
        try {
            const res = await api.get(`/student/teachers?search=${query}`);
            setTeachers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAvailability = async (teacherId) => {
        try {
            const res = await api.get(`/student/teachers/${teacherId}/availability`);
            setAvailability(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/student/appointments');
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        fetchTeachers(value.length >= 1 ? value : '');
    };

    const handleSelectTeacher = (teacher) => {
        setSelectedTeacher(teacher);
        fetchAvailability(teacher._id);
    };

    const handleBookSlot = (slot) => {
        setBookingSlot(slot);
        setBookingMessage('');
        setShowBooking(true);
        setError('');
    };

    const handleSubmitBooking = async () => {
        setLoading(true);
        setError('');
        try {
            await api.post('/student/appointments', {
                teacherId: selectedTeacher._id,
                date: bookingSlot.date,
                day: bookingSlot.day,
                timeSlot: `${bookingSlot.startTime} - ${bookingSlot.endTime}`,
                message: bookingMessage,
            });
            setSuccess('Appointment request sent successfully!');
            setShowBooking(false);
            setBookingSlot(null);
            fetchAppointments();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        }
    };

    const getStatusDot = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-400';
            case 'rejected': return 'bg-red-400';
            default: return 'bg-amber-400';
        }
    };

    // Group availability by date
    const groupedByDate = availability.reduce((acc, slot) => {
        const key = slot.date || 'Unknown';
        if (!acc[key]) acc[key] = [];
        acc[key].push(slot);
        return acc;
    }, {});
    const sortedDates = Object.keys(groupedByDate).sort();

    const pendingAppts = appointments.filter(a => a.status === 'pending');
    const approvedAppts = appointments.filter(a => a.status === 'approved');
    const upcomingAppts = appointments.slice(0, 4);

    const sidebarItems = [
        { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
        { id: 'search', icon: 'person_search', label: 'Find Professors' },
        { id: 'appointments', icon: 'event_note', label: 'My Appointments', badge: appointments.length },
        { id: 'messages', icon: 'chat', label: 'Messages' },
        { id: 'settings', icon: 'settings', label: 'Settings' },
    ];

    const renderIcon = (name) => {
        const icons = {
            dashboard: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
            person_search: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
            event_note: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
            chat: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
            settings: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        };
        return icons[name] || null;
    };

    return (
        <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0a0118 0%, #0f0a2a 50%, #0a0118 100%)' }}>
            {/* ===== SIDEBAR ===== */}
            <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-[#0d0620]/90 backdrop-blur-xl border-r border-purple-500/10 flex flex-col transition-all duration-300 fixed h-full z-40`}>
                {/* Logo */}
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    {!sidebarCollapsed && (
                        <div>
                            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-indigo-400 bg-clip-text text-transparent">Campus Connect</h1>
                            <p className="text-xs text-slate-500">Student Portal</p>
                        </div>
                    )}
                </div>

                {/* Nav items */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {sidebarItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${activeSection === item.id
                                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/25 shadow-lg shadow-purple-500/5'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                }`}
                        >
                            <span className={activeSection === item.id ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'}>
                                {renderIcon(item.icon)}
                            </span>
                            {!sidebarCollapsed && (
                                <>
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.badge > 0 && (
                                        <span className="px-2 py-0.5 text-xs font-bold bg-purple-500/25 text-purple-300 rounded-full">{item.badge}</span>
                                    )}
                                </>
                            )}
                        </button>
                    ))}
                </nav>

                {/* User profile at bottom */}
                <div className="p-4 border-t border-purple-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                            {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                        {!sidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-200 truncate">{user?.name || 'Student'}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.department || 'Student'}</p>
                            </div>
                        )}
                        {!sidebarCollapsed && (
                            <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10" title="Logout">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* ===== MAIN CONTENT ===== */}
            <main className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-72'} transition-all duration-300`}>
                <div className="max-w-6xl mx-auto px-8 py-8">

                    {/* Success toast */}
                    {success && (
                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2 animate-pulse">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            {success}
                        </div>
                    )}

                    {/* ========================= DASHBOARD VIEW ========================= */}
                    {activeSection === 'dashboard' && (
                        <div className="space-y-8">
                            {/* Welcome banner */}
                            <div className="relative overflow-hidden rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, #1a0a3e 0%, #2d1b69 50%, #1a1145 100%)' }}>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px]"></div>
                                <div className="relative">
                                    <h2 className="text-3xl font-bold text-white mb-2">
                                        Hello, {user?.name?.split(' ')[0] || 'Student'}! 👋
                                    </h2>
                                    <p className="text-slate-400">
                                        You have {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} scheduled.
                                    </p>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-6 rounded-2xl border border-purple-500/15 bg-[#110827]/80 backdrop-blur-sm">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Upcoming</p>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">{approvedAppts.length}</p>
                                </div>
                                <div className="p-6 rounded-2xl border border-emerald-500/15 bg-[#110827]/80 backdrop-blur-sm">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Total Booked</p>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{appointments.length}</p>
                                </div>
                                <div className="p-6 rounded-2xl border border-amber-500/15 bg-[#110827]/80 backdrop-blur-sm">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Pending Requests</p>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{pendingAppts.length}</p>
                                </div>
                            </div>

                            {/* Schedule Overview + Recommended */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Schedule overview */}
                                <div className="lg:col-span-2 rounded-2xl border border-purple-500/15 bg-[#110827]/80 backdrop-blur-sm p-6">
                                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        Schedule Overview
                                    </h3>
                                    {upcomingAppts.length > 0 ? (
                                        <div className="space-y-3">
                                            {upcomingAppts.map(apt => (
                                                <div key={apt._id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-purple-500/30 transition-all group">
                                                    <div className="text-center shrink-0">
                                                        <p className="text-sm font-bold text-purple-400">{apt.timeSlot?.split(' - ')[0] || '--'}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase">{apt.date?.slice(5) || ''}</p>
                                                    </div>
                                                    <div className="w-px h-10 bg-purple-500/20"></div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-slate-200">{apt.teacherId?.name || 'Professor'}</p>
                                                        <p className="text-xs text-slate-500 truncate">{apt.teacherId?.department} • {apt.day}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(apt.status)}`}>
                                                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(apt.status)}`}></span>
                                                        {apt.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center border border-dashed border-slate-700/40 rounded-xl">
                                            <p className="text-slate-500 text-sm">No appointments yet</p>
                                            <button onClick={() => setActiveSection('search')} className="mt-3 text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                                Find a professor →
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Recommended / Tip */}
                                <div className="space-y-6">
                                    {/* Top professors */}
                                    <div className="rounded-2xl border border-purple-500/15 bg-[#110827]/80 backdrop-blur-sm p-6">
                                        <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
                                            Recommended
                                            <button onClick={() => setActiveSection('search')} className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">See More</button>
                                        </h3>
                                        <div className="space-y-3">
                                            {teachers.slice(0, 3).map(t => (
                                                <button key={t._id} onClick={() => { setActiveSection('search'); handleSelectTeacher(t); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-purple-500/10 transition-all text-left group">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0 ${t.instantAvailable ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-purple-400 to-purple-600'}`}>
                                                        {t.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-slate-200 truncate">{t.name}</p>
                                                        <p className="text-xs text-slate-500 truncate">{t.department}</p>
                                                    </div>
                                                    {t.instantAvailable && (
                                                        <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full ml-auto shrink-0 animate-pulse"></span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Study tip */}
                                    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 backdrop-blur-sm p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-lg">💡</span>
                                            <h4 className="text-sm font-bold text-indigo-300">Study Tip</h4>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            Book your appointments at least a day in advance. Professors are more likely to give longer, more productive sessions when they can prepare.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================= FIND PROFESSORS ========================= */}
                    {activeSection === 'search' && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white">Find Professors</h2>
                                <p className="text-sm text-slate-500 mt-1">Search and browse available teachers</p>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Teacher list */}
                                <div className="lg:col-span-1 space-y-4">
                                    <div className="relative">
                                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            id="search-teachers"
                                            type="text"
                                            value={search}
                                            onChange={handleSearch}
                                            className="w-full pl-12 pr-4 py-3 bg-[#110827]/80 border border-purple-500/15 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                            placeholder="Name, department, or subject..."
                                        />
                                    </div>
                                    <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                                        {teachers.length === 0 ? (
                                            <div className="rounded-xl p-8 text-center border border-dashed border-slate-700/40">
                                                <p className="text-slate-500 text-sm">No teachers found</p>
                                            </div>
                                        ) : (
                                            [...teachers].sort((a, b) => (b.instantAvailable ? 1 : 0) - (a.instantAvailable ? 1 : 0)).map(teacher => (
                                                <button
                                                    key={teacher._id}
                                                    onClick={() => handleSelectTeacher(teacher)}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${selectedTeacher?._id === teacher._id
                                                            ? 'bg-purple-500/10 border-purple-500/40 shadow-lg shadow-purple-500/5'
                                                            : 'bg-[#110827]/60 border-purple-500/10 hover:border-purple-500/30'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 ${teacher.instantAvailable
                                                                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30'
                                                                    : 'bg-gradient-to-br from-purple-400 to-purple-600'
                                                                }`}>
                                                                {teacher.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            {teacher.instantAvailable && (
                                                                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0a0118] animate-pulse" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="text-sm font-semibold text-slate-200 truncate">{teacher.name}</h3>
                                                                {teacher.instantAvailable && (
                                                                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                                                                        🟢 Now
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-slate-400">{teacher.department}</p>
                                                            {teacher.subjects?.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                                    {teacher.subjects.slice(0, 2).map((s, i) => (
                                                                        <span key={i} className="px-2 py-0.5 text-xs bg-purple-500/15 text-purple-300 rounded-md">{s}</span>
                                                                    ))}
                                                                    {teacher.subjects.length > 2 && (
                                                                        <span className="text-xs text-slate-500">+{teacher.subjects.length - 2}</span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Availability view */}
                                <div className="lg:col-span-2">
                                    {selectedTeacher ? (
                                        <div className="rounded-2xl border border-purple-500/15 bg-[#110827]/80 backdrop-blur-sm p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${selectedTeacher.instantAvailable
                                                            ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                                                            : 'bg-gradient-to-br from-purple-400 to-purple-600'
                                                        }`}>
                                                        {selectedTeacher.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h2 className="text-xl font-bold text-white">{selectedTeacher.name}</h2>
                                                        <p className="text-sm text-slate-400">{selectedTeacher.department} • {selectedTeacher.email}</p>
                                                    </div>
                                                </div>
                                                {selectedTeacher.instantAvailable && (
                                                    <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                                                        🟢 Available Now
                                                    </span>
                                                )}
                                            </div>
                                            <div className="space-y-4">
                                                {sortedDates.length > 0 ? sortedDates.map(dateStr => {
                                                    const slotsForDate = groupedByDate[dateStr];
                                                    let displayDate = dateStr;
                                                    try {
                                                        const d = new Date(dateStr + 'T00:00:00');
                                                        displayDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
                                                    } catch (e) { }
                                                    return (
                                                        <div key={dateStr}>
                                                            <div className="mb-2">
                                                                <span className="text-sm font-medium text-slate-300">{displayDate}</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {slotsForDate.map(slot => (
                                                                    <button
                                                                        key={slot._id}
                                                                        onClick={() => handleBookSlot(slot)}
                                                                        className="px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 hover:-translate-y-0.5"
                                                                    >
                                                                        {slot.startTime} – {slot.endTime}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                }) : (
                                                    <div className="text-center py-8 border border-dashed border-slate-700/40 rounded-xl">
                                                        <p className="text-sm text-slate-500">No available slots</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-purple-500/15 bg-[#110827]/80 p-12 text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-purple-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-400">Select a Teacher</h3>
                                            <p className="text-sm text-slate-500 mt-1">Choose a teacher from the list to view their availability</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================= APPOINTMENTS VIEW ========================= */}
                    {activeSection === 'appointments' && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white">My Appointments</h2>
                                <p className="text-sm text-slate-500 mt-1">Track and manage your appointment requests</p>
                            </div>
                            {appointments.length === 0 ? (
                                <div className="rounded-2xl border border-purple-500/15 bg-[#110827]/80 p-12 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-purple-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-400">No Appointments Yet</h3>
                                    <p className="text-sm text-slate-500 mt-1">Search for teachers and book your first appointment</p>
                                    <button onClick={() => setActiveSection('search')} className="mt-4 px-6 py-2.5 bg-purple-500/15 text-purple-300 rounded-xl font-medium text-sm hover:bg-purple-500/25 transition-all">
                                        Find Professors
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {appointments.map(apt => (
                                        <div key={apt._id} className="rounded-xl border border-purple-500/15 bg-[#110827]/80 p-5 hover:border-purple-500/30 transition-all">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                                        {apt.teacherId?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-slate-200">{apt.teacherId?.name}</h3>
                                                        <p className="text-xs text-slate-400">{apt.teacherId?.department}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(apt.status)}`}>
                                                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(apt.status)}`}></span>
                                                    {apt.status}
                                                </span>
                                            </div>
                                            <div className="space-y-1.5 text-sm">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    {apt.day}, {apt.date}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    {apt.timeSlot}
                                                </div>
                                                {apt.message && (
                                                    <p className="text-slate-500 text-xs mt-2 italic">"{apt.message}"</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================= MESSAGES (PLACEHOLDER) ========================= */}
                    {activeSection === 'messages' && (
                        <div className="rounded-2xl border border-purple-500/15 bg-[#110827]/80 p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-purple-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-400">Messages</h3>
                            <p className="text-sm text-slate-500 mt-1">Coming soon — stay tuned!</p>
                        </div>
                    )}

                    {/* ========================= SETTINGS (PLACEHOLDER) ========================= */}
                    {activeSection === 'settings' && (
                        <div className="rounded-2xl border border-purple-500/15 bg-[#110827]/80 p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-purple-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-400">Settings</h3>
                            <p className="text-sm text-slate-500 mt-1">Coming soon — stay tuned!</p>
                        </div>
                    )}
                </div>
            </main>

            {/* ========================= BOOKING MODAL ========================= */}
            {showBooking && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="rounded-2xl p-6 w-full max-w-md shadow-2xl border border-purple-500/20 bg-[#110827]/95 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white">Book Appointment</h2>
                            <button onClick={() => { setShowBooking(false); setError(''); }} className="text-slate-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
                        )}
                        <div className="space-y-4">
                            <div className="p-4 bg-purple-500/5 border border-purple-500/15 rounded-xl">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Teacher</p>
                                <p className="text-sm font-medium text-slate-200">{selectedTeacher?.name}</p>
                            </div>
                            <div className="p-4 bg-purple-500/5 border border-purple-500/15 rounded-xl">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Time Slot</p>
                                <p className="text-sm font-medium text-slate-200">{bookingSlot?.day} • {bookingSlot?.startTime} – {bookingSlot?.endTime}</p>
                            </div>
                            <div className="p-4 bg-purple-500/5 border border-purple-500/15 rounded-xl">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Date</p>
                                <p className="text-sm font-medium text-slate-200">{bookingSlot?.day}, {bookingSlot?.date}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Message (optional)</label>
                                <textarea
                                    value={bookingMessage}
                                    onChange={(e) => setBookingMessage(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-[#0a0118]/80 border border-purple-500/15 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                                    placeholder="Add context for your meeting..."
                                />
                            </div>
                            <button
                                onClick={handleSubmitBooking}
                                disabled={loading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-200 disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
