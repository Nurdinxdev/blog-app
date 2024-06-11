import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res.status(401).json({ msg: "Unauthorized - No token provided" });

    const JWT_SECRET = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded)
      return res.status(401).json({ msg: "Unauthorized - Invalid token" });

    const user = await User.findByPk(decoded.userId);

    req.user = user;
    next();
  } catch (error) {
    console.log("error in protectRoute: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      req.user = null;
      return next();
    }
    const JWT_SECRET = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded)
      return res.status(401).json({ msg: "Unauthorized - Invalid token" });

    const user = await User.findByPk(decoded.userId);

    req.user = user;
    next();
  } catch (error) {
    console.log("error in protectRoute: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectRoute;
