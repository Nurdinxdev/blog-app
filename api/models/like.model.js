import { Sequelize } from "sequelize";
import User from "./user.model.js";
import Post from "./post.model.js";
import db from "../config/database.js";
import Comment from "./comment.model.js";

const { DataTypes } = Sequelize;

const Posts = db.define(
  "likes",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    postId: {
      type: DataTypes.UUID,
      references: {
        model: Post,
        key: "id",
      },
      allowNull: true,
    },
    commentId: {
      type: DataTypes.UUID,
      references: {
        model: Comment,
        key: "id",
      },
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Posts;
