import express from "express";
import { getUser, updateUser } from "../controllers/user.controller.js";
import protectRoute, { isLogin } from "../middlewares/protectRoute.js";

const r = express.Router();

r.patch("/update/:id", protectRoute, updateUser);
r.get("/:id", isLogin, getUser);

export default r;
