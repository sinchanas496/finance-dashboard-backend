const service = require('../services/dashboardService');

exports.getDashboard = async (req, res) => {
  try {
    const data = await service.getDashboardData(req.user.id, req.user.role);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};