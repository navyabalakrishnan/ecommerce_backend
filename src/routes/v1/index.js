
import express from "express";
import userRouter from "./userRoute.js";
import sellerRouter from "./sellerRoute.js";
import productRouter from "./productRoute.js";
import cartRouter from "./cartRoute.js";
import reviewRouter from "./reviewRoute.js";
import orderRouter from "./orderRoute.js";
import categoryRouter from "./categoryRoute.js";
import paymentRouter from "../../controllers/paymentController.js";
const v1Router = express.Router();

v1Router.get("/", (req, res) => {
  res.send("hello world");
});

v1Router.use("/users", userRouter);
v1Router.use("/seller", sellerRouter);
v1Router.use("/product", productRouter);
v1Router.use("/cart", cartRouter);
v1Router.use("/reviews", reviewRouter);
v1Router.use("/order", orderRouter);
v1Router.use("/payment", paymentRouter);
v1Router.use("/category",categoryRouter)
export default v1Router;
