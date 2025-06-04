const express = require("express")
const userRoute = express.Router()
const {signUp,logIn,getProduct,productDetails,googleLogin, cartProduct, getCart, removeToCart, otpVerification, addWishlist, getWishlist,getWishProd, removeWishlist, addAddress, getAddress, payment, verify,addOrder, getOeder} =  require ("../controller/userController")


userRoute.post("/signup",signUp)
userRoute.post("/login",logIn)
userRoute.get("/getproduct",getProduct)
userRoute.get("/productdetails/:id",productDetails)
userRoute.post("/google",googleLogin)
userRoute.post("/cart",cartProduct)
userRoute.get("/cart/:userId",getCart)
userRoute.delete("/cart/:id",removeToCart)
userRoute.post("/otp",otpVerification)
userRoute.post("/wishlist",addWishlist)
userRoute.get("/wishlist/:id",getWishlist)
userRoute.patch("/wishlistremove",removeWishlist)
userRoute.post ("/address/:id",addAddress)
userRoute.get("/address/:id",getAddress)
userRoute.post("/payment",payment)
userRoute.post("/verify",verify)
userRoute.get("/getwishlistproduct/:productId/:userId", getWishProd);
userRoute.post("/addorder",addOrder)
userRoute.get("/getoder/:id",getOeder)


module.exports = userRoute

