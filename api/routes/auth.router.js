import express from "express";
import passport from "../config/passport.js";
import { logout, login } from "../controllers/auth.controller.js";
const r = express.Router();

r.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
r.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173",
    successRedirect: "http://localhost:5173/auth/google/callback",
  })
);
r.post("/login", login);
r.delete("/logout", logout);

export default r;
