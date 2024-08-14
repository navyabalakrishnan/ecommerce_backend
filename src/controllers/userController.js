import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from 'bcrypt';
export const checkUser=async (req,res)=>
{
  try
  {
    const user=req.user;
    const findUser=await User.findOne({email:user.email});
    if(!findUser){
      return res.send("user not found");
    
    }
    return res.send("user found")
  }
  catch(error){
    console.log(error)
  }
}
export const signup = async (req, res) => {
    try {
        const {name,email,password,confirmPassword} = req.body;
        console.log(email);

        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match");
        }
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






// export const signin = async (req, res) => {
//     try {
//       const { email, password } = req.body;
  
//       const user = await User.findOne({ email });
  
//       if (!user) {
//         return res.send("User  does not exist");
//       }
  
//       const matchPassword = await bcrypt.compare(password, user.hashPassword);
  
//       if (!matchPassword) {
//         return res.send("Password incorrect");
        
//       }
  
//       const token = generateToken(email);
     
//       res.cookie("token", token);
   
//       res.send("Logged in!")
//     } catch (error) {
//       console.log(error, "Something wrong");
//       res.status(500).send("Internal Server Error");
//     }
//   };
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

   
    res.cookie("token", token);

    res.send("Logged in!");
  } catch (error) {
    console.log(error, "Something went wrong");
    res.status(500).send("Internal Server Error");
  }
};
