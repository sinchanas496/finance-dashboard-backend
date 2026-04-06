const express = require('express');
const router = express.Router();

const controller = require('../controllers/transactionController');
const { verifyToken, allowRoles } = require('../middleware/authMiddleware');

// ✅ ONLY ADMIN CAN CREATE
router.post('/', verifyToken, allowRoles('admin'), controller.createTransaction);

// ✅ ADMIN + ANALYST CAN VIEW
router.get('/', verifyToken, allowRoles('admin', 'analyst'), controller.getTransactions);

// ✅ ONLY ADMIN CAN DELETE
router.delete('/:id', verifyToken, allowRoles('admin'), controller.deleteTransaction);

module.exports = router;