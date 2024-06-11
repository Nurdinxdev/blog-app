import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../Context";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuthContext();
  useEffect(() => {
    if (authUser) return navigate("/");
    const checkCookieAndGetToken = async () => {
      try {
        // Periksa apakah cookie 'jwt' ada
        // const hasCookie = document.cookie
        //   .split(";")
        //   .some((item) => item.trim().startsWith("jwt="));

        // if (!hasCookie) {
        //   throw new Error("No cookie found");
        // }

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
        // Redirect pengguna ke halaman beranda atau halaman yang diinginkan
        navigate("/");
      } catch (error) {
        console.error("Error fetching token:", error);
        toast.error(error.message);
        navigate("/");
      }
    };

    checkCookieAndGetToken();
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default GoogleAuth;
