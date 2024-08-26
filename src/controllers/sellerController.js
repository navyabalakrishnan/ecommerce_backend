import Seller from "../models/sellerModel.js";
import bcrypt from "bcrypt"
import serverConfig from "../config/serverConfig.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import adminToken from "../utils/adminToken.js";
export const signup = async (req, res) => {
    try {
      console.log(req.body);
  
      const { name,email,password,confirmPassword } = req.body;
      if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match");
      }
      const sellerExist = await Seller.findOne({ email });
      if (sellerExist) {
        return res.send("Seller already exist");
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
      res.cookie("token", token);
      return res.status(200).json({ message: "Signed up successfully!", token });
    } catch (error) {
      console.log(error, "Something went  wrong");
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
      res.cookie("token", token);
  
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
  export const checkAdmin=async (req,res)=>
  {
    try{
      const seller=req.user;
      console.log(seller)
      const findSeller=await Seller.findOne({
        email:seller.email
      })
      if(!findSeller){
        return res.json({ success:false});
      }

        return res.json({ success:true});
      
      }
    
    
    catch(error){
      console.log(error)
    }
  }
 
  export default {
    signup,
    signin,
    getSellers,
    deleteSeller,
    getSellersEmail,
    checkAdmin
  };
  