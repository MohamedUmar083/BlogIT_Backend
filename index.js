import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/dbConfig.js";
import authRouter from "./Routers/authRouter.js";
import userRouter from "./Routers/userRouter.js";
import postRouter from "./Routers/postRouter.js";
import adminRouter from "./Routers/adminRouter.js";

dotenv.config();

connectDB();
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
  })
);

app.use(express.json());

app.use((req, res, next, err) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.get("/ping", (req, res) => {
  res.send("This Api Works Good!");
});

// API Routes

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/admin", adminRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running sucessfully`);
});
