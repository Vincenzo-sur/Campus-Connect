const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
    getMyAvailability,
    addAvailability,
    updateAvailability,
    deleteAvailability,
    getAppointmentRequests,
    updateAppointmentStatus,
    toggleInstantAvailability,
    getInstantAvailability,
} = require('../controllers/teacherController');

const router = express.Router();

// All routes require teacher role
router.use(protect, authorize('teacher'));

router.route('/availability')
    .get(getMyAvailability)
    .post(addAvailability);

router.route('/availability/:id')
    .put(updateAvailability)
    .delete(deleteAvailability);

router.route('/appointments')
    .get(getAppointmentRequests);

router.route('/appointments/:id')
    .put(updateAppointmentStatus);

router.route('/instant-available')
    .get(getInstantAvailability)
    .put(toggleInstantAvailability);

module.exports = router;
