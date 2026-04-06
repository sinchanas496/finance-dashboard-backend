const express = require('express');
const router = express.Router();

const controller = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

// ✅ ALL LOGGED USERS
router.get('/', verifyToken, controller.getDashboard);

module.exports = router;