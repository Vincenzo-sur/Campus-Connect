const User = require('../models/User');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');

// @desc    Get my availability slots
// @route   GET /api/teacher/availability
exports.getMyAvailability = async (req, res) => {
    try {
        const slots = await Availability.find({ teacherId: req.user._id }).sort({ day: 1, startTime: 1 });
        res.json(slots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add availability slot
// @route   POST /api/teacher/availability
exports.addAvailability = async (req, res) => {
    try {
        const { day, date, startTime, endTime, status } = req.body;

        if (!day || !date || !startTime || !endTime) {
            return res.status(400).json({ message: 'Please provide day, date, startTime, and endTime' });
        }

        // Check for overlapping slots on the same specific date
        const existing = await Availability.find({
            teacherId: req.user._id,
            date,
        });

        const hasConflict = existing.some((slot) => {
            return startTime < slot.endTime && endTime > slot.startTime;
        });

        if (hasConflict) {
            return res.status(400).json({ message: 'Time slot conflicts with an existing slot on this date' });
        }

        const slot = await Availability.create({
            teacherId: req.user._id,
            day,
            date,
            startTime,
            endTime,
            status: status || 'available',
        });

        res.status(201).json(slot);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update availability slot
// @route   PUT /api/teacher/availability/:id
exports.updateAvailability = async (req, res) => {
    try {
        let slot = await Availability.findById(req.params.id);

        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        if (slot.teacherId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { day, date, startTime, endTime, status } = req.body;

        // Check for overlapping if time or date is changing
        if (date || startTime || endTime) {
            const checkDate = date || slot.date;
            const checkStart = startTime || slot.startTime;
            const checkEnd = endTime || slot.endTime;

            const existing = await Availability.find({
                teacherId: req.user._id,
                date: checkDate,
                _id: { $ne: slot._id },
            });

            const hasConflict = existing.some((s) => {
                return checkStart < s.endTime && checkEnd > s.startTime;
            });

            if (hasConflict) {
                return res.status(400).json({ message: 'Time slot conflicts with an existing slot on this date' });
            }
        }

        slot = await Availability.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(slot);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete availability slot
// @route   DELETE /api/teacher/availability/:id
exports.deleteAvailability = async (req, res) => {
    try {
        const slot = await Availability.findById(req.params.id);

        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        if (slot.teacherId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Availability.findByIdAndDelete(req.params.id);
        res.json({ message: 'Slot removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get appointment requests for teacher
// @route   GET /api/teacher/appointments
exports.getAppointmentRequests = async (req, res) => {
    try {
        const appointments = await Appointment.find({ teacherId: req.user._id })
            .populate('studentId', 'name email department')
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update appointment status (approve/reject)
// @route   PUT /api/teacher/appointments/:id
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be approved or rejected' });
        }

        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointment.teacherId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        appointment.status = status;
        await appointment.save();

        appointment = await Appointment.findById(req.params.id)
            .populate('studentId', 'name email department');

        res.json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Toggle instant availability (Meet Now)
// @route   PUT /api/teacher/instant-available
exports.toggleInstantAvailability = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.instantAvailable = !user.instantAvailable;
        await user.save();
        res.json({ instantAvailable: user.instantAvailable });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get current instant availability status
// @route   GET /api/teacher/instant-available
exports.getInstantAvailability = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('instantAvailable');
        res.json({ instantAvailable: user.instantAvailable });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
