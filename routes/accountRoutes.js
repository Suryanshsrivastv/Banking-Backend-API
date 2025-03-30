const express = require('express');
const { deposit, withdraw, transfer, getTransactionHistory } = require('../controllers/accountController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);
router.post('/transfer', protect, transfer);
router.get('/transactions', protect, getTransactionHistory);

module.exports = router;
