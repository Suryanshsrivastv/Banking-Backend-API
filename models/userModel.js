const db = require('../config/db');

const createUserTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await db.query(sql);
    console.log('Users table is ready');
  } catch (err) {
    console.error('Error creating users table:', err);
  }
};

createUserTable();

const createUser = async (name, email, password) => {
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  return db.query(sql, [name, email, password]);
};

const findUserByEmail = async (email) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  const [rows] = await db.query(sql, [email]);
  return rows[0];
};

module.exports = { createUser, findUserByEmail };
