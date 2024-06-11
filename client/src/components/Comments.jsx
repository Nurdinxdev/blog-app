import axios, { all } from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowRight, FaHeart, FaReply } from "react-icons/fa";
import { addCommentLike, deleteComment, editComment } from "../hooks/usePosts";
import { useAuthContext } from "../Context";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
const AddComment = ({ postId, setNewComment }) => {
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const { authUser: user } = useAuthContext();

  const handleAddComment = async (e) => {
    e.preventDefault();
    const promise = axios.post(`/api/posts/${postId}/comment`, {
      comment,
    });

    toast.promise(promise, {
      loading: "Adding comment...",
      success: "Comment added successfully",
      error: "Error adding comment",
    });
    setLoading(true);
    setComment("");
    try {
      if (comment.trim() === "") throw new Error("Comment cannot be empty");
      const { data } = await promise;
      const newComment = {
        ...data.newComment,
        author: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        },
        likes: [],
      };
      setNewComment((prev) => [newComment, ...prev]);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleAddComment}
      className='flex items-center justify-between gap-4 relative'
    >
      <input
        type='text'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Add comment'
        className='input input-primary w-full'
      />

      <button
        type='submit'
        className='btn btn-primary'
        disabled={comment === "" || loading}
      >
        Add
      </button>
    </form>
  );
};

const AddReplyComment = ({ postId, commentId, setIsReplying, setNewReply }) => {
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const { authUser: user } = useAuthContext();

  const handleAddComment = async (e) => {
    e.preventDefault();
    setLoading(true);
    const promise = axios.post(`/api/posts/${postId}/comment`, {
      comment,
      parentId: commentId,
    });

    toast.promise(promise, {
      loading: "Loading...",
      success: "Successfully added!",
      error: (err) => err.response.data.msg,
    });

    try {
      if (comment.trim() === "") throw new Error("Comment cannot be empty");

      const { data } = await promise;
      const newComment = {
        ...data.newComment,
        author: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        },
        likes: [],
      };
      setNewReply((prev) => [newComment, ...prev]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setIsReplying(false);
    }
  };

  return (
    <form
      onSubmit={handleAddComment}
      className='flex items-center justify-between gap-4 relative mt-2'
    >
      <input
        type='text'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Add comment'
        className='w-full px-4 py-2 bg-transparent border-b focus:outline-none'
      />

      <button
        type='button'
        className='btn btn-error'
        onClick={() => setIsReplying(false)}
      >
        Cancle
      </button>
      <button
        type='submit'
        className='btn btn-primary'
        disabled={comment === "" || loading}
      >
        Add
      </button>
    </form>
  );
};

// Shared CSS classes
const baseTextClass = "text-sm";
const darkTextClass = "dark:text-white";
const secondaryTextColor = "text-zinc-600 dark:text-zinc-400";
const dateTextColor = "text-xs text-zinc-500 dark:text-zinc-500";

const getAllReplies = (commentId, comments) => {
  const { authUser: user } = useAuthContext();
  let replies = [];

  const directReplies = comments.filter((c) => c.parentId === commentId);

  directReplies.forEach((reply) => {
    replies.push(reply);
    replies = replies.concat(getAllReplies(reply.id, comments));
  });

  replies
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .sort((a, b) => (a.likes.length > b.likes.length ? -1 : 1));

  const userReplies = replies.filter((r) => r.author.id === user.id);
  const anotherReplies = replies.filter((r) => r.author.id !== user.id);
  const allReplies = [...userReplies, ...anotherReplies];

  return allReplies;
};

const getRootCommentsWithTotalReplies = (comments, userId) => {
  const allComments = comments
    .filter((c) => c.parentId === null)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .sort((a, b) => (a.likes.length > b.likes.length ? -1 : 1))
    .map((comment) => ({
      ...comment,
      allReplies: getAllReplies(comment.id, comments),
    }));
  const userComments = allComments.filter((c) => c.author.id === userId);
  const anotherComments = allComments.filter((c) => c.author.id !== userId);
  const rootComments = [...userComments, ...anotherComments];

  return rootComments;
};

// Main Comments component
const Comments = ({ post }) => {
  const comments = post.comments;
  const { authUser } = useAuthContext();
  const rootComments = getRootCommentsWithTotalReplies(comments, authUser?.id);
  const [newComment, setNewComment] = useState([]);

  return (
    <div className='flex flex-col gap-4 mt-2'>
      <AddComment postId={post.id} setNewComment={setNewComment} />
      <div className='space-y-4'>
        {newComment.length > 0 &&
          newComment.map((comment) => (
            <Comment
              comment={comment}
              key={comment.id}
              totalReplies={0}
              replies={[]}
            />
          ))}
        {rootComments.map((comment, index) => (
          <Comment
            key={comment.id}
            comment={comment}
            replies={comment.allReplies}
            isLast={index === rootComments.length - 1}
            totalReplies={comment.allReplies.length}
          />
        ))}
      </div>
    </div>
  );
};

