import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";

const PORT = 3000 || process.env.PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users", userRoutes);

mongoose
  .connect(process.env.MONGODB_URL as string)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Error occured: ${error}`);
  });
