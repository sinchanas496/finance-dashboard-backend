const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

// ✅ LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // ✅ STATUS CHECK
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: "User is inactive"
      });
    }

    // ✅ PASSWORD CHECK (PLAIN)
    if (password !== user.password) {
      return res.status(401).json({
        success: false,
        message: "Wrong password"
      });
    }

    // ✅ JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  loginUser
};