import express from "express";
import passport from "../config/passport.js";
import { logout, login } from "../controllers/auth.controller.js";
import dotenv from "dotenv";

dotenv.config();
const r = express.Router();
const successRedirect =
  process.env.NODE_ENV === "production"
    ? `${process.env.URL}/login`
    : "http://localhost:5173/auth/google/callback";
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
    successRedirect: successRedirect,
  })
);
r.post("/login", login);
r.delete("/logout", logout);

export default r;
