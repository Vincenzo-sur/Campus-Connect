const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
    searchTeachers,
    getTeacherAvailability,
    bookAppointment,
    getMyAppointments,
} = require('../controllers/studentController');

const router = express.Router();

// All routes require student role
router.use(protect, authorize('student'));

router.get('/teachers', searchTeachers);
router.get('/teachers/:teacherId/availability', getTeacherAvailability);

router.route('/appointments')
    .get(getMyAppointments)
    .post(bookAppointment);

module.exports = router;
