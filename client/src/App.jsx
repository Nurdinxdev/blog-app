import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import SinglePost from "./pages/SinglePost";
import GoogleAuth from "./pages/GoogleAuth";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/login' element={<GoogleAuth />} />
          <Route path='/post/add' element={<CreatePost />} />
          <Route path='/post/:postId' element={<SinglePost />} />
          <Route path='/profile/:id' element={<Profile />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
