import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models";

dotenv.config();

export const login = async (req, res) => {
  try {
    const { id, username, email, avatar } = req.user;

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
