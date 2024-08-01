import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["seller", "admin"],
    },
    hashPassword: {
      type: String,
      required: true,
      minLength: 6,
    },
  products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;