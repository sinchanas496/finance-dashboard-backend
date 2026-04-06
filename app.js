const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ ROUTES IMPORT
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// ✅ ROUTES USE
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ✅ TEST ROUTE
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ ERROR HANDLER (LAST)
const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);

// ✅ SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});