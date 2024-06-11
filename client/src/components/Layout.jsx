import React, { Suspense } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Suspense
      fallback={<div>Loading...</div>}
      className='min-h-screen w-screen'
    >
      <Navbar />
      <Outlet />
    </Suspense>
  );
};

export default Layout;
