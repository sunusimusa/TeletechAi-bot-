const userSchema = new mongoose.Schema({
  telegramId: { type: String, unique: true },

  balance: { type: Number, default: 0 },
  tokens: { type: Number, default: 0 },

  energy: { type: Number, default: 100 },
  freeTries: { type: Number, default: 3 },

  lastDaily: { type: Number, default: 0 },

  // 🧾 withdraw history
  withdrawals: [
    {
      amount: Number,
      wallet: String,
      status: { type: String, default: "pending" },
      date: { type: Date, default: Date.now }
    }
  ]
});
