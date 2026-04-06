const service = require('../services/dashboardService');

// ✅ GET DASHBOARD
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await service.getDashboardData(userId);

    const totalIncome = data.totals.totalIncome || 0;
    const totalExpense = data.totals.totalExpense || 0;

    res.json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense
      },
      categories: data.categories,
      recentTransactions: data.recent,
      monthlyTrend: data.monthly
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  getDashboard
};