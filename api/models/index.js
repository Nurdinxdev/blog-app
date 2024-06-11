import User from "./user.model.js";
import Post from "./post.model.js";
import Like from "./like.model.js";
import Comment from "./comment.model.js";

// Relasi User dan Post
User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId", as: "author" });

// Relasi User dan Comment
User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId", as: "author" });

// Relasi Post dan Comment
Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });
Comment.belongsTo(Post, { foreignKey: "postId" });

// Relasi Nested Comment
Comment.hasMany(Comment, { foreignKey: "parentId", as: "replies" });
Comment.belongsTo(Comment, { foreignKey: "parentId", as: "parent" });

// Relasi User dan Like
User.hasMany(Like, { foreignKey: "userId" });
Like.belongsTo(User, { foreignKey: "userId" });

// Relasi Post dan Like
Post.hasMany(Like, { foreignKey: "postId", as: "likes" });
Like.belongsTo(Post, { foreignKey: "postId" });

// Relasi Comment dan Like
Comment.hasMany(Like, { foreignKey: "commentId", as: "likes" });
Like.belongsTo(Comment, { foreignKey: "commentId" });

export { User, Post, Comment, Like };
