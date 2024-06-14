import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const login = (req, res) => {
  try {
    const { id, username, email, avatar } = req?.user;
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    const authUser = { id, username, email, avatar };

    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60 * 24 * 15,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

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
