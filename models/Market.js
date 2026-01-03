import mongoose from "mongoose";

const MarketSchema = new mongoose.Schema({
  reservePoints: { type: Number, default: 1000000 },
  reserveJetton: { type: Number, default: 10000 }
});

export default mongoose.model("Market", MarketSchema);
