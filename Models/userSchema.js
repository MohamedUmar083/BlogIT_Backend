import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/049/858/303/small/in-this-serene-landscape-a-solitary-tree-stands-tall-against-a-vibrant-sunset-of-golden-hues-evoking-calmness-in-the-tranquil-rural-setting-that-embraces-natures-exquisite-beauty-photo.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
