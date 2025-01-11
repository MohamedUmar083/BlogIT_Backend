import User from "../Models/userSchema.js";

import bcryptjs from "bcryptjs";

export const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res
      .status(400)
      .json({ message: "You are not allowed to update this user" });
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 5 || req.body.username.length > 20) {
      return res
        .status(400)
        .json({ message: "Username must be between 5 to 20 characters" });
    }
    if (req.body.username.includes(" ")) {
      return res.status(400).json({ message: "Username can't contain spaces" });
    }

    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return res
        .status(400)
        .json({ message: "Username can only contain letters and numbers" });
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,

          avatar: req.body.avatar,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res
      .status(200)
      .json({ message: "User updated successfully", result: rest });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error, unable to update " });
  }
};

export const deleteUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete this user" });
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Your account deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to delete due to Internal Server Error" });
  }
};
