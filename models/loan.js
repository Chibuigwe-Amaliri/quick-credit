// src/models/Loan.js

const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected',  'completed'],
      default: 'pending',
    },

    repay: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    tenor: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    loanAmountInKobo: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentInstallment: {
      type: Number,
      required: true,
      min: 0,
    },

    balance: {
      type: Number,
      required: true,
      min: 0,
    },

    interestRate: {
      type: Number,
      required: true,
      min: 0,
    },
    interest: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'updatedOn',
    },
  }
);

module.exports = mongoose.model('Loan', loanSchema);