import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FaComment, FaHeart } from "react-icons/fa";
import { addLike } from "../hooks/usePosts";
import { useAuthContext } from "../Context";
import toast, { LoaderIcon } from "react-hot-toast";
import Comments from "../components/Comments";

const SinglePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(false);
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (post) {
      setLiked(post?.likes.some((item) => item.userId === authUser?.id));
    }
  }, [post, authUser?.id]);

  const handleLike = async (id) => {
    setLikes((prev) => !prev);
    setLoading(true);
    try {
      await addLike(id);
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error(error.message);
      setLikes((prev) => !prev);
    } finally {
      setLoading(false);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <img src={post.image} alt={post.title} className='w-full h-auto mb-4' />
      <div className='flex items-center mb-4'>
        <img
          src={post.author.avatar}
          alt={post.author.username}
          className='w-12 h-12 rounded-full mr-4'
        />
        <div>
          <p className='text-lg font-semibold'>{post.author.username}</p>
          <p className='text-sm text-gray-500'>
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className='flex gap-4 items-center mb-4'>
        <h1 className='text-2xl font-bold '>{post.title}</h1>
        <Link to={`/category=${post.category}`}>
          <span className='text-sm opacity-75'>#{post.category}</span>
        </Link>
        <div className='flex items-center gap-4'>
          <button
            onClick={() => handleLike(post.id)}
            disabled={loading}
            className='text-sm text-gray-500'
          >
            <FaHeart
              className={`mr-2 inline`}
              color={
                liked && likes ? "gray" : liked ? "red" : likes ? "red" : "gray"
              }
            />
            {liked && likes
              ? post?.likes.length - 1
              : liked
              ? post?.likes.length
              : likes
              ? post?.likes.length + 1
              : post?.likes.length}{" "}
          </button>
          <span className='text-sm text-gray-500'>
            {" "}
            <FaComment className='inline mr-2' />
            {post.comments.length}
          </span>
        </div>
      </div>
      <div
        className='mb-4'
        dangerouslySetInnerHTML={{ __html: post.description }}
      ></div>

      <div className='mt-2 pt-2 border-t'>
        <h1 className='text-2xl'>{post.comments.length} Comments</h1>
        <Comments post={post} />
      </div>
    </div>
  );
};

export default SinglePost;
