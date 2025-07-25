const express = require("express");
const cors = require("cors");
const app = express();
const Db = require("./dbConnection/connection");
const path = require("path");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute")


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,  
  })
); 
app.use(express.json());
app.use("/api/auth",userRoute);
app.use("/api/admin",adminRoute)
app.use(express.urlencoded({ extended: true }));


require("dotenv").config();
const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on ${process.env.PORT}`);
});
Db();
