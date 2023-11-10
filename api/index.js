import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
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

app.listen(3000, () => {
  console.log("Server is running on port 3000!!!!");
});
