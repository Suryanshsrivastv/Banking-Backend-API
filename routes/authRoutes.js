
const express = require('express');
const { register, login } = require('../controllers/authController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/protected', protect, (req, res) => {
    res.json({ message: `Hello User ${req.user.userId}, you're authenticated!` });
  });

router.post('/register', register);
router.post('/login', login);

module.exports = router;
