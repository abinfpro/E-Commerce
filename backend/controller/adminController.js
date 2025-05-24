const Product = require("../model/productSchema");

const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const getProduct = async (req, res) => {
  try {
    const product = await Product.find();
    return res.status(200).json({ message: "products", product: product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const del = await Product.findByIdAndDelete(id);
    return res.status(201).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const blockProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { blocked } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { blocked },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json({
      message: `product ${blocked ? "Blocked" : "unblocked"} successfully`,
      product,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true, // returns updated document
      runValidators: true, // validates based on schema
    });
    return res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  addProduct,
  getProduct,
  deleteProduct,
  blockProduct,
  updateProduct,
};
