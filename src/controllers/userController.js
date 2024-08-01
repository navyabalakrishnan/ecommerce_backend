import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from 'bcrypt';

export const signup = async (req, res) => {
    try {
        const {name,email,password} = req.body;
        console.log(email);

        const userExist = await User.findOne({ email });
console.log(userExist)
        if (userExist) {
            return res.send("User already exists");
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

        const token = generateToken(email);
        res.cookie("token", token);
        res.send( "Signed up successfully!" );
    } catch (error) {
        console.log(error, "Something went wrong");
        res.status(500).send("Internal Server Error");
    }
};

export const ping = (req, res) => res.send("pong");




export const signin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.send("User  does not exist");
      }
  
      const matchPassword = await bcrypt.compare(password, user.hashPassword);
  
      if (!matchPassword) {
        return res.send("Password incorrect");
      }
  
      const token = generateToken(email);
      res.cookie("token", token);
      res.send("Logged in!");
      console.log(token)
    } catch (error) {
      console.log(error, "Something wrong");
      res.status(500).send("Internal Server Error");
    }
  };
  