import React, { useState, useEffect } from "react";
import Posts from "../components/Posts";
import usePosts from "../hooks/usePosts";
import LoadingSkeleton from "../components/LoadingSkeleton";

const Home = () => {
  const Categories = [
    { title: "Latest post", name: "latest post" },
    { title: "Populer post", name: "populer post" },
    { title: "Game", name: "game" },
    { title: "AI", name: "ai" },
    { title: "Dog", name: "dog" },
    { title: "Cat", name: "cat" },
    { title: "Car", name: "car" },
  ];
  const category = window.location.search.split("=")[1];
  const [q, setQ] = useState(category || "");
  const { loading, getPost, posts } = usePosts();

  useEffect(() => {
    if (loading) return;
    getPost(!q ? "latest post" : q);
  }, [q]);

  return (
    <main className='flex flex-row justify-center mt-12'>
      <div className='flex flex-col items-start w-[90%] '>
        <select
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className='select select-primary'
        >
          <option disabled value=''>
            Category
          </option>
          {Categories.map((cat, index) => (
            <option value={cat.name} key={index}>
              {cat.title}
            </option>
          ))}
        </select>
        <div className='divider'></div>
        {loading ? <LoadingSkeleton /> : <Posts posts={posts} />}
      </div>
    </main>
  );
};

export default Home;
