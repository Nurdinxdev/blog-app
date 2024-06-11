import { User, Post } from "../models/index.js";
import bcrypt from "bcryptjs";
export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const authUser = req.user;
    let user;

    if (authUser?.id == userId) {
      user = await User.findOne({
        where: { id: userId },
        attributes: [
          "id",
          "username",
          "avatar",
          "createdAt",
          "updatedAt",
          "email",
        ],
      });
    } else {
      user = await User.findOne({
        where: { id: userId },
        attributes: ["id", "username", "avatar", "createdAt", "updatedAt"],
      });
    }

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const posts = await Post.findAll({ where: { userId } });

    res.status(200).json({ user, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  const timePassed = 1000 * 60 * 60 * 7; //7 days
  try {
    const { id } = req.params;
    const { username, password, oldPassword } = req.body;
    const userId = req.user.id;

    if (id !== userId) return res.status(401).json({ msg: "Unauthorized" });

    const user = await User.findByPk(id, {
      attributes: ["id", "username", "password", "createdAt", "updatedAt"],
    });

    if (!user) return res.status(404).json({ msg: "User not found" });

    const hashingPassword = await bcrypt.hash(password, 10);

    if (user.createdAt !== user.updatedAt) {
      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidPassword)
        return res.status(401).json({ msg: "Invalid password" });

      const timeElapsed = Date.now() - user.updatedAt.getTime();
      if (!(timeElapsed > timePassed))
        return res
          .status(401)
          .json({ msg: "Can't update password within 7 days" });
    }

    await user.update({ username, password: hashingPassword });
    const updatedUser = {
      id: user.id,
      username,
    };
    res.status(200).json({ msg: "User updated successfully", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
