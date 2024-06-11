import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../Context";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";

const dropdownItemClasses =
  "block px-4 py-2 text-sm hover:text-zinc-400 hover:bg-zinc-700";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { authUser, setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      const { data } = await axios.delete("/api/auth/logout");
      toast.success(data.msg);
      localStorage.removeItem("user");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setAuthUser(false);
      navigate("/");
      toggleDropdown();
    }
  };

  const handleLogin = async () => {
    window.location.href = "http://localhost:4001/api/auth/google";
  };

  return (
    <nav className=' shadow-lg'>
      <div className='max-w-6xl mx-auto md:-px-4 px-4'>
        <div className='flex justify-between'>
          <div className='flex space-x-7'>
            <Link to='/' className='flex items-center py-4 px-2'>
              <span className='font-semibold hover:text-zinc-500 dark:hover:text-zinc-400 text-zinc-900 dark:text-zinc-400 text-lg'>
                XLogo
              </span>
            </Link>
          </div>

          <div className='flex items-center space-x-3'>
            <div className='relative' ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className={`flex items-center justify-center rounded-full ${
                  authUser
                    ? "w-10 h-10 "
                    : "text-sky-300 ring-1 ring-sky-300 px-6 py-1"
                }`}
              >
                {authUser ? (
                  <img
                    src={authUser?.avatar}
                    alt={authUser.name}
                    className='w-full h-full rounded-full'
                  />
                ) : (
                  <Link
                    className='flex items-center'
                    to={"#"}
                    onClick={handleLogin}
                  >
                    Sign In with <FaGoogle className='inline ml-1' />
                  </Link>
                )}
              </button>
              {dropdownOpen && authUser && (
                <div className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-2 bg-zinc-800 ring-1 ring-black ring-opacity-5 z-10'>
                  <Link
                    to={`/profile/${authUser.id}`}
                    onClick={toggleDropdown}
                    className={dropdownItemClasses}
                  >
                    Profile
                  </Link>
                  <div className='my-2 pt-2 border-t'>
                    <Link
                      to='/'
                      className={dropdownItemClasses}
                      onClick={handleLogout}
                    >
                      Logout
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
