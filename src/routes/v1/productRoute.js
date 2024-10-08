
import express from "express";
import { upload } from "../../middleware/uploadMiddleware.js";
import authenticateSeller from "../../middleware/sellerMiddleware.js";
import { createProduct, getProducts, getProductById,  getProductsBySeller,updateProduct,deleteProduct} from "../../controllers/productController.js";


const productRouter = express.Router();
productRouter.get("/", getProducts);
productRouter.post("/add-products", upload.single("image"),authenticateSeller, createProduct);
productRouter.put("/:id", authenticateSeller,updateProduct );
productRouter.delete("/:id", deleteProduct);
productRouter.get("/manage-products", getProductsBySeller);
productRouter.get("/:id",  getProductById);
export default productRouter;

