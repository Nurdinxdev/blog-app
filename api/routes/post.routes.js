import express from "express";
import {
  createPost,
  deletePost,
  getPosts,
  likePost,
  getPostById,
  addComment,
  likeComment,
  deleteComment,
  editComment,
} from "../controllers/post.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likePost); // like dislike post
router.post("/like/:postId/comment/:commentId", protectRoute, likeComment); // like dislike comment
router.post("/:id/comment", protectRoute, addComment);
router.put("/edit/:id/comment", protectRoute, editComment);
router.delete("/delete/:id", protectRoute, deletePost);
router.delete("/delete/:commentId/comment", protectRoute, deleteComment);

export default router;
