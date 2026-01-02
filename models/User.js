import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  telegramId: { type: String, unique: true },

  balance: { type: Number, default: 0 },
  energy: { type: Number, default: 100 },
  freeTries: { type: Number, default: 3 },
  tokens: { type: Number, default: 0 },

  joinedYoutube: { type: Boolean, default: false },

  referralCode: { type: String, unique: true },
  referredBy: { type: String, default: null },
  referralsCount: { type: Number, default: 0 },

  lastEnergy: { type: Number, default: Date.now },
  lastDaily: { type: Number, default: 0 }
});

export default mongoose.model("User", UserSchema);
