const db = require('../config/db');

exports.getDashboardData = (userId, role) => {
  return new Promise((resolve, reject) => {

    let query = `
      SELECT 
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as totalExpense
      FROM transactions
      WHERE is_deleted = 0
    `;

    let params = [];

    // 🔐 viewer → only own data
    if (role === 'viewer') {
      query += " AND user_id = ?";
      params.push(userId);
    }

    db.query(query, params, (err, result) => {
      if (err) return reject(err);

      const income = result[0].totalIncome || 0;
      const expense = result[0].totalExpense || 0;

      resolve({
        totalIncome: income,
        totalExpense: expense,
        balance: income - expense
      });
    });
  });
};