import { Comment, Like, Post, User } from "../models/index.js";

export const getPosts = async (req, res) => {
  const { category: currentCategory } = req.query;
  try {
    let posts;
    if (currentCategory === "populer post") {
      posts = await Post.findAll({
        include: [
          {
            model: User,
            as: "author",
            attributes: ["username", "avatar", "id"],
          },
          {
            model: Like,
            as: "likes",
          },
          {
            model: Comment,
            as: "comments",
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      posts.sort((a, b) => b.likes.length - a.likes.length);
    } else {
      const allowedCategory = ["ai", "dog", "cat", "car", "game"];
      let whereCondition =
        currentCategory !== "latest post" ? { category: currentCategory } : {};

      if (!allowedCategory.includes(currentCategory)) whereCondition = {};

      posts = await Post.findAll({
        where: whereCondition,
        include: [
          {
            model: User,
            as: "author",
            attributes: ["username", "avatar", "id"],
          },
          {
            model: Like,
            as: "likes",
          },
          {
            model: Comment,
            as: "comments",
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["username", "avatar", "id"],
        },
        {
          model: Like,
          as: "likes",
        },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["username", "avatar", "id"],
            },
            {
              model: Like,
              as: "likes",
            },
            {
              model: Comment,
              as: "replies",
              include: [
                {
                  model: User,
                  as: "author",
                  attributes: ["username", "avatar", "id"],
                },
                {
                  model: Like,
                  as: "likes",
                },
              ],
            },
          ],
        },
      ],
    });

    res.json(post);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, imageUrl, description, category } = req.body;
    const author = req.user.id;
    const post = await Post.create({
      title,
      image: imageUrl,
      description,
      category,
      userId: author,
    });

    res.status(201).json({ post, msg: "Post created Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const author = req.user.id;

    await Post.destroy({ where: { id, userId: author } });
    res.status(200).json({ msg: "Post deleted successfully" });
  } catch {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["username", "avatar", "id"],
        },
        {
          model: Like,
          as: "likes",
        },
        {
          model: Comment,
          as: "comments",
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    let isLiked;
    for (const like of post.likes) {
      if (like.userId === userId) {
        isLiked = true;
        break;
      } else {
        isLiked = false;
      }
    }

    if (isLiked) {
      await Like.destroy({ where: { postId: id, userId } });
      res.json({ msg: "Post unliked successfully" });
    } else {
      await Like.create({ postId: id, userId });
      res.json({ msg: "Post liked successfully" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const post = await Post.findByPk(postId);

    if (!post) return res.status(404).json({ msg: "Post not found" });

    const comment = await Comment.findOne({
      where: { id: commentId },
      include: [
        {
          model: Like,
          as: "likes",
        },
      ],
    });

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    let isLiked;
    for (const like of comment.likes) {
      if (like.userId === userId) {
        isLiked = true;
        break;
      } else {
        isLiked = false;
      }
    }

    if (isLiked) {
      await Like.destroy({ where: { commentId, userId } });
      res.json({ msg: "Comment unliked successfully" });
    } else {
      await Like.create({ commentId, userId });
      res.json({ msg: "Comment liked successfully" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { comment, parentId } = req.body;
    const userId = req.user.id;

    const post = await Post.findByPk(postId);

    if (!post) return res.status(404).json({ msg: "Post Not Found " });
    if (comment.trim() === "")
      return res.status(400).json({ msg: "Comment cannot be empty" });
    let newComment;
    if (parentId) {
      newComment = await Comment.create({
        content: comment,
        userId,
        postId,
        parentId,
      });
    } else {
      newComment = await Comment.create({
        content: comment,
        userId,
        postId,
      });
    }

    if (!newComment) return res.status(404).json({ msg: "comment not found" });

    res.status(201).json({ newComment, msg: "Comment created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editComment = async (req, res) => {
  const timePassed = 1000 * 60 * 60 * 1;
  try {
    const { id: commentId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;
    const commentData = await Comment.findOne({ where: { id: commentId } });
    if (!commentData) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (commentData.userId !== userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const canEdit =
      new Date(commentData.createdAt) > new Date(Date.now() - timePassed);
    if (!canEdit) {
      return res
        .status(400)
        .json({ msg: "You can only edit a comment within 1 hour of posting" });
    }

    await Comment.update({ content: comment }, { where: { id: commentId } });

    res.json({ msg: "Comment updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const comment = await Comment.findOne({ where: { id: commentId } });

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    await Comment.destroy({ where: { id: commentId } });

    res.json({ msg: "Comment deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
