const db = require('../config/db');

// ✅ MAIN DASHBOARD DATA
const getDashboardData = (userId) => {
  return new Promise((resolve, reject) => {

    // 1️⃣ TOTAL INCOME & EXPENSE
    const totalsQuery = `
      SELECT 
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as totalExpense
      FROM transactions
      WHERE user_id = ? AND is_deleted = 0
    `;

    // 2️⃣ CATEGORY-WISE
    const categoryQuery = `
      SELECT category, SUM(amount) as total
      FROM transactions
      WHERE user_id = ? AND is_deleted = 0
      GROUP BY category
    `;

    // 3️⃣ RECENT TRANSACTIONS
    const recentQuery = `
      SELECT * FROM transactions
      WHERE user_id = ? AND is_deleted = 0
      ORDER BY date DESC
      LIMIT 5
    `;

    // 4️⃣ MONTHLY TREND
    const monthlyQuery = `
      SELECT 
        DATE_FORMAT(date, '%Y-%m') as month,
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
      FROM transactions
      WHERE user_id = ? AND is_deleted = 0
      GROUP BY month
      ORDER BY month ASC
    `;

    db.query(totalsQuery, [userId], (err, totals) => {
      if (err) return reject(err);

      db.query(categoryQuery, [userId], (err, categories) => {
        if (err) return reject(err);

        db.query(recentQuery, [userId], (err, recent) => {
          if (err) return reject(err);

          db.query(monthlyQuery, [userId], (err, monthly) => {
            if (err) return reject(err);

            resolve({
              totals: totals[0],
              categories,
              recent,
              monthly
            });
          });
        });
      });
    });

  });
};

module.exports = {
  getDashboardData
};