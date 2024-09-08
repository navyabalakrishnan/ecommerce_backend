import Seller from "../models/sellerModel.js";
import bcrypt from "bcrypt"
import serverConfig from "../config/serverConfig.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import adminToken from "../utils/adminToken.js";
export const signup = async (req, res) => {
    try {
      
  
      const { name,email,password,confirmPassword } = req.body;
      if (password !== confirmPassword) {
        return res.status(400).json({message:"Passwords do not match"});
      }
      const sellerExist = await Seller.findOne({ email });
      if (sellerExist) {
        return res.status(400).json({ message: "Seller already exists" });
     }
  
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);
  
      const newSeller = new Seller({
        name,
        email,
        hashPassword,
        role: "seller",
      });
      const newSellerCreated = await newSeller.save();
  
      if (!newSellerCreated) {
        return res.send("Seller not created");
      }
  
      const token = adminToken(newSellerCreated._id);
      // res.cookie("token", token);
      res.cookie("token", token,{sameSite:"None", secure:true});
      return res.status(200).json({ message: "Signed up successfully!", token });
    } catch (error) {
      console.log(error, "Something went  wrong");
      res.status(500).send("Internal Server Error");
    }
  };
export const signin = async (req, res) => {
    try {
      const body = req.body;
      const { email, password } = req.body;
      console.log(body);
      const seller = await Seller.findOne({ email });
      if (!seller) {
        return res.status(404).send("Seller not found");
      }
  
      const matchPassword = await bcrypt.compare(password, seller.hashPassword);
      if (!matchPassword) {
        return res.status(400).send("Password is incorrect");
      }
  
      const token = adminToken(seller);
      // res.cookie("token", token);
      res.cookie("token", token,{sameSite:"None", secure:true});
  
      return res.status(200).json({
        message: "Logged in!",
        token,
        sellerId: seller._id,
        role: seller.role 
      });
    } catch (error) {
      console.error("Error during sign-in:", error);
      res.status(500).send("Internal Server Error");
    }
  };
  
 
  export const getSellers = async (req, res) => {
    try {
      // const sellers = await Seller.find()
      const sellers = await Seller.find({ role: "seller" });

      res.status(200).json(sellers);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      res.status(500).send("Failed to fetch sellers");
    }
  };
  export const getSellersEmail = async (req, res) => {
    try {
      const { sellerId } = req.query;
      if (!sellerId) {
        return res.status(400).json({ message: 'Seller ID is required' });
      }
  
      const seller = await Seller.findById(sellerId).select('email');
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }
  
      res.status(200).json({ email: seller.email });
    } catch (error) {
      console.error("Error fetching seller's email:", error);
      res.status(500).send("Failed to fetch seller's email");
    }
  };
  



  export const deleteSeller = async (req, res) => {
    try {
      const { id } = req.params; 
      const deletedSeller = await Seller.findByIdAndDelete(id);
      if (!deletedSeller) {
        return res.status(404).send({ message: "Seller not found" });
      }
      res.status(200).send({ message: "Seller deleted successfully" });
    } catch (error) {
      console.error("Error deleting seller:", error);
      res.status(500).send("Failed to delete seller");
    }
  };
  export const checkSeller=async (req,res)=>
  {
    try{
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).send({ message: "Unauthorized" });
      }
      console.log(token)
      const decoded = jwt.verify(token, serverConfig.token);
      if(decoded.role === 'seller')
        {
         return res.send("seller found")
        }
        else{
          return res.send("seller not found")
        }}
    catch (error) {
      console.log(error)
    }
}
 
export const checkAdmin=async (req,res)=>
  {
    try{
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).send({ message: "Unauthorized" });
      }
     
      const decoded = jwt.verify(token, serverConfig.token);
      console.log("decoded", decoded)
      if(decoded.role === 'admin')
      {
       return res.send("admin found")
      }
      else{
        return res.send("admin not found")
      }
  //     const admin = new mongoose.Types.ObjectId(decoded.role);
  //     const adminId = await Seller.findById(admin);
  //    if (adminId) {
  //       return res.send("seller  found");
  // }
  //     return res.send("seller  not found")
  //   }
    }
    catch (error) {
      console.log(error)
    }
}
  export default {
    signup,
    signin,
    getSellers,
    deleteSeller,
    getSellersEmail,
    checkSeller,
    checkAdmin
  };
  