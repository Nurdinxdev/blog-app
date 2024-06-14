import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../Context";
import LoadingSkeleton from "../components/LoadingSkeleton";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuthContext();
  useEffect(() => {
    if (authUser) return navigate("/");
    const checkCookieAndGetToken = async () => {
      try {
        // Periksa apakah cookie 'jwt' ada
        const hasCookie = document.cookie
          .split(";")
          .some((item) => item.trim().startsWith("jwt="));

        if (hasCookie) {
          throw new Error("your logined");
        }

        // Lanjutkan jika cookie ada
        const { data } = await axios.post(
          "/api/auth/login",
          {},
          {
            withCredentials: true,
          }
        );

        localStorage.setItem("user", JSON.stringify(data.user));
        setAuthUser(data.user);
        navigate("/");
      } catch (error) {
        console.error("Error fetching token:", error);
        toast.error(error.message);
        navigate("/");
      }
    };

    checkCookieAndGetToken();
  }, [navigate]);

  return (
    <div className='flex flex-row items-center justify-center'>
      <div className='w-full sm:w-[50%] mx-4'>
        <LoadingSkeleton />
      </div>
    </div>
  );
};

export default GoogleAuth;
