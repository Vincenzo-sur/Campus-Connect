import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#0a0118] text-white overflow-x-hidden" style={{ fontFamily: "'Lexend', 'Inter', system-ui, sans-serif" }}>
            {/* ===== NAVIGATION ===== */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#0a0118]/70 border-b border-purple-500/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-300 to-indigo-400 bg-clip-text text-transparent">
                            Campus Connect
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">How it Works</a>
                        <a href="#testimonials" className="text-sm text-slate-400 hover:text-white transition-colors">Testimonials</a>
                        <a href="#about" className="text-sm text-slate-400 hover:text-white transition-colors">About</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-purple-500/50 rounded-xl transition-all duration-300"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ===== HERO SECTION ===== */}
            <section className="relative pt-32 pb-20 px-6">
                {/* Background effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]"></div>
                    <div className="absolute top-40 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-[128px]"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-t from-purple-900/10 to-transparent"></div>
                </div>

                <div className="relative max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                        Now Available for Your Campus
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                        <span className="bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                            Connect with Your
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Professors, Effortlessly
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Streamline your academic life. Find available slots, book appointments in seconds,
                        and stay organized — all in one beautiful platform.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 rounded-2xl shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Get Started — It's Free ✨
                        </Link>
                        <a
                            href="#features"
                            className="px-8 py-4 text-base font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-purple-500/50 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Learn More →
                        </a>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center justify-center gap-8 md:gap-16 mt-16">
                        <div className="text-center">
                            <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">500+</p>
                            <p className="text-sm text-slate-500 mt-1">Active Students</p>
                        </div>
                        <div className="w-px h-10 bg-slate-700"></div>
                        <div className="text-center">
                            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">50+</p>
                            <p className="text-sm text-slate-500 mt-1">Professors</p>
                        </div>
                        <div className="w-px h-10 bg-slate-700"></div>
                        <div className="text-center">
                            <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">2,000+</p>
                            <p className="text-sm text-slate-500 mt-1">Appointments Booked</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">Streamline Your Academic Life</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-white">
                            Everything you need, in one place
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="group p-8 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Find Available Slots</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Browse real-time teacher availability calendars. See who's free now with our live "Meet Now" indicators.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group p-8 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-emerald-500/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Book Appointments</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Schedule one-on-one meetings in seconds. Send a message with context and get instant confirmations.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group p-8 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-indigo-500/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Stay Organized</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Track all your upcoming and past appointments. Never miss a meeting with status updates and reminders.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section id="how-it-works" className="py-24 px-6 relative">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[128px]"></div>
                </div>
                <div className="relative max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Simple & Intuitive</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-white">
                            How It Works
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="relative text-center p-8">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-500/30">
                                <span className="text-3xl font-bold text-white">1</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Sign Up</h3>
                            <p className="text-slate-400">
                                Create your free account as a student or professor. It takes less than 30 seconds.
                            </p>
                            {/* Connector arrow (hidden on mobile) */}
                            <div className="hidden md:block absolute top-16 right-0 translate-x-1/2 w-8 text-slate-700">
                                <svg viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M0 6h20m0 0l-4-4m4 4l-4 4" />
                                </svg>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative text-center p-8">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                                <span className="text-3xl font-bold text-white">2</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Browse or Set Availability</h3>
                            <p className="text-slate-400">
                                Students browse teacher schedules. Professors set their available time slots on an interactive calendar.
                            </p>
                            <div className="hidden md:block absolute top-16 right-0 translate-x-1/2 w-8 text-slate-700">
                                <svg viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M0 6h20m0 0l-4-4m4 4l-4 4" />
                                </svg>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center p-8">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl shadow-amber-500/30">
                                <span className="text-3xl font-bold text-white">3</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Book & Confirm</h3>
                            <p className="text-slate-400">
                                Pick a slot, send a message, and wait for confirmation. It's that simple.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section id="testimonials" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">Loved by the Campus</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-white">
                            What our community says
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Testimonial 1 */}
                        <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/40 border border-slate-700/50 backdrop-blur-md">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-slate-300 leading-relaxed mb-6">
                                "Campus Connect completely changed how I schedule my office hours. Students find me in seconds instead of emails back and forth!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                    DR
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">Dr. Elena Rodriguez</p>
                                    <p className="text-xs text-slate-500">Professor, Astrophysics</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/40 border border-slate-700/50 backdrop-blur-md">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-slate-300 leading-relaxed mb-6">
                                "I used to walk across campus just to check if my professor was available. Now I can see it all on my phone. Absolute game changer."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                                    MJ
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">Marcus Johnson</p>
                                    <p className="text-xs text-slate-500">Student, Physics Major</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/40 border border-slate-700/50 backdrop-blur-md">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-slate-300 leading-relaxed mb-6">
                                "The 'Meet Now' feature is brilliant. I set myself as available and students know immediately. Has doubled my mentoring sessions."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                                    AC
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">Dr. Alan Chen</p>
                                    <p className="text-xs text-slate-500">Professor, Computer Science</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="py-24 px-6 relative">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
                </div>
                <div className="relative max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            Ready to sync your schedule?
                        </span>
                    </h2>
                    <p className="text-lg text-slate-400 mb-10">
                        Join hundreds of students and professors already using Campus Connect to streamline academic meetings.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 rounded-2xl shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Create Free Account
                        </Link>
                        <Link
                            to="/login"
                            className="px-10 py-4 text-base font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-purple-500/50 rounded-2xl transition-all duration-300"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer id="about" className="border-t border-slate-800 py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                    <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <span className="text-lg font-bold text-white">Campus Connect</span>
                            </div>
                            <p className="text-sm text-slate-500 max-w-sm">
                                Bridging the gap between students and professors with seamless appointment scheduling.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
                            <ul className="space-y-3">
                                <li><a href="#features" className="text-sm text-slate-500 hover:text-purple-400 transition-colors">Features</a></li>
                                <li><a href="#how-it-works" className="text-sm text-slate-500 hover:text-purple-400 transition-colors">How it Works</a></li>
                                <li><a href="#testimonials" className="text-sm text-slate-500 hover:text-purple-400 transition-colors">Testimonials</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4">Account</h4>
                            <ul className="space-y-3">
                                <li><Link to="/login" className="text-sm text-slate-500 hover:text-purple-400 transition-colors">Sign In</Link></li>
                                <li><Link to="/register" className="text-sm text-slate-500 hover:text-purple-400 transition-colors">Register</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-600">© 2026 Campus Connect. All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            <span className="text-slate-600 hover:text-purple-400 transition-colors cursor-pointer">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                            </span>
                            <span className="text-slate-600 hover:text-purple-400 transition-colors cursor-pointer">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
