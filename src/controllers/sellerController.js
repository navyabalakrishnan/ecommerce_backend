import Seller from "../models/sellerModel.js";
import bcrypt from "bcrypt"
import adminToken from "../utils/adminToken.js";
export const signup = async (req, res) => {
    try {
      console.log(req.body);
  
      const { name,email,password } = req.body;
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
  
      const token = adminToken(newSellerCreated);
      res.cookie("token", token);
      res.send("Signed up successfully!");
    } catch (error) {
      console.log(error, "Something went  wrong");
    }
  };



  export const signin = async (req, res) => {
    try {
      const body = req.body;
      const { email, password } = body;
      console.log(body);
  
      const seller = await Seller.findOne({ email });
  
      if (!seller) {
        return res.send("seller is not found");
      }
  
      const matchPassword = await bcrypt.compare(
        password,
        seller.hashPassword
      );
  
      
      if (!matchPassword) {
        return res.send("password is incorrect");
      }
  
      const token = adminToken(seller);
  
      res.cookie("token", token);
      res.send( "Logged in!");
    } catch (error) {
      console.error("Error", error);
      res.status(500).send("Internal Server Error");
    }
  };
  
  export default {
signin,signup

  }