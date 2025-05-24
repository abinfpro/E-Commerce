const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",  // Assumes you have a "User" model
          required: true,
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",  // Assumes you have a "Product" model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,  // Default quantity if not specified
        },
      },
      { timestamps: true }
    );
module.exports = mongoose.model("Cart", cartSchema);
