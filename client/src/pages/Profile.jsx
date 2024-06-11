import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../Context";
import { CardImage } from "../components/CardPost";
import toast from "react-hot-toast";
import axios from "axios";
import { FaEdit, FaEye, FaEyeSlash, FaPlus, FaTimes } from "react-icons/fa";
import { BsGearFill } from "react-icons/bs";
import InputField from "../components/InputField";

const Sidebar = ({
  sideBar,
  setSideBar,
  sideBarRef,
  userProfile,
  setUserProfile,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [valid, setValid] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const validate = () => {
    if (
      formData?.password?.length < 8 ||
      formData?.oldPassword?.length < 8 ||
      formData?.password !== formData?.confirmPassword ||
      formData?.password?.length === 0
    )
      return false;
    return true;
  };

  useEffect(() => {
    setFormData({
      email: userProfile?.user?.email,
      username: userProfile?.user?.username,
    });
    setIsEdited(userProfile?.user?.createdAet !== userProfile?.user?.updatedAt);
    setValid(false);
  }, [userProfile]);

  useEffect(() => {
    if (!sideBar)
      setFormData({
        email: userProfile?.user?.email,
        username: userProfile?.user?.username,
        oldPassword: "",
        password: "",
        confirmPassword: "",
      });
  }, [sideBar]);

  useEffect(() => {
    setValid(validate());
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData?.password?.length < 8)
      return toast.error("Password must be at least 8 characters long");
    if (formData?.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");

    const promise = axios.patch(
      `/api/users/update/${userProfile?.user?.id}`,
      formData
    );

    toast.promise(promise, {
      loading: "Updating...",
      success: "Updated successfully",
      error: (e) =>
        e?.response?.data?.msg || e?.message || "Something went wrong",
    });

    try {
      const { data } = await promise;

      setUserProfile((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          ...data,
        },
      }));
    } catch (error) {
      console.log(error.message);
    } finally {
      setSideBar(false);
    }
  };

  return (
    <div
      className={` ${
        sideBar
          ? "fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-end"
          : ""
      }`}
    >
      <div
        className={`sidebar ${sideBar ? "sidebar-open" : ""} px-4`}
        ref={sideBarRef}
      >
        <div className='h-10'>
          <button
            className='absolute top-4 right-4 hover:scale-105 active:scale-90'
            onClick={() => setSideBar(false)}
          >
            <FaTimes className='w-6 h-6' />
          </button>
          <h2 className='text-xl font-bold my-4 flex items-center'>
            <BsGearFill className='inline mr-2' /> Settings
          </h2>
        </div>
        <h3 className='text-xl font-bold'>Edit Profile</h3>
        <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='text'
              value={userProfile?.user?.email || ""}
              readOnly
              className='input input-bordered mt-1 w-full'
              onClick={() => toast.error("Email cannot be changed")}
            />
          </div>
          <InputField
            label='Username'
            type='text'
            id='username'
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            className='input w-full mt-1 input-bordered'
          />
          {isEdited && (
            <InputFieldPassword
              label='Old Password'
              type='password'
              id='oldPassword'
              value={formData.oldPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  oldPassword: e.target.value,
                }))
              }
              className='input w-full mt-1 input-bordered'
            />
          )}
          <InputFieldPassword
            label={isEdited ? "New Password" : "Password"}
            type='password'
            id='password'
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <InputFieldPassword
            label='Confirm password'
            type='password'
            id='confirmPassword'
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
          />
          <button
            className={`py-2 px-4 btn ${
              valid ? "btn-primary" : "btn-disabled"
            }`}
            type='submit'
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

const InputFieldPassword = ({ label, type, id, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className='relative'>
      <label htmlFor={id} className='block text-sm font-medium text-white'>
        {label}
      </label>
      <div className='relative mt-1'>
        <input
          type={showPassword ? "text" : type}
          id={id}
          value={value}
          onChange={onChange}
          className='input w-full mt-1 input-bordered'
          placeholder='********'
        />
        <button
          className='absolute top-1/2 right-2 -translate-y-1/2'
          onClick={() => setShowPassword((prev) => !prev)}
          type='button'
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
};

const Profile = () => {
  const { authUser: user } = useAuthContext();
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState({});
  const [sideBar, setSideBar] = useState(false);
  const sideBarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/users/${id}`);
        setUserProfile(data);
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
        setSideBar(false);
      }
    };

    if (sideBarRef) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [sideBarRef]);

  return (
    <div className='flex flex-col items-center min-h-screen'>
      <div className='min-h-screen max-w-sm sm:max-w-3xl flex flex-col items-center justify-center'>
        <div className='sm:p-6 w-screen bg-neutral rounded-none sm:rounded-lg sm:shadow-md sm:min-w-96 sm:max-w-xl min-h-screen sm:my-8'>
          <div className='flex flex-col items-center mt-8 mx-4 '>
            <div className='relative w-full flex flex-col items-center mb-6'>
              <img
                src={userProfile?.user?.avatar}
                alt='Profile'
                className='w-24 h-24 rounded-full shadow-md'
              />
              <h2 className='text-xl font-semibold mt-4 border-b w-full text-center'>
                @{userProfile?.user?.username}
              </h2>
              {user?.id === userProfile?.user?.id && (
                <>
                  <button
                    className='absolute top-0 right-4 sm:-top-4 sm:-right-4 hover:scale-105'
                    onClick={() => setSideBar(!sideBar)}
                  >
                    <FaEdit className='w-6 h-6' />
                  </button>
                  <button
                    className='absolute -bottom-6 right-1/2 translate-x-1/2 hover:scale-105'
                    onClick={() => navigate(`/post/add`)}
                  >
                    <FaPlus className='w-6 h-6' />
                  </button>
                </>
              )}
            </div>
            <div className='mt-4 w-full grid-cols-3 grid'>
              {userProfile?.posts?.map((post) => (
                <CardImage
                  src={post.image}
                  postId={post.id}
                  key={post.id}
                  alt={post.title}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* sidebar */}
      {userProfile && (
        <Sidebar
          ref={sideBarRef}
          userProfile={userProfile}
          setSideBar={setSideBar}
          sideBar={sideBar}
          setUserProfile={setUserProfile}
        />
      )}
    </div>
  );
};

export default Profile;
