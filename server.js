// server.js
const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');



// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Test DB connection
db.getConnection()
  .then(() => console.log('✅ MySQL connected successfully'))
  .catch((err) => console.error('❌ MySQL connection failed:', err));

const limiter = require('./middlewares/rateLimitMiddleware');
app.use('/api', limiter);

  // Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const accountRoutes = require('./routes/accountRoutes');
app.use('/api/account', accountRoutes);





// Root Route
app.get('/', (req, res) => {
  res.send('Online Banking API is running...');
});

// Catch 404 for undefined routes
app.use((req, res, next) => {
  res.status(404);
  next(new Error('Not Found'));
});


const errorHandler = require('./middlewares/errorMiddleware');
app.use(errorHandler); // ⬅️ Must be after all other routes

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

