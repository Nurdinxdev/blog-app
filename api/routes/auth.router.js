import express from "express";
import passport from "../config/passport.js";
import { logout, login } from "../controllers/auth.controller.js";
import dotenv from "dotenv";

dotenv.config();
const r = express.Router();
r.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
r.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.URL}/`,
    successRedirect: `${process.env.URL}/login`,
  })
);
r.post("/login", login);
r.delete("/logout", logout);

export default r;
