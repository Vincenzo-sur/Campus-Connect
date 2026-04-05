const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: String,
            required: [true, 'Please specify a date'],
        },
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true,
        },
        timeSlot: {
            type: String,
            required: [true, 'Please specify a time slot'],
        },
        message: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

// Prevent double booking - unique index on teacher + date + timeSlot for non-rejected
appointmentSchema.index({ teacherId: 1, date: 1, timeSlot: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
