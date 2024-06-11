import React, { useEffect, useRef, useState } from "react";
import InputField from "../components/InputField";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addPost } from "../hooks/usePosts";
import Pagination from "../components/Pagination";

const containerClasses =
  "p-4 sm:mx-auto mx-0 bg-white rounded-lg shadow-md dark:bg-zinc-800 w-full sm:h-auto h-full";

const labelClasses =
  "block text-lg font-medium text-zinc-700 dark:text-zinc-200";

const inputBaseClasses =
  "mt-1 block w-full px-3 py-2 bg-white border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white";

function FormTextarea({ id, label, placeholder, text, setText }) {
  const textAreaRef = useRef(null);

  useEffect(() => {
    const maxHeight = 144;
    textAreaRef.current.style.height = "0px";
    const scrollHeight = textAreaRef.current.scrollHeight;
    textAreaRef.current.style.height =
      scrollHeight > maxHeight ? maxHeight + "px" : scrollHeight + "px";
  }, [text, textAreaRef]);

  return (
    <div className='mb-4'>
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <textarea
        ref={textAreaRef}
        type='text'
        className={`${inputBaseClasses} min-h-24`}
        style={{
          resize: "none",
          overflowY: textAreaRef.current?.scrollHeight > 96 ? "auto" : "hidden",
        }}
        placeholder={placeholder}
        rows='2'
        value={text}
        onChange={setText}
        id={id}
      />
    </div>
  );
}

function processDescription(description) {
  // Split description into paragraphs by newline
  const paragraphs = description
    .split("\n")
    .filter((paragraph) => paragraph.trim() !== "");

  // Wrap each paragraph with <p> tags and join them with <br> between each <p>
  return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("<br>");
}

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [imagesPreview, setImagesPreview] = useState([]);
  const [imageError, setImageError] = useState("");
  const [allImgsPreview, setAllImgsPreview] = useState([]);
  const [sliceValue, setSliceValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const navigate = useNavigate();
  const dataToInput = Object.keys(formData).map((key) => ({
    field: key,
    value: formData[key],
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const processedDescription = processDescription(formData.description);
      const data = await addPost({
        ...formData,
        category,
        description: processedDescription,
      });

      toast.success(data.msg);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    setImagesPreview(
      allImgsPreview.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    );
  }, [allImgsPreview, currentPage]);

  const mapImages = (images) => {
    const imagesPreview = images.map((image) => image.urls.regular);
    setCurrentPage(1);
    setSliceValue(0);
    setAllImgsPreview((prev) => [...prev, ...imagesPreview]);
    return;
  };

  const handleImageUrlChange = (e) => {
    setFormData({ ...formData, imageUrl: e });
    setImageError("");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSliceValue((page - 1) * itemsPerPage);
  };

  return (
    <div className='flex justify-center items-center min-h-screen w-full'>
      <div className={`${containerClasses} sm:max-w-xl`}>
        <form onSubmit={handleSubmit}>
          {dataToInput.map((data, index) => (
            <div key={index}>
              {data.field === "description" ? (
                <FormTextarea
                  label='Description (optional)'
                  placeholder='Enter description'
                  text={formData.description}
                  setText={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              ) : (
                <InputField
                  label={data.field}
                  type={data.field === "imageUrl" ? "url" : "text"}
                  placeholder={
                    data.field === "imageUrl"
                      ? "http://example.com/image.jpg"
                      : "Enter title"
                  }
                  value={data.value}
                  onChange={
                    data.field === "imageUrl"
                      ? (e) => console.log(e)
                      : (e) =>
                          setFormData({
                            ...formData,
                            [data.field]: e.target.value,
                          })
                  }
                  setCategory={(param) => {
                    setCategory(param);

                    if (param !== category && category !== "")
                      setAllImgsPreview([]);
                  }}
                  category={category}
                  setImages={(images) => {
                    mapImages(images);
                    setImageError(false);
                  }}
                  setLoading={(param) => setLoading(param)}
                  loading={loading}
                  setUrl={setFormData.imageUrl}
                />
              )}
            </div>
          ))}
          <div className='flex flex-col'>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <>
                {imageError && <p className='text-red-500'>{imageError}</p>}
                <div className='grid grid-cols-4 gap-4 my-2 grid-flow-row'>
                  {imagesPreview.length > 0 &&
                    !imageError &&
                    imagesPreview?.map((image, index) => (
                      <img
                        src={image}
                        alt=''
                        key={index}
                        className={`cursor-pointer hover:scale-105 transition`}
                        onClick={() => handleImageUrlChange(image)}
                      />
                    ))}
                </div>
              </>
            )}
            <Pagination
              totalItems={allImgsPreview.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
          <button
            className={`w-full btn bg-blue-500 hover:bg-blue-700 ${
              formData.title.length === 0 || imageError.length > 0
                ? "btn-disabled"
                : ""
            }`}
            type='submit'
            disabled={formData.title.length === 0 || imageError.length > 0}
          >
            Add Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