// Individual Comment component
function Comment({ comment, isReply, replies, totalReplies }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isShowReplies, setIsShowReplies] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [newReply, setNewReply] = useState([]);
  const [edit, setEdit] = useState("");
  const [editedComment, setEditedComment] = useState("");

  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const inputRef = useRef(null);
  const { authUser } = useAuthContext();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
    .format(new Date(comment.createdAt))
    .replace(",", "");

  useEffect(() => {
    setLiked(comment?.likes.some((item) => item.userId === authUser?.id));
  }, [comment, authUser?.id]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showMenu]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsEditing(false);
      }
    };

    if (inputRef) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [inputRef]);

  const handleLikeComment = async () => {
    setLikes(!likes);
    setLoading(true);
    try {
      await addCommentLike(comment.postId, comment.id);
    } catch (error) {
      setLikes(!likes);
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const deleteCommentPromies = deleteComment(comment.id);

    toast.promise(deleteCommentPromies, {
      loading: "Loading...",
      success: "Successfully deleted!",
      error: (err) => err.response.data.msg,
    });

    try {
      await deleteCommentPromies;

      setIsDeleted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditComment = async () => {
    setIsEditing(false);

    try {
      const res = await editComment(comment.id, edit);

      console.log(res);
      setEditedComment(edit);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`flex flex-col ${isDeleted ? "hidden" : ""}`}>
      <div className='pb-2 border-b w-full flex items-start space-x-3 mt-2'>
        <img
          className='w-10 h-10 rounded-full hover:opacity-80 cursor-pointer'
          src={comment.author.avatar}
          alt={`${comment.author.username}'s Avatar`}
          onClick={() => navigate(`/profile/${comment.author.id}`)}
        />
        <div className='flex flex-col w-full'>
          <div className='flex flex-row  justify-between'>
            <div className='flex flex-row items-center gap-2'>
              <p
                className={`${baseTextClass} font-semibold ${darkTextClass} hover:text-gray-500 transition-all cursor-pointer`}
                onClick={() => navigate(`/profile/${comment.author.id}`)}
              >
                @{comment.author.username}
              </p>
              <p className={`${dateTextColor}`}>{formattedDate}</p>
              <p className={`${dateTextColor} `}>
                {comment.createdAt !== comment.updatedAt && "edited"}
              </p>
            </div>
            {comment.author.id === authUser?.id && (
              <div className='relative' ref={menuRef}>
                <button onClick={() => setShowMenu(!showMenu)}>
                  <BsThreeDots />
                </button>
                <div
                  className={`${
                    showMenu ? "block" : "hidden"
                  } absolute origin-top-right right-0 z-10 opacity-90 w-[120px] rounded-xl py-2 bg-zinc-800 shadow-lg`}
                >
                  <ul>
                    <li className='w-full'>
                      <span
                        className='text-red-500 bg-zinc-800 px-4 py-2 block hover:bg-zinc-700 cursor-pointer'
                        onClick={handleDelete}
                      >
                        Delete
                      </span>
                    </li>
                    <li className='w-full'>
                      <span
                        className='bg-zinc-800 px-4 py-2 block hover:bg-zinc-700 cursor-pointer'
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div
            className='flex items-center gap-4 justify-between'
            ref={inputRef}
          >
            {!isEditing ? (
              <>
                <p
                  className={`${baseTextClass} ${secondaryTextColor} break-all w-[80%]`}
                >
                  {editedComment || comment.content}
                </p>
                <div className='flex items-center gap-2'>
                  {isReply ? (
                    ""
                  ) : (
                    <>
                      <button
                        className='text-sm'
                        onClick={() => setIsReplying(!isReplying)}
                        id='buttonReply'
                      >
                        <FaReply />
                      </button>
                      <button
                        className={`text-sm `}
                        onClick={() => setIsShowReplies(!isShowReplies)}
                      >
                        {totalReplies ? totalReplies : replies.length}
                        <FaArrowRight
                          className={`inline ml-1 transition-transform ${
                            isShowReplies ? "rotate-90" : " rotate-0"
                          }`}
                        />
                      </button>
                    </>
                  )}
                  <button
                    className='text-sm'
                    onClick={handleLikeComment}
                    disabled={loading}
                  >
                    {liked && likes
                      ? comment.likes.length - 1
                      : liked
                      ? comment.likes.length
                      : likes
                      ? comment.likes.length + 1
                      : comment.likes.length}{" "}
                    <FaHeart
                      className='inline ml-1'
                      color={
                        liked && likes
                          ? "white"
                          : liked
                          ? "red"
                          : likes
                          ? "red"
                          : "white"
                      }
                    />
                  </button>
                </div>
              </>
            ) : (
              <>
                <textarea
                  className={`bg-transparent break-all w-[80%] border-b focus:outline-none resize-none`}
                  defaultValue={comment.content}
                  onChange={(e) => setEdit(e.target.value)}
                  autoFocus
                />
                <button
                  className='text-sm btn btn-error'
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  className='text-sm btn btn-primary'
                  onClick={handleEditComment}
                  disabled={loading}
                >
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {isReplying && (
        <AddReplyComment
          postId={comment.postId}
          commentId={comment.id}
          setIsReplying={setIsReplying}
          setNewReply={setNewReply}
        />
      )}
      {isShowReplies && replies.length > 0 && (
        <div className='ml-2 space-y-4'>
          {newReply.length > 0 &&
            newReply.map((reply) => (
              <Comment
                comment={reply}
                replies={[]}
                isReply={true}
                key={reply.id}
              />
            ))}
          {replies?.map((reply, index) => (
            <Comment
              key={reply.id}
              comment={reply}
              replies={[]}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Comments;
