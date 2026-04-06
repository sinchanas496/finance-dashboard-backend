const express = require('express');
const router = express.Router();

const { loginUser } = require('../controllers/userController');
const { verifyToken, allowRoles } = require('../middleware/authMiddleware');

// PUBLIC
router.post('/login', loginUser);

// ADMIN ONLY
router.get('/', verifyToken, allowRoles('admin'), (req, res) => {
  res.send("Only admin can see users");
});

module.exports = router;