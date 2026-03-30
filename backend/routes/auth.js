const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { register, login, updateProfile } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.patch('/profile', authMiddleware, updateProfile);

module.exports = router;
