// Wishlist.js (Mongoose model)
const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true, // One wishlist per user
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
