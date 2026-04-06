const db = require('../config/db');

// Create user
const createUser = (name, email, role) => {
  return db.promise().query(
    'INSERT INTO users (name, email, role) VALUES (?, ?, ?)',
    [name, email, role]
  );
};

// Get all users
const getUsers = () => {
  return db.promise().query('SELECT * FROM users');
};

// Update user
const updateUser = (id, role, status) => {
  return db.promise().query(
    'UPDATE users SET role = ?, status = ? WHERE id = ?',
    [role, status, id]
  );
};

module.exports = {
  createUser,
  getUsers,
  updateUser
};