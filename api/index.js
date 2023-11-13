import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

/*Connect to server, hiding server password */
/*We do not know if we are connected to not so we add a "then" and try to catch an error if were not -> FEEDBACK*/
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000!!!!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
