import bcrypt from "bcrypt";
import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const LogInController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!password || !email) {
      return res.status(202).json({
        error: "password and email are required!....",
      });
    }
    const user = await User.findOne({ email });
    console.log("i'm here");
    let isPasswordCorrect;
    if (user) {
      isPasswordCorrect = await bcrypt.compare(password, user.password);
    }

    if (!isPasswordCorrect) {
      res.status(404).json({
        error: "password or email doest not match",
      });
    }
    const secretKey = process.env.JWTSECRET;
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1d" });
    res.header("authorization", `Bearer ${token}`);
    return res.status(200).json({
      token: token,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
    });
  } catch (error) {
    console.error("Error while loggin", error);
    res.status(501).json({
      error: "Error while loggin",
    });
  }
};

export const SignUpController = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email) {
      return res.status(400).json({
        error: "name and email are required!....",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        error: "user with this email is already exist",
      });
    }
    if (!password || password.length < 6)
      return res.status(400).json({
        error: "password length must be greater than 6",
      });
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = await User.create({ name, email, password: hashedPassword });

    return res.json({
      message: "user successfully created",
      data: { name, email },
    });
  } catch (error) {
    console.error("Error while creating user", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
