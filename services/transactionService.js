const db = require('../config/db');
const createTransaction = (data) => {
  return new Promise((resolve, reject) => {
    const { userId, amount, type, category, date, notes } = data;

    db.query(
      `INSERT INTO transactions (user_id, amount, type, category, date, notes, is_deleted)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [userId, amount, type, category, date, notes],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};
// ✅ ADVANCED GET (FILTER + PAGINATION + SEARCH)
const getTransactionsAdvanced = (userId, page, limit, type, category, search) => {
  return new Promise((resolve, reject) => {

    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM transactions
      WHERE user_id = ? AND is_deleted = 0
    `;

    let params = [userId];

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




// ✅ SOFT DELETE
const deleteTransaction = (id, userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE transactions SET is_deleted = 1 WHERE id = ? AND user_id = ?",
      [id, userId],
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