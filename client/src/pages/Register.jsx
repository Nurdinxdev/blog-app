import React, { useEffect, useState } from "react";
import { useAuthContext } from "../Context";
import axios from "axios";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import { toast } from "react-hot-toast";

const Register = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [msgError, setMsgError] = useState("");
  const [loading, setLoading] = useState("");

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

  useEffect(() => {
    if (loading) toast.loading("loading...");
  }, [setLoading, loading]);

  const validateInput = () => {
    const { password, confirmPassword } = formData;
    const validPasswordLength =
      password.length >= 8 && confirmPassword.length >= 8;
    const passwordsMatch = password === confirmPassword;

    if (!validPasswordLength) {
      setMsgError("Password must be at least 8 characters long");
      return false;
    }
    if (!passwordsMatch) {
      setMsgError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateInput();
    if (!isValid) return;
    const loginPromise = axios.post("/api/users/register", formData);

    toast.promise(loginPromise, {
      pending: "Loading...",
      success: "Successfully Registered!",
      error: (err) => err.response.data.msg,
    });

    try {
      const { data } = await loginPromise;
      setAuthUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center h-screen'>
      <div className='max-w-lg w-full mx-auto p-6 bg-white dark:bg-zinc-800 shadow-lg rounded-lg '>
        <h2 className='text-2xl font-bold text-center text-zinc-900 dark:text-white mb-6'>
          Register
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {userDataToInput.map((data) => (
            <InputField
              key={data.field}
              label={data.field}
              type={
                data.field === "password" || data.field === "confirmPassword"
                  ? "password"
                  : data.field === "email"
                  ? "email"
                  : "text"
              }
              id={data.field}
              value={formData[data.field]}
              onChange={handleChange}
              placeholder={
                data.field === "username"
                  ? "example123"
                  : data.field === "email"
                  ? "example@gmail.com"
                  : data.field === "password"
                  ? "********"
                  : "********"
              }
            />
          ))}

          <span className='text-red-500 text-sm'>{msgError}</span>
          <button
            type='submit'
            className={`w-full bg-blue-500  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline 
            `}
          >
            Register
          </button>
        </form>
        <p className='text-center text-zinc-400 mt-4'>
          Already have an account?{" "}
          <Link to='/login' className='text-blue-600 hover:text-blue-700'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
