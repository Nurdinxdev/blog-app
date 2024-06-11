import React, { useEffect, useRef, useState } from "react";
import { FaComment, FaHeart } from "react-icons/fa";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { addLike, deletePost } from "../hooks/usePosts";
import { useAuthContext } from "../Context";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

// Shared Tailwind CSS class constants
const containerClass =
  "max-w-sm mx-auto bg-white dark:bg-zinc-800 shadow-lg rounded-lg overflow-hidden";
const darkTextWhite = "dark:text-white";
const imageClass = "w-full h-full object-cover";

const CardPost = ({ post }) => {
  const [isDeleted, setIsdeleted] = useState(false);
  return (
    <div className={`${containerClass} ${isDeleted && "hidden"}`}>
      <CardContent>
        <CardAuthor
          author={post.author}
          postId={post.id}
          setIsdeleted={setIsdeleted}
        />
        <CardTitle
          title={post.title}
          category={post.category}
          postId={post.id}
        />
        <CardDescription description={post.description} />
      </CardContent>
      <CardImage alt='placeholder image' src={post.image} postId={post.id} />
      <div className='py-2 px-4'>
        <CardStats
          like={post.likes}
          postId={post.id}
          commentLength={post.comments.length}
        />
      </div>
    </div>
  );
};

const CardAuthor = ({ author, postId, setIsdeleted }) => {
  const navigate = useNavigate();
  const { authUser: user } = useAuthContext();

  const [showMenu, setShowMenu] = useState(false);
  const handleShowMenu = () => setShowMenu(!showMenu);
  const menuRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setShowMenu(false);
    };

    if (menuRef) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuRef]);

  const handleDeletePost = async () => {
    await deletePost(postId);
    setIsdeleted(true);
  };

  return (
    <div className='flex items-center justify-between pb-1 border-b'>
      <div className='flex items-center gap-2'>
        <img
          className='w-8 h-8 rounded-full cursor-pointer'
          src={author.avatar}
          alt={author.username}
          onClick={() => navigate(`/profile/${author.id}`)}
        />
        <Link
          className='text-zinc-700 dark:text-zinc-300 text-sm cursor-pointer'
          to={`/profile/${author.id}`}
        >
          @{author.username}
        </Link>
      </div>
      {user?.id === author.id && (
        <div className='relative' ref={menuRef}>
          <button onClick={handleShowMenu}>
            <PiDotsThreeVerticalBold />
          </button>

          {showMenu && (
            <div
              className='absolute right-0 top-8 bg-white dark:bg-zinc-800 shadow-lg rounded-md py-2 w-24'
              onClick={() => handleShowMenu()}
            >
              <Link
                to={`#post/${postId}`}
                className='block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-gray-300 dark:hover:text-white '
              >
                Edit
              </Link>
              <Link
                className='block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-red-500 dark:hover:text-red-400 transition-colors'
                onClick={handleDeletePost}
              >
                Delete
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const CardImage = ({ alt, src, postId }) => {
  const navigate = useNavigate();
  return (
    <div
      className='w-full h-56 cursor-pointer overflow-hidden'
      onClick={() => navigate(`/post/${postId}`)}
    >
      <img
        className={`${imageClass} w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-110`}
        src={src}
        alt={alt}
      />
    </div>
  );
};

const CardContent = ({ children }) => (
  <div className='py-2 px-4'>
    <div className='grid grid-rows-3'>{children}</div>
  </div>
);

const CardTitle = ({ title, category, postId }) => {
  const navigate = useNavigate();

  return (
    <div className='flex items-center gap-2'>
      <div
        className={`font-bold text-lg cursor-pointer transition-all ${darkTextWhite} hover:text-gray-500 `}
        onClick={() => navigate(`/post/${postId}`)}
      >
        {title}
      </div>
      <Link className='text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer'>
        #{category}
      </Link>
    </div>
  );
};

const CardDescription = ({ description }) => (
  <div
    className='text-zinc-700 dark:text-zinc-300 text-sm overflow-ellipsis whitespace-nowrap overflow-hidden '
    dangerouslySetInnerHTML={{
      __html:
        description.length > 25
          ? description.substring(0, 25) + "..."
          : description,
    }}
  ></div>
);

const CardStats = ({ like, postId, commentLength }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(false);
  const [loading, setLoading] = useState(false);
  const { authUser: user } = useAuthContext();

  useEffect(() => {
    setLiked(like.some((item) => item.userId === user?.id));
  }, [like, user?.id]);

  const handleLike = async () => {
    setLoading(true);
    setLikes(!likes);
    try {
      await addLike(postId);
    } catch (error) {
      setLikes(false);
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex space-x-4 ${darkTextWhite} items-center`}>
      <button
        className='text-sm sm:text-base'
        onClick={handleLike}
        disabled={loading}
      >
        <FaHeart
          color={
            liked && likes ? "white" : liked ? "red" : likes ? "red" : "white"
          }
          className='inline'
        />{" "}
        {liked && likes
          ? like.length - 1
          : liked
          ? like.length
          : likes
          ? like.length + 1
          : like.length}{" "}
        Likes
      </button>
      <span className='text-sm sm:text-base'>
        <FaComment color={darkTextWhite} className='inline' /> {commentLength}{" "}
        Comments
      </span>
    </div>
  );
};

export default CardPost;
