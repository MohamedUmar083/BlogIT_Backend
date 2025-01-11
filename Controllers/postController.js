import User from "../Models/userSchema.js";
import Post from "../Models/postSchema.js";

export const createPost = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res
      .status(403)
      .json({ message: "You are not allowed to create a post" });
  }
  if (!req.body.title || !req.body.content) {
    return res.status(400).json({ message: "All the fields are required" });
  }
  const { title, content, image, category } = req.body;
  const user = await User.findById(req.user.id);
  const existingBlog = await Post.findOne({ title: title });

  if (existingBlog) {
    return res.status(400).json({ message: "Title already exists." });
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const newPost = new Post({
    title,
    content,
    image,
    category,
    author: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    user.blogs.push(savedPost._id);
    await user.save();

    res
      .status(200)
      .json({ message: "Post Created Successfully", result: savedPost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error Failed to Create Post" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author")
      .populate("author", "username avatar");

    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error Failed to Fetch Posts" });
  }
};

export const getUserPost = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res
      .status(403)
      .json({ message: "You are not allowed to See this post" });
  }

  try {
    const post = await Post.find({ author: req.user.id }).populate(
      "author",
      "username avatar"
    );
    res
      .status(200)
      .json({ message: "Blogs Fetched Successfully", result: post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error Failed to Fetch Posts" });
  }
};

export const searchPost = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { title: { $regex: req.query.search, $options: "i" } },
            { category: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const post = await Post.find(keyword).populate("author", "username avatar");
    // if (post.length === 0) {
    //   return res.status(404).json({ message: "No results found" });
    // }
    res.status(200).send(post);
  } catch (error) {
    res.status(500).json({ message: "Internal server error unable to Search" });
  }
};

export const updatePost = async (req, res) => {
  const postID = req.params.id;

  try {
    const post = await Post.findById(postID);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      postID,
      {
        $set: {
          title: req.body.title,
          image: req.body.image,
          content: req.body.content,
          category: req.body.category,
        },
      },
      { new: true }
    );
    res.status(200).json({ message: "Post Updated Successfully" });
  } catch (error) {
    res.status(500).send("Internal Server Error, unable to Edit Post");
  }
};

export const deletePost = async (req, res) => {
  const postID = req.params.id;
  const user = req.user.id;
  try {
    await Post.findByIdAndDelete(postID);
    await User.findByIdAndUpdate(
      user,
      { $pull: { blogs: postID } },
      { new: true }
    );
    res.status(200).json({ message: "Your post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error, Unable to delete" });
  }
};
