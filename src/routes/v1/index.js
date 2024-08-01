
import express from "express";
import userRouter from "./userRoute.js";
import sellerRouter from "./sellerRoute.js";
import productRouter from "./productRoute.js";
import cartRouter from "./cartRoute.js";
import orderRouter from "./orderRoute.js";
const v1Router = express.Router();

v1Router.get("/", (req, res) => {
  res.send("hello world");
});

v1Router.use("/users", userRouter);
v1Router.use("/seller", sellerRouter);
v1Router.use("/product", productRouter);
v1Router.use("/cart", cartRouter);
v1Router.use("/order", orderRouter);
export default v1Router;
