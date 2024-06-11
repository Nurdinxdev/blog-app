import { Sequelize, Model } from "sequelize";
import User from "./user.model.js";
import Post from "./post.model.js";
import db from "../config/database.js";

const { DataTypes } = Sequelize;
class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
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
      allowNull: false,
    },
    parentId: {
      type: DataTypes.UUID,
      references: {
        model: Comment,
        key: "id",
      },
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: "Comment",
    timestamps: true,
  }
);

export default Comment;
