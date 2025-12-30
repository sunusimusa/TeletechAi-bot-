const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: String,
  leader: String,
  members: [String],
  totalScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Team", teamSchema);
