import express from "express";
import passport from "../config/passport.js";
import { logout, login } from "../controllers/auth.controller.js";
import dotenv from "dotenv";
import protectRoute from "../middlewares/protectRoute.js";

dotenv.config();
const r = express.Router();
const successRedirect =
  process.env.NODE_ENV === "production"
    ? `${process.env.URL}/login`
    : "http://localhost:5173/login";
const failureRedirect =
  process.env.NODE_ENV === "production"
    ? `${process.env.URL}/`
    : "http://localhost:5173/";

r.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
r.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: failureRedirect,
  }),
  (req, res) => {
    // Set JWT in cookie
    res.cookie("jwt", req.user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    // Redirect to success URL
    res.redirect(successRedirect);
  }
);
r.post("/login", protectRoute, login);
r.delete("/logout", logout);

export default r;
