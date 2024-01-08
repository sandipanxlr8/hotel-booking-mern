import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    check("firstName", "First name is requried").isString(),
    check("lastName", "Last name is requried").isString(),
    check("email", "Email is requried with correct format").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array() });

    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) return res.status(400).json({ message: "User alrady exits" });

      user = new User(req.body);
      await user.save();
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "2h" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        maxAge: 7200000,
      });
      return res.status(200).json({ message: "user registered successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
    }
  }
);

export default router;
