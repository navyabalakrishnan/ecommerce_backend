
import Product from "../models/productModel.js"
import   Seller from "../models/sellerModel.js"

import { cloudinaryInstance } from "../config/cloudinaryConfig.js";
export const createProduct = async (req, res) => {
 try {
   console.log("hitted");
   if(!req.file) {
   return res.send("file is not visible")
   }
   cloudinaryInstance.uploader.upload(req.file.path, async (err, result) => {
     if (err) {
       console.log(err, "error");
       return res.status(500).json({
         success: false,
         message: "Error",
       });
     }
     console.log("result",result)
     const imageUrl = result.url;
    
   

     const { productName, description, price,stock,sellerEmail, category  } = req.body;

     const findSeller = await Seller.findOne({ email: sellerEmail});

     if (!findSeller) {
       return res.send("please add seller first");
     }

     const createProduct = new Product({
      productName,
       description,
       price,
       stock,
       seller: findSeller._id,
       image: imageUrl,
       category
     });
     
     
     const newProductCreated = await createProduct.save();
     if (!newProductCreated) {
       return res.send("product is not created");
     }
     return res.send(newProductCreated);
   });
 } catch (error) {
   console.log("something went wrong", error);
   res.send("failed to create product");
 }
};


export const getProducts = async (req, res) => {
 try {
   const products = await Product.find();
   return res.send(products);
 }
 catch (error) {
   console.log("something went wrong,error")
   res.send("failed to fetch data")
 }
}
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(product);
  } catch (error) {
    console.error("Something went wrong:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};


export const updateProduct = async (req, res) => {
 try {
   const { id } = req.params;
   const { productName, price, description,stock } = req.body;

   const updateProduct = await Product.findByIdAndUpdate(id,
     {
     productName,
       price,
       description,
       stock
     },
     { new: true }
   );

   return res.send(updateProduct);



 } catch (error) {
   console.log("something went wrong",error)
   res.send("failed to update")
 }
}
export const deleteProduct = async (req, res) => {
 try {
   const { id } = req.params
   const deleteProduct = await Product.deleteOne({ id });
   console.log("product is deleted")

   return res.send(deleteProduct)
 
 } catch (error) {
   console.log("something went wrong",error)
   res.send("failed to delete")
 }
}
export const getProductsBySeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const products = await Product.find({ seller: seller._id });
    return res.json(products);
  } catch (error) {
    console.error("Something went wrong:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
