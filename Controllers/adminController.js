import User from "../Models/userSchema.js";
import Post from "../Models/postSchema.js";

export const getAllUser = async (req, res) => {
  try {
    const user = await User.find({ _id: { $ne: req.user.id } });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const post = await Post.find({ author: { $ne: req.user.id } }).populate(
      "author",
      "username avatar"
    );
    res.status(200).json({ result: post });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const userid = req.params.id;
  try {
    await User.findByIdAndDelete(userid);
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  const postID = req.params.id;

  const blog = await Post.findById(postID);
  const authorid = blog.author;
  try {
    await Post.findByIdAndDelete(postID);
    await User.findByIdAndUpdate(
      authorid,
      { $pull: { blogs: postID } },
      { new: true }
    );
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to delete post due to Internal Server Error" });
  }
};
