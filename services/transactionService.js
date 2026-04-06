const db = require('../config/db');


// ✅ CREATE TRANSACTION (Admin only - controller handles role)
const createTransaction = (data) => {
  return new Promise((resolve, reject) => {
    const { userId, amount, type, category, date, notes } = data;

    db.query(
      `INSERT INTO transactions 
       (user_id, amount, type, category, date, notes, is_deleted)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [userId, amount, type, category, date, notes],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};



// ✅ GET TRANSACTIONS (ROLE-BASED + FILTER + PAGINATION)
const getTransactionsAdvanced = (userId, role, page, limit, type, category, search) => {
  return new Promise((resolve, reject) => {

    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM transactions
      WHERE is_deleted = 0
    `;

    let params = [];

    // 🔐 ROLE-BASED ACCESS
    if (role === 'viewer') {
      query += " AND user_id = ?";
      params.push(userId);
    }
    // analyst & admin → see all (no filter)

    // 🔍 FILTERS
    if (type) {
      query += " AND type = ?";
      params.push(type);
    }

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    if (search) {
      query += " AND (notes LIKE ? OR category LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    // 📄 PAGINATION
    query += " ORDER BY date DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    db.query(query, params, (err, results) => {
      if (err) return reject(err);

      resolve({
        page: Number(page),
        limit: Number(limit),
        data: results
      });
    });

  });
};



// ✅ SOFT DELETE (Admin only - controller handles role)
const deleteTransaction = (id) => {
  return new Promise((resolve, reject) => {

    db.query(
      "UPDATE transactions SET is_deleted = 1 WHERE id = ?",
      [id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

  });
};



module.exports = {
  createTransaction,
  getTransactionsAdvanced,
  deleteTransaction
};