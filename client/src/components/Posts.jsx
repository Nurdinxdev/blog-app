import React from "react";
import CardPost from "./CardPost";

const Posts = ({ posts }) => {
  return (
    <div className='sm:grid sm:grid-cols-2 lg:grid-cols-3 flex flex-col gap-4 items-center mb-4'>
      {posts?.map((post, index) => (
        <CardPost key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
