import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models";

dotenv.config();

export const login = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60 * 24 * 15,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    const authUser = { id, username, email, avatar };

    res.json({ user: authUser, msg: "Login successfully" });
  } catch (error) {
    console.log("error in Auth Controller", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ msg: "Logout successfully" });
  } catch (error) {
    console.log("error in Auth Controller", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
