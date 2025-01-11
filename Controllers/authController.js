import User from "../Models/userSchema.js";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !password ||
    !email ||
    username === "" ||
    password === "" ||
    email === ""
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all Required fields" });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    const { password: passkey, ...rest } = newUser._doc;
    res
      .status(200)
      .json({ message: "User registered successfully", result: rest });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ message: "Unable to register Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return res
      .status(400)
      .json({ message: "Please provide Email and Password" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User Not Exists" });
  }
  try {
    // console.log("Password from body", password);
    const userPassword = bcryptjs.compareSync(password, user.password);
    // console.log("Password from user", user.password);
    // console.log("Password after campared", userPassword);

    if (!user || !userPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_KEY
    );

    const { password: passkey, ...rest } = user._doc;

    res
      .status(200)

      .json({ message: "Logged in successfully", result: rest, token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to login Internal Server Error" });
  }
};

export const googleAuth = async (req, res, next) => {
  const { email, name, avatar } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_KEY
      );

      const { password: passkey, ...rest } = user._doc;

      res
        .status(200)
        .json({ message: "Logged in successfully", result: rest, token });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        avatar: avatar,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_KEY
      );

      const { password: passkey, ...rest } = newUser._doc;

      res
        .status(200)
        .json({ message: "Logged in successfully", result: rest, token });
    }
  } catch (error) {
    next(error);
  }
};
