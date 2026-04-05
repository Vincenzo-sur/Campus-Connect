const User = require('../models/User');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');

// @desc    Search teachers by name, department, or subject
// @route   GET /api/student/teachers?search=...
exports.searchTeachers = async (req, res) => {
    try {
        const { search } = req.query;
        let filter = { role: 'teacher' };

        if (search) {
            const regex = new RegExp(search, 'i');
            filter = {
                role: 'teacher',
                $or: [
                    { name: regex },
                    { department: regex },
                    { subjects: regex },
                ],
            };
        }

        const teachers = await User.find(filter).select('-password');
        res.json(teachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a teacher's availability
// @route   GET /api/student/teachers/:teacherId/availability
exports.getTeacherAvailability = async (req, res) => {
    try {
        const slots = await Availability.find({
            teacherId: req.params.teacherId,
            status: 'available',
        }).sort({ date: 1, startTime: 1 });

        res.json(slots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Book an appointment
// @route   POST /api/student/appointments
exports.bookAppointment = async (req, res) => {
    try {
        const { teacherId, date, day, timeSlot, message } = req.body;

        if (!teacherId || !date || !day || !timeSlot) {
            return res.status(400).json({ message: 'Please provide teacherId, date, day, and timeSlot' });
        }

        // Check teacher exists
        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== 'teacher') {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Check if the teacher has availability for this specific date
        const availability = await Availability.findOne({
            teacherId,
            date,
            status: 'available',
        });

        if (!availability) {
            return res.status(400).json({ message: 'Teacher is not available on this day' });
        }

        // Check for double booking — same teacher, same date, same time slot, not rejected
        const existingAppointment = await Appointment.findOne({
            teacherId,
            date,
            timeSlot,
            status: { $in: ['pending', 'approved'] },
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'This time slot is already booked. Please choose another slot.' });
        }

        // Check if student already has a pending/approved appointment with same teacher on same date
        const studentExisting = await Appointment.findOne({
            studentId: req.user._id,
            teacherId,
            date,
            status: { $in: ['pending', 'approved'] },
        });

        if (studentExisting) {
            return res.status(400).json({ message: 'You already have an appointment with this teacher on this date' });
        }

        const appointment = await Appointment.create({
            studentId: req.user._id,
            teacherId,
            date,
            day,
            timeSlot,
            message: message || '',
        });

        const populated = await Appointment.findById(appointment._id)
            .populate('teacherId', 'name email department subjects');

        res.status(201).json(populated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get student's appointment history
// @route   GET /api/student/appointments
exports.getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ studentId: req.user._id })
            .populate('teacherId', 'name email department subjects')
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
