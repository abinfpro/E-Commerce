const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
      },
      price: {
        type: Number,
        required: [true, "Product price is required"],
      },
      image: {
        type: String,
        default: "", // URL of the product image
      },
      image2:{
        type: String,
        default: "",
      },
      stock: {
        type: Number,
        required: true,
        default: 0,
      },
      blocked :{
        type :Boolean,
        default : false
      }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", productSchema);
