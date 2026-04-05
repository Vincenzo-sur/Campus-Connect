const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
    {
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: [true, 'Please specify a day'],
        },
        date: {
            type: String,
            required: [true, 'Please specify a date (YYYY-MM-DD)'],
        },
        startTime: {
            type: String,
            required: [true, 'Please specify start time'],
        },
        endTime: {
            type: String,
            required: [true, 'Please specify end time'],
        },
        status: {
            type: String,
            enum: ['available', 'busy', 'leave'],
            default: 'available',
        },
    },
    { timestamps: true }
);

// Compound index for conflict detection — now date-specific
availabilitySchema.index({ teacherId: 1, date: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model('Availability', availabilitySchema);
