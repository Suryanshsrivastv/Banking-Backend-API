const {
    getAccountByUserId,
    createAccount,
    updateBalance
  } = require('../models/accountModel');

const { createTransaction, getTransactionsByUserId } = require('../models/transactionModel');
const { findUserByEmail } = require('../models/userModel');
  

  const deposit = async (req, res) => {
    const userId = req.user.userId;
    const { amount } = req.body;
  
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid deposit amount' });
    }
  
    try {
      let account = await getAccountByUserId(userId);
  
      // Create account if doesn't exist
      if (!account) {
        await createAccount(userId);
        account = await getAccountByUserId(userId);
      }
  
      const newBalance = parseFloat(account.balance) + parseFloat(amount);
      await updateBalance(userId, newBalance);
  
      res.status(200).json({ message: 'Deposit successful', balance: newBalance });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  const withdraw = async (req, res) => {
    const userId = req.user.userId;
    const { amount } = req.body;
  
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid withdraw amount' });
    }
  
    try {
      const account = await getAccountByUserId(userId);
      if (!account || parseFloat(account.balance) < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
  
      const newBalance = parseFloat(account.balance) - parseFloat(amount);
      await updateBalance(userId, newBalance);
  
      res.status(200).json({ message: 'Withdraw successful', balance: newBalance });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const transfer = async (req, res) => {
    const senderId = req.user.userId;
    const { receiverEmail, amount } = req.body;
  
    if (!receiverEmail || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid transfer details' });
    }
  
    try {
      // Find receiver
      const receiver = await findUserByEmail(receiverEmail);
      if (!receiver) {
        return res.status(404).json({ message: 'Receiver not found' });
      }
      if (receiver.id === senderId) {
        return res.status(400).json({ message: 'You cannot transfer to yourself' });
      }
  
      // Get both accounts
      const senderAcc = await getAccountByUserId(senderId);
      const receiverAcc = await getAccountByUserId(receiver.id);
  
      if (!senderAcc || parseFloat(senderAcc.balance) < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
  
      // If receiver doesn't have an account, create one
      if (!receiverAcc) {
        await createAccount(receiver.id);
      }
  
      // Perform transaction (deduct + add + log)
      const newSenderBalance = parseFloat(senderAcc.balance) - parseFloat(amount);
      const newReceiverBalance = receiverAcc
        ? parseFloat(receiverAcc.balance) + parseFloat(amount)
        : parseFloat(amount);
  
      await updateBalance(senderId, newSenderBalance);
      await updateBalance(receiver.id, newReceiverBalance);
      await createTransaction(senderId, receiver.id, amount);
  
      res.status(200).json({ message: 'Transfer successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const getTransactionHistory = async (req, res) => {
    const userId = req.user.userId;
  
    try {
      const transactions = await getTransactionsByUserId(userId);
      res.status(200).json({ transactions });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports = { deposit, withdraw, transfer, getTransactionHistory };
  