const service = require('../services/transactionService');


// ✅ CREATE TRANSACTION
const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    // validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const result = await service.createTransaction({
      userId: req.user.id,
      amount,
      type,
      category,
      date,
      notes
    });

    res.status(201).json({
      success: true,
      message: "Transaction created",
      data: result
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ GET WITH FILTERS
const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 5, type, category, search } = req.query;

    const data = await service.getTransactionsAdvanced(
      req.user.id,
      page,
      limit,
      type,
      category,
      search
    );

    res.json({
      success: true,
      ...data
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ SOFT DELETE
const deleteTransaction = async (req, res) => {
  try {
    await service.deleteTransaction(req.params.id, req.user.id);

    res.json({
      success: true,
      message: "Transaction deleted"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  createTransaction,
  getTransactions,
  deleteTransaction
};