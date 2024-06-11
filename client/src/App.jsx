import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Posts from "./components/Posts";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./Context";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import SinglePost from "./pages/SinglePost";
import GoogleAuth from "./pages/GoogleAuth";

const App = () => {
  const { authUser } = useAuthContext();

  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/auth/google/callback' element={<GoogleAuth />} />
          <Route path='posts' element={<Posts />} />
          <Route path='post/add' element={<CreatePost />} />
          <Route path='/post/:postId' element={<SinglePost />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile/:id' element={<Profile />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
