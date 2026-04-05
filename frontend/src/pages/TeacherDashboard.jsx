import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const TeacherDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [slots, setSlots] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [showAddSlot, setShowAddSlot] = useState(false);
    const [editSlot, setEditSlot] = useState(null);
    const [slotForm, setSlotForm] = useState({ day: 'Monday', date: '', startTime: '09:00', endTime: '10:00', status: 'available' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [instantAvailable, setInstantAvailable] = useState(false);
    const [instantLoading, setInstantLoading] = useState(false);

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => { fetchSlots(); fetchAppointments(); fetchInstantStatus(); }, []);

    const fetchInstantStatus = async () => { try { const r = await api.get('/teacher/instant-available'); setInstantAvailable(r.data.instantAvailable); } catch (e) { } };
    const handleToggleInstant = async () => {
        setInstantLoading(true);
        try { const r = await api.put('/teacher/instant-available'); setInstantAvailable(r.data.instantAvailable); setSuccess(r.data.instantAvailable ? 'You are now visible!' : 'Meet Now off'); setTimeout(() => setSuccess(''), 3000); } catch (e) { } finally { setInstantLoading(false); }
    };
    const fetchSlots = async () => { try { const r = await api.get('/teacher/availability'); setSlots(r.data); } catch (e) { } };
    const fetchAppointments = async () => { try { const r = await api.get('/teacher/appointments'); setAppointments(r.data); } catch (e) { } };

    const handleAddSlot = async () => {
        setLoading(true); setError('');
        try { await api.post('/teacher/availability', slotForm); setSuccess('Slot added!'); setShowAddSlot(false); setSlotForm({ day: 'Monday', date: '', startTime: '09:00', endTime: '10:00', status: 'available' }); fetchSlots(); setTimeout(() => setSuccess(''), 3000); }
        catch (e) { setError(e.response?.data?.message || 'Failed'); } finally { setLoading(false); }
    };
    const handleUpdateSlot = async () => {
        if (!editSlot) return; setLoading(true); setError('');
        try { await api.put(`/teacher/availability/${editSlot._id}`, slotForm); setSuccess('Updated!'); setEditSlot(null); setSlotForm({ day: 'Monday', startTime: '09:00', endTime: '10:00', status: 'available' }); fetchSlots(); setTimeout(() => setSuccess(''), 3000); }
        catch (e) { setError(e.response?.data?.message || 'Failed'); } finally { setLoading(false); }
    };
    const handleDeleteSlot = async (id) => { try { await api.delete(`/teacher/availability/${id}`); setSuccess('Deleted'); fetchSlots(); setTimeout(() => setSuccess(''), 3000); } catch (e) { } };
    const handleEditClick = (slot) => { setEditSlot(slot); setSlotForm({ day: slot.day, date: slot.date || '', startTime: slot.startTime, endTime: slot.endTime, status: slot.status }); setError(''); };
    const handleToggleStatus = async (slot) => {
        const order = ['available', 'busy', 'leave'];
        const next = (order.indexOf(slot.status) + 1) % order.length;
        try { await api.put(`/teacher/availability/${slot._id}`, { status: order[next] }); fetchSlots(); } catch (e) { }
    };
    const handleAppointmentAction = async (id, status) => {
        try { await api.put(`/teacher/appointments/${id}`, { status }); setSuccess(`Appointment ${status}!`); fetchAppointments(); setTimeout(() => setSuccess(''), 3000); } catch (e) { }
    };
    const handleLogout = () => { logout(); navigate('/login'); };

    const getStatusBadge = (s) => ({ available: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', busy: 'bg-amber-500/20 text-amber-400 border-amber-500/30', leave: 'bg-red-500/20 text-red-400 border-red-500/30' }[s] || 'bg-slate-500/20 text-slate-400 border-slate-500/30');
    const getApptStatusColor = (s) => ({ approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', rejected: 'bg-red-500/20 text-red-400 border-red-500/30' }[s] || 'bg-amber-500/20 text-amber-400 border-amber-500/30');

    // Calendar helpers
    const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (m, y) => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; };
    const getDayName = (d, m, y) => { const dt = new Date(y, m, d); return DAYS[dt.getDay() === 0 ? 6 : dt.getDay() - 1]; };
    const isSunday = (d, m, y) => new Date(y, m, d).getDay() === 0;
    const isToday = (d, m, y) => d === today.getDate() && m === today.getMonth() && y === today.getFullYear();

    const calendarData = useMemo(() => {
        const dim = getDaysInMonth(currentMonth, currentYear);
        const fd = getFirstDayOfMonth(currentMonth, currentYear);
        const slotCount = {}; slots.forEach(s => { if (s.date) slotCount[s.date] = (slotCount[s.date] || 0) + 1; });
        const apptCount = {}; appointments.forEach(a => { apptCount[a.date] = (apptCount[a.date] || 0) + 1; });
        const cells = [];
        for (let i = 0; i < fd; i++) cells.push({ empty: true });
        for (let d = 1; d <= dim; d++) {
            const dn = getDayName(d, currentMonth, currentYear), sun = isSunday(d, currentMonth, currentYear), tod = isToday(d, currentMonth, currentYear);
            const ds = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const sc = slotCount[ds] || 0, ac = apptCount[ds] || 0, ta = sc + ac;
            let hl = 0; if (ta >= 5) hl = 4; else if (ta >= 3) hl = 3; else if (ta >= 2) hl = 2; else if (ta >= 1) hl = 1;
            const daySlots = slots.filter(s => s.date === ds);
            cells.push({ day: d, dayName: dn, sunday: sun, today: tod, heatLevel: hl, slotCount: sc, apptCount: ac, statusDots: daySlots.slice(0, 4).map(s => s.status), dateStr: ds });
        }
        return cells;
    }, [currentMonth, currentYear, slots, appointments]);

    const selectedDaySlots = useMemo(() => selectedDate ? slots.filter(s => s.date === selectedDate.dateStr) : [], [selectedDate, slots]);
    const selectedDayAppointments = useMemo(() => selectedDate ? appointments.filter(a => a.date === selectedDate.dateStr) : [], [selectedDate, appointments]);
    const navigateMonth = (dir) => { let m = currentMonth + dir, y = currentYear; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } setCurrentMonth(m); setCurrentYear(y); setSelectedDate(null); };
    const handleDayClick = (cell) => { if (cell.empty) return; setSelectedDate({ day: cell.day, dayName: cell.dayName, dateStr: cell.dateStr, sunday: cell.sunday }); };
    const handleAddSlotFromCalendar = () => { setSlotForm({ day: selectedDate?.dayName || 'Monday', date: selectedDate?.dateStr || '', startTime: '09:00', endTime: '10:00', status: 'available' }); setShowAddSlot(true); setEditSlot(null); setError(''); };

    const pendingCount = appointments.filter(a => a.status === 'pending').length;
    const todayAppts = appointments.filter(a => { const ds = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`; return a.date === ds; });
    const inputClass = 'w-full px-4 py-3 bg-[#0a0118]/80 border border-purple-500/15 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all';

    const renderIcon = (name) => {
        const icons = {
            dashboard: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
            calendar: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
            requests: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>,
            mail: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
            settings: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        };
        return icons[name] || null;
    };

    const sidebarItems = [
        { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
        { id: 'schedule', icon: 'calendar', label: 'My Schedule' },
        { id: 'requests', icon: 'requests', label: 'Student Requests', badge: pendingCount },
        { id: 'messages', icon: 'mail', label: 'Messages' },
        { id: 'settings', icon: 'settings', label: 'Settings' },
    ];

    return (
        <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg,#0a0118 0%,#0f0a2a 50%,#0a0118 100%)' }}>
            {/* SIDEBAR */}
            <aside className="w-72 bg-[#0d0620]/90 backdrop-blur-xl border-r border-purple-500/10 flex flex-col fixed h-full z-40">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>
                    <div><h1 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-indigo-400 bg-clip-text text-transparent">Campus Connect</h1><p className="text-xs text-slate-500">Professor Portal</p></div>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {sidebarItems.map(item => (
                        <button key={item.id} onClick={() => setActiveSection(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${activeSection === item.id ? 'bg-purple-500/15 text-purple-300 border border-purple-500/25 shadow-lg shadow-purple-500/5' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                            <span className={activeSection === item.id ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'}>{renderIcon(item.icon)}</span>
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge > 0 && <span className="px-2 py-0.5 text-xs font-bold bg-amber-500/25 text-amber-300 rounded-full">{item.badge}</span>}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-purple-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">{user?.name?.charAt(0)?.toUpperCase() || 'T'}</div>
                        <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-200 truncate">{user?.name || 'Professor'}</p><p className="text-xs text-slate-500 truncate">{user?.department || 'Teacher'}</p></div>
                        <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10" title="Logout">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-72 transition-all duration-300">
                <div className="max-w-6xl mx-auto px-8 py-8">
                    {success && <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{success}</div>}

                    {/* ===== DASHBOARD ===== */}
                    {activeSection === 'dashboard' && (
                        <div className="space-y-8">
                            <div className="relative overflow-hidden rounded-2xl p-8" style={{ background: 'linear-gradient(135deg,#1a0a3e,#2d1b69,#1a1145)' }}>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
                                <div className="relative flex items-center justify-between">
                                    <div><h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Professor'}! 👋</h2><p className="text-slate-400">You have {todayAppts.length} appointment{todayAppts.length !== 1 ? 's' : ''} scheduled for today.</p></div>
                                    <button id="meet-now-toggle" onClick={handleToggleInstant} disabled={instantLoading} className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-3 shrink-0 ${instantAvailable ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/25' : 'bg-slate-800/60 border-2 border-slate-700 text-slate-400 hover:border-slate-600'} disabled:opacity-50`}>
                                        <span className={`w-3 h-3 rounded-full transition-all ${instantAvailable ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-slate-600'}`} />
                                        {instantLoading ? '...' : instantAvailable ? '🟢 Available Now' : '📍 Meet Now'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-6 rounded-2xl border border-purple-500/15 bg-[#110827]/80"><p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Today's Appointments</p><p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">{todayAppts.length}</p></div>
                                <div className="p-6 rounded-2xl border border-emerald-500/15 bg-[#110827]/80"><p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Students Mentored</p><p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{appointments.filter(a => a.status === 'approved').length}</p></div>
                                <div className="p-6 rounded-2xl border border-amber-500/15 bg-[#110827]/80"><p className="text-xs text-slate-500 uppercase tracking-wider mb-2">New Requests</p><p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{pendingCount}</p></div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 rounded-2xl border border-purple-500/15 bg-[#110827]/80 p-6">
                                    <h3 className="text-lg font-bold text-white mb-5">Schedule Overview</h3>
                                    {appointments.slice(0, 5).length > 0 ? (
                                        <div className="space-y-3">{appointments.slice(0, 5).map(apt => (
                                            <div key={apt._id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-purple-500/30 transition-all">
                                                <div className="text-center shrink-0"><p className="text-sm font-bold text-purple-400">{apt.timeSlot?.split(' - ')[0] || '--'}</p><p className="text-[10px] text-slate-500 uppercase">{apt.date?.slice(5) || ''}</p></div>
                                                <div className="w-px h-10 bg-purple-500/20"></div>
                                                <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-200">{apt.studentId?.name}</p><p className="text-xs text-slate-500">{apt.studentId?.department} • {apt.day}</p>{apt.message && <p className="text-xs text-slate-600 italic mt-0.5">"{apt.message}"</p>}</div>
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getApptStatusColor(apt.status)}`}>{apt.status}</span>
                                            </div>
                                        ))}</div>
                                    ) : (<div className="p-8 text-center border border-dashed border-slate-700/40 rounded-xl"><p className="text-slate-500 text-sm">No appointments yet</p></div>)}
                                </div>

                                <div className="space-y-6">
                                    {pendingCount > 0 && <div className="rounded-2xl border border-amber-500/15 bg-[#110827]/80 p-6">
                                        <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">Pending Requests<button onClick={() => setActiveSection('requests')} className="text-xs text-amber-400 hover:text-amber-300 font-medium">View All</button></h3>
                                        <div className="space-y-3">{appointments.filter(a => a.status === 'pending').slice(0, 2).map(apt => (
                                            <div key={apt._id} className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                                                <p className="text-sm font-medium text-slate-200">{apt.studentId?.name}</p>
                                                <p className="text-xs text-slate-500">{apt.day}, {apt.date} • {apt.timeSlot}</p>
                                                {apt.message && <p className="text-xs text-slate-600 italic mt-1">"{apt.message}"</p>}
                                            </div>
                                        ))}</div>
                                    </div>}
                                    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-6">
                                        <div className="flex items-center gap-2 mb-3"><span className="text-lg">💡</span><h4 className="text-sm font-bold text-indigo-300">Scheduling Tip</h4></div>
                                        <p className="text-xs text-slate-400 leading-relaxed">Use the calendar heatmap in "My Schedule" to visualize your busiest days and optimize your availability slots.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== MY SCHEDULE (CALENDAR) ===== */}
                    {activeSection === 'schedule' && (
                        <div>
                            <div className="mb-6 flex items-center justify-between"><div><h2 className="text-2xl font-bold text-white">My Schedule</h2><p className="text-sm text-slate-500 mt-1">Manage your availability slots</p></div></div>
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="rounded-2xl border border-purple-500/15 bg-[#110827]/80 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <button onClick={() => navigateMonth(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl border border-purple-500/20 bg-[#0a0118]/60 text-slate-400 hover:text-white hover:border-purple-500/50 transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                                            <h2 className="text-xl font-bold text-white">{MONTH_NAMES[currentMonth]} {currentYear}</h2>
                                            <button onClick={() => navigateMonth(1)} className="w-9 h-9 flex items-center justify-center rounded-xl border border-purple-500/20 bg-[#0a0118]/60 text-slate-400 hover:text-white hover:border-purple-500/50 transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                                        </div>
                                        <div className="calendar-grid mb-1">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (<div key={d} className={`calendar-header-cell ${i === 6 ? 'sunday' : ''}`}>{d}</div>))}</div>
                                        <div className="calendar-grid">{calendarData.map((cell, idx) => (
                                            <div key={idx} onClick={() => handleDayClick(cell)} className={`calendar-day ${cell.empty ? 'empty' : ''} ${cell.sunday ? 'sunday' : ''} ${cell.today ? 'today' : ''} ${selectedDate && selectedDate.day === cell.day && !cell.empty ? 'selected' : ''} heat-${cell.heatLevel || 0}`}>
                                                {!cell.empty && (<><span className="calendar-day-number">{cell.day}</span>{cell.statusDots?.length > 0 && <div className="calendar-day-dots">{cell.statusDots.map((s, i) => <span key={i} className={`calendar-day-dot ${s}`} />)}</div>}{cell.slotCount > 0 && <span className="text-[10px] text-slate-500 mt-0.5">{cell.slotCount}</span>}</>)}
                                            </div>
                                        ))}</div>
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/40">
                                            <div className="heatmap-legend"><span>Less</span>{[0.4, 0.1, 0.2, 0.35, 0.5].map((o, i) => <div key={i} className="legend-swatch" style={{ background: i === 0 ? 'rgba(30,41,59,0.4)' : `rgba(16,185,129,${o})` }} />)}<span>More</span></div>
                                            <div className="heatmap-legend"><span className="calendar-day-dot available inline-block" /><span>Available</span><span className="calendar-day-dot busy inline-block" /><span>Busy</span><span className="calendar-day-dot leave inline-block" /><span>Leave</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:w-96 w-full">
                                    {selectedDate ? (
                                        <div className="rounded-2xl border border-purple-500/15 bg-[#110827]/80 p-6 day-detail-panel" key={selectedDate.day}>
                                            <div className="flex items-center justify-between mb-5">
                                                <div><h3 className="text-lg font-bold text-white">{selectedDate.dayName}</h3><p className="text-xs text-slate-500 mt-0.5">{selectedDate.dateStr}{selectedDate.sunday && <span className="ml-2 px-2 py-0.5 bg-amber-500/15 text-amber-400 rounded-full text-[10px]">Sunday</span>}</p></div>
                                                <button onClick={handleAddSlotFromCalendar} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-purple-500/25 transition-all text-xs flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Slot</button>
                                            </div>
                                            {selectedDaySlots.length > 0 ? (<div className="space-y-3 mb-6"><h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Slots</h4>{selectedDaySlots.map(slot => (
                                                <div key={slot._id} className="flex items-center gap-2 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 group hover:border-purple-500/30 transition-all">
                                                    <span className="text-sm text-slate-200 font-medium flex-1">{slot.startTime} – {slot.endTime}</span>
                                                    <button onClick={() => handleToggleStatus(slot)} className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${getStatusBadge(slot.status)} hover:opacity-80`}>{slot.status}</button>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEditClick(slot)} className="p-1.5 text-slate-500 hover:text-purple-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                                                        <button onClick={() => handleDeleteSlot(slot._id)} className="p-1.5 text-slate-500 hover:text-red-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                                    </div>
                                                </div>
                                            ))}</div>) : (<div className="p-6 text-center border border-dashed border-slate-700/40 rounded-xl mb-6"><p className="text-sm text-slate-500">No slots for {selectedDate.dayName}</p></div>)}
                                            {selectedDayAppointments.length > 0 && (<div className="space-y-3"><h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Appointments</h4>{selectedDayAppointments.map(apt => (
                                                <div key={apt._id} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                                                    <div className="flex items-center justify-between mb-1"><span className="text-sm font-medium text-slate-200">{apt.studentId?.name}</span><span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${getApptStatusColor(apt.status)}`}>{apt.status}</span></div>
                                                    <p className="text-xs text-slate-500">{apt.timeSlot} • {apt.date}</p>{apt.message && <p className="text-xs text-slate-600 italic mt-1">"{apt.message}"</p>}
                                                </div>
                                            ))}</div>)}
                                        </div>
                                    ) : (<div className="rounded-2xl border border-purple-500/15 bg-[#110827]/80 p-8 text-center">
                                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-500/10 flex items-center justify-center"><svg className="w-7 h-7 text-purple-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                                        <h3 className="text-base font-semibold text-slate-400">Select a Day</h3><p className="text-xs text-slate-500 mt-1">Click any date to manage slots</p>
                                    </div>)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== REQUESTS ===== */}
                    {activeSection === 'requests' && (
                        <div>
                            <div className="mb-6"><h2 className="text-2xl font-bold text-white">Student Requests</h2><p className="text-sm text-slate-500 mt-1">Approve or reject pending appointments</p></div>
                            {appointments.filter(a => a.status === 'pending').length === 0 ? (
                                <div className="rounded-2xl border border-purple-500/15 bg-[#110827]/80 p-12 text-center"><h3 className="text-lg font-semibold text-slate-400">No Pending Requests</h3><p className="text-sm text-slate-500 mt-1">You're all caught up!</p></div>
                            ) : (
                                <div className="space-y-4">{appointments.filter(a => a.status === 'pending').map(apt => (
                                    <div key={apt._id} className="rounded-xl border border-purple-500/15 bg-[#110827]/80 p-5 hover:border-amber-500/30 transition-all">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold text-sm">{apt.studentId?.name?.charAt(0) || '?'}</div>
                                                <div><h3 className="text-sm font-semibold text-slate-200">{apt.studentId?.name}</h3><p className="text-xs text-slate-400">{apt.studentId?.email} • {apt.studentId?.department}</p><p className="text-xs text-slate-500 mt-0.5">{apt.day}, {apt.date} • {apt.timeSlot}</p>{apt.message && <p className="text-xs text-slate-600 italic mt-1">"{apt.message}"</p>}</div>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button onClick={() => handleAppointmentAction(apt._id, 'approved')} className="px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-medium hover:bg-emerald-500/25 transition-all">✓ Approve</button>
                                                <button onClick={() => handleAppointmentAction(apt._id, 'rejected')} className="px-4 py-2 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium hover:bg-red-500/25 transition-all">✕ Reject</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}</div>
                            )}
                            {appointments.filter(a => a.status !== 'pending').length > 0 && (
                                <div className="mt-8"><h3 className="text-lg font-bold text-white mb-4">History</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{appointments.filter(a => a.status !== 'pending').map(apt => (
                                        <div key={apt._id} className="rounded-xl border border-purple-500/15 bg-[#110827]/80 p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-semibold text-sm">{apt.studentId?.name?.charAt(0) || '?'}</div>
                                                    <div><h3 className="text-sm font-semibold text-slate-200">{apt.studentId?.name}</h3><p className="text-xs text-slate-400">{apt.studentId?.department}</p></div>
                                                </div>
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getApptStatusColor(apt.status)}`}>{apt.status}</span>
                                            </div>
                                            <p className="text-sm text-slate-400">{apt.day}, {apt.date} • {apt.timeSlot}</p>
                                        </div>
                                    ))}</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MESSAGES / SETTINGS placeholders */}
                    {activeSection === 'messages' && (<div className="rounded-2xl border border-purple-500/15 bg-[#110827]/80 p-12 text-center"><h3 className="text-lg font-semibold text-slate-400">Messages</h3><p className="text-sm text-slate-500 mt-1">Coming soon!</p></div>)}
                    {activeSection === 'settings' && (<div className="rounded-2xl border border-purple-500/15 bg-[#110827]/80 p-12 text-center"><h3 className="text-lg font-semibold text-slate-400">Settings</h3><p className="text-sm text-slate-500 mt-1">Coming soon!</p></div>)}
                </div>
            </main>

            {/* SLOT MODAL */}
            {(showAddSlot || editSlot) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="rounded-2xl p-6 w-full max-w-md shadow-2xl border border-purple-500/20 bg-[#110827]/95 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white">{editSlot ? 'Edit Slot' : 'Add Slot'}</h2>
                            <button onClick={() => { setShowAddSlot(false); setEditSlot(null); setError(''); }} className="text-slate-400 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium text-slate-300 mb-2">Day</label><select value={slotForm.day} onChange={e => setSlotForm({ ...slotForm, day: e.target.value })} className={inputClass}>{DAYS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                            <div><label className="block text-sm font-medium text-slate-300 mb-2">Date</label><input type="date" value={slotForm.date || ''} onChange={e => setSlotForm({ ...slotForm, date: e.target.value })} className={inputClass} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-slate-300 mb-2">Start</label><input type="time" value={slotForm.startTime} onChange={e => setSlotForm({ ...slotForm, startTime: e.target.value })} className={inputClass} /></div>
                                <div><label className="block text-sm font-medium text-slate-300 mb-2">End</label><input type="time" value={slotForm.endTime} onChange={e => setSlotForm({ ...slotForm, endTime: e.target.value })} className={inputClass} /></div>
                            </div>
                            <div><label className="block text-sm font-medium text-slate-300 mb-2">Status</label><select value={slotForm.status} onChange={e => setSlotForm({ ...slotForm, status: e.target.value })} className={inputClass}><option value="available">Available</option><option value="busy">Busy</option><option value="leave">On Leave</option></select></div>
                            <button onClick={editSlot ? handleUpdateSlot : handleAddSlot} disabled={loading} className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50">{loading ? 'Saving...' : editSlot ? 'Update' : 'Add Slot'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
