// models/transactionModel.js
const db = require('../config/db');

// Create transactions table if not exists
const createTransactionTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender_id INT,
      receiver_id INT,
      amount DECIMAL(10, 2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (receiver_id) REFERENCES users(id)
    )
  `;
  try {
    await db.query(sql);
    console.log('Transactions table is ready');
  } catch (err) {
    console.error('Error creating transactions table:', err);
  }
};

createTransactionTable();

const createTransaction = async (senderId, receiverId, amount) => {
  const sql = `
    INSERT INTO transactions (sender_id, receiver_id, amount)
    VALUES (?, ?, ?)
  `;
  await db.query(sql, [senderId, receiverId, amount]);
};

const getTransactionsByUserId = async (userId) => {
  const sql = `
    SELECT * FROM transactions
    WHERE sender_id = ? OR receiver_id = ?
    ORDER BY created_at DESC
  `;
  const [rows] = await db.query(sql, [userId, userId]);
  return rows;
};

module.exports = {
  createTransaction,
  getTransactionsByUserId,
};
