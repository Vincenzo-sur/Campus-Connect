const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post(
    '/register',
    [
        body('name', 'Name is required').notEmpty(),
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Password must be 6+ characters').isLength({ min: 6 }),
        body('role', 'Role must be student or teacher').isIn(['student', 'teacher']),
        body('department', 'Department is required').notEmpty(),
    ],
    register
);

router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
