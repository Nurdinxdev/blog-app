import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const getPost = async (category) => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/posts?category=" + category);
      setPosts(data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    loading,
    getPost,
  };
};

export const addPost = async (formData) => {
  const res = await axios.post("/api/posts/create", formData, {
    withCredentials: true,
  });

  return res.data;
};

export const addLike = async (postId) => {
  try {
    const res = await axios.post("/api/posts/like/" + postId);

    return res.data;
  } catch (error) {
    toast.error(error.message);
    console.log(error);
  }
};

export const addCommentLike = async (postId, commentId) => {
  try {
    const res = await axios.post(
      "/api/posts/like/" + postId + "/comment/" + commentId
    );

    return res.data;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

export const editComment = async (commentId, comment) => {
  const promise = axios.put(`/api/posts/edit/${commentId}/comment`, {
    comment,
  });
  toast.promise(promise, {
    loading: "Loading...",
    success: "Successfully edited!",
    error: (err) => err.response.data.msg,
  });
  try {
    const res = await promise;
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteComment = async (commentId) => {
  try {
    const res = await axios.delete(`/api/posts/delete/${commentId}/comment`);
    return res.data;
  } catch (error) {
    toast.error(error.message);
    console.log(error);
  }
};

export const deletePost = async (postId) => {
  const promise = axios.delete(`/api/posts/delete/${postId}`);

  toast.promise(promise, {
    loading: "Loading...",
    success: "Successfully deleted!",
    error: (err) => err.response.data.msg,
  });
  try {
    const res = await promise;
    return res.data;
  } catch (error) {
    toast.error(error.message);
    console.log(error);
  }
};

export default usePosts;
