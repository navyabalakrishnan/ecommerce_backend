import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import serverConfig from "../config/serverConfig.js";
export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    console.log(email);

    if (password !== confirmPassword) {
      return res.status(400).json({message:"Passwords do not match"});
    }
    const userExist = await User.findOne({ email });
    console.log(userExist)
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      hashPassword,
    });

    const newUserCreated = await newUser.save();

    if (!newUserCreated) {
      return res.send("User was not created");
    }

    const token = generateToken(newUserCreated._id);
    // res.cookie("token", token);
    res.cookie("token", token,{sameSite:"None", secure:true});
    return res.status(200).json({ message: "Signed up successfully!", token });
  } catch (error) {
    console.log(error, "Something went wrong");
    res.status(500).send("Internal Server Error");
  }
};
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.send("User does not exist");
    }

    const matchPassword = await bcrypt.compare(password, user.hashPassword);

    if (!matchPassword) {
      return res.send("Password incorrect");
    }

    const token = generateToken(user._id);
    // res.cookie("token", token);
    res.cookie("token", token,{sameSite:"None", secure:true});

    return res.status(200).json({ message: "Logged in!", token });
  } catch (error) {
    console.log(error, "Something went wrong");
    res.status(500).send("Internal Server Error");
  }
};

export const checkUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, serverConfig.token);
    const user = new mongoose.Types.ObjectId(decoded.username);
    const userId = await User.findById(user);

    if (userId) {
      return res.status(200).send("User  found");
    }
    return res.status(404).send("User not found");
   }
    catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};