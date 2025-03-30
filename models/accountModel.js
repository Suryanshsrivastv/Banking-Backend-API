const db = require('../config/db');

// Create accounts table if not exists
const createAccountsTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS accounts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      balance DECIMAL(10, 2) DEFAULT 0.00,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  try {
    await db.query(sql);
    console.log('Accounts table is ready');
  } catch (err) {
    console.error('Error creating accounts table:', err);
  }
};

createAccountsTable();

// Model functions
const getAccountByUserId = async (userId) => {
  const sql = 'SELECT * FROM accounts WHERE user_id = ?';
  const [rows] = await db.query(sql, [userId]);
  return rows[0];
};

const createAccount = async (userId) => {
  const sql = 'INSERT INTO accounts (user_id, balance) VALUES (?, 0.00)';
  await db.query(sql, [userId]);
};

const updateBalance = async (userId, amount) => {
  const sql = 'UPDATE accounts SET balance = ? WHERE user_id = ?';
  await db.query(sql, [amount, userId]);
};

module.exports = {
  getAccountByUserId,
  createAccount,
  updateBalance
};
