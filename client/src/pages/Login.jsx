import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import { useAuthContext } from "../Context";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const userDataToInput = Object.keys(formData).map((key) => ({
    field: key,
    value: formData[key],
  }));

  const { setAuthUser } = useAuthContext();

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginPromise = axios.post("/api/users/login", formData);

    toast.promise(loginPromise, {
      loading: "Loading...",
      success: "Successfully login!",
      error: (err) => err.response.data.msg,
    });

    try {
      const { data } = await loginPromise;
      setAuthUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='min-h-screen bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center px-4'>
      <div className='max-w-md w-full bg-white dark:bg-zinc-800 shadow-md rounded-lg p-8'>
        <h2 className='text-xl font-bold text-center text-zinc-800 dark:text-white'>
          Login
        </h2>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {userDataToInput.map((data) => (
            <InputField
              key={data.field}
              label={data.field}
              type={data.field === "password" ? "password" : "text"}
              id={data.field}
              value={formData[data.field]}
              onChange={handleChange}
              placeholder={
                data.field === "email"
                  ? "example@gmail.com"
                  : data.field === "password" && "********"
              }
            />
          ))}
          <div>
            <button
              type='submit'
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              disabled={loading}
            >
              Sign in
            </button>
          </div>
          <p>
            don't have any account?{" "}
            <Link
              to={"/register"}
              className='text-indigo-500 hover:text-indigo-600'
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
