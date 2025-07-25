require("dotenv").config();
const bcrypt = require("bcrypt");
const Razorpay = require("razorpay");
const User = require("../model/userSchema");
const Wishlist = require("../model/wishlistSchema");
const Otp = require("../model/otpSchema");
const { OAuth2Client } = require("google-auth-library");
const Product = require("../model/productSchema");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Cart = require("../model/cartSchema");
const Address = require("../model/addressSchema");
const Order = require("../model/orderSchema");
const nodemailer = require("nodemailer");
const { log } = require("console");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//  Function to Send OTP via
const sendOtp = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `E-commerce<${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP Code is: ${otp}`,
    });

    console.log(" Email sent:", info.response);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP. Try again.");
  }
};

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.isVerified) {
        await Otp.deleteMany({ userId: existingUser._id });
        const otp = crypto.randomInt(100000, 999999).toString();
        await sendOtp(email, otp, existingUser);
        return res
          .status(200)
          .json({ message: "OTP resent. Please verify.", user: existingUser });
      }
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const otp = crypto.randomInt(100000, 999999).toString();
    await sendOtp(email, otp, newUser._id);
    await Otp.create({ userId: newUser._id, otp: otp });
    res.status(201).json({
      message: "Signup successful. Please verify OTP.",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const logIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(500).json({ message: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(500).json({ message: "password dont match" });
    }

    return res
      .status(200)
      .json({ message: "loggin successfully", user: existingUser });
  } catch (error) {
    return res.status(500).json({ message: "Error" });
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

const productDetails = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    return res.status(200).json({ message: "products", product: product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.jwt, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successfully",
      user,
      token: jwtToken,
    });
  } catch (err) {
    console.error("Google login error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

const cartProduct = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cartItem = await Cart.findOne({ userId, productId, quantity });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new Cart({ userId, productId, quantity });
      await cartItem.save();
    }

    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", error: err });
  }
};

const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId }).populate(
      "productId"
    );
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart items", error: err });
  }
};

const removeToCart = async (req, res) => {
  try {
    const id = req.params.id;
    await Cart.findByIdAndDelete(id);
    return res.status(200).json({ message: "Remove" });
  } catch (error) {
    res.status(500).json({ message: "Error remove to cart" });
  }
};

const otpVerification = async (req, res) => {
  try {
    const { otp, user } = req.body;
    const userId = user._id;
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }
    const otpRecord = await Otp.findOne({ otp, userId });
    if (!otpRecord) {
      await User.deleteOne({ _id: userId, isVerified: false });
      return res.status(400).json({ message: "Invalid OTP" });
    }
    await User.findByIdAndUpdate(userId, { isVerified: true });
    await Otp.deleteOne({ _id: otpRecord._id });
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const addWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        products: [productId],
      });
    } else{
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }
      wishlist.products.push(productId);
    }
    await wishlist.save();
    res.status(201).json({ message: "Added to wishlist", wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.id }).populate(
      "products"
    );
    res.status(200).json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getWishProd = async (req, res) => {
  try {
    const { productId, userId } = req.params;
    const wish = await Wishlist.findOne({
      userId: userId,
      products: productId,
    });

    res.status(200).json({ wish, message: "sucess" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const removeWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Remove the product from the user's wishlist
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { products: productId } },
      { new: true }
    );
    if (!wishlist) {
      return res
        .status(404)
        .json({ message: "Wishlist not found", data: wishlist.products });
    }

    return res
      .status(200)
      .json({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing product from wishlist" });
  }
};

const addAddress = async (req, res) => {
  const id = req.params;
  const { streetAddress, city, state, country, zipCode } = req.body;
  try {
    const address = await Address.create({
      address: streetAddress,
      city,
      state,
      country,
      pin: zipCode,
      userId: id,
    });
    res.status(200).json({ message: "Address added successfully", address });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Failed to add address" });
  }
};

const getAddress = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Address.find({ userId: id });
    res.status(200).json({ address: data });
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ message: "Failed to fetch address" });
  }
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const payment = async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `order_rcptid_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    res
      .status(500)
      .json({ message: "Error creating order", error: err.message });
  }
};

const verify = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(sign.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.json({ success: true, message: "Payment verified successfully" });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }
};



const addOrder = async (req, res) => {
  const { selectedAddressId, cartItems, user, userId, totalPrice } = req.body;

  try {
    const existingOrder = await Order.findOne({ userId: userId });
    const address = await Address.findById(selectedAddressId);
    if (existingOrder) {
      existingOrder.cartitem.push(...cartItems);
      await existingOrder.save(); 
    } else {
      await Order.create({
        userId: user._id,
        name: user.name,
        address,
        cartitem: cartItems,
        totalprice: totalPrice,
      });
    }

    // Delete user's cart
    await Cart.deleteMany({ userId: user._id });

    res.status(201).json({ message: "Order placed successfully" });

  } catch (error) {
    console.error("Error in addOrder:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};


const getOeder = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Order.find({ userId: id });
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

module.exports = {
  signUp,
  logIn,
  getProduct,
  productDetails,
  googleLogin,
  cartProduct,
  getCart,
  removeToCart,
  otpVerification,
  addWishlist,
  getWishlist,
  getWishProd,
  removeWishlist,
  addAddress,
  getAddress,
  payment,
  verify,
  addOrder,
  getOeder,
};





// {
//   selectedAddressId: '682ff9e38171ac962cd95de7',
//   cartItems: [{
//       _id: '68835b7e1e3841eb27049cea',
//       userId: '682ff7c61eadd36f81750eb9',
//       productId: [Object],
//       quantity: 1,
//       createdAt: '2025-07-25T10:25:02.359Z',
//       updatedAt: '2025-07-25T10:25:02.359Z',
//       __v: 0
//     }],
//   userId: '682ff7c61eadd36f81750eb9',
//   user:{
//     _id: '682ff7c61eadd36f81750eb9',
//     name: 'abin f',
//     email: 'abinf.stackup@gmail.com',
//     role: 'user',
//     createdAt: '2025-05-23T04:21:26.348Z',
//     updatedAt: '2025-05-23T04:21:26.348Z',
//     __v: 0
//   },
//   totalPrice: 150
// }