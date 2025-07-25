const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    // unique: true,
  },
  name: {
    type: String,
    required: true,
    // unique: true,
  },
  address: {
    type: Object,
    required: true,
  },   
  cartitem: {
    type: Array,
  },
  totalprice: {
    type: Number
  }

}, { timestamps: true }); 

module.exports = mongoose.model("Order", orderSchema);
 