const express = require("express")
const adminRoute = express.Router()
const {addProduct,getProduct,deleteProduct,blockProduct,updateProduct} = require("../controller/adminController")


adminRoute.post("/addproduct",addProduct)
adminRoute.get("/getProduct",getProduct)
adminRoute.delete("/deleteproduct/:id",deleteProduct)
adminRoute.patch("/blockproduct/:id",blockProduct)
adminRoute.patch("/updateproduct/:id",updateProduct)

module.exports = adminRoute 