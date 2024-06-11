import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const inputClasses =
  "mt-1 block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-700 dark:text-white";
const labelClasses =
  "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

const SelectCategory = ({
  setCategory,
  setImages,
  setLoading,
  loading,
  category,
  inputRef,
}) => {
  const initialCategories = [
    { title: "Game", name: "game" },
    { title: "AI", name: "ai" },
    { title: "Dog", name: "dog" },
    { title: "Cat", name: "cat" },
    { title: "Car", name: "car" },
  ];

  const [categories, setCategories] = useState(initialCategories);
  const [query, setQuery] = useState("");
  const [previousImages, setPreviousImages] = useState([]);

  const fetchImages = async (query, page = 1) => {
    const response = await axios.get(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=82eD8PoS3WS-cNK2INaqx441EKAT8qbJ_5SKWDm4Xqc&page=${page}&per_page=12&orientation=landscape`,
      {
        withCredentials: false,
      }
    );
    return response.data.results;
  };

  const handleImageSearch = async () => {
    setLoading(true);

    try {
      if (!query) return;
      if (query !== category) setPreviousImages([]);
      if (previousImages.length >= 48) {
        throw new Error("Maximum number of images reached");
      }
      const images =
        query !== category
          ? await fetchImages(query)
          : previousImages.length % 12 === 0
          ? await fetchImages(query, 2 + previousImages.length / 12)
          : previousImages;

      setPreviousImages((prevImages) => [...prevImages, ...images]);
      setImages(images);
      setCategory(query);
      inputRef.current.value = images[0].urls.regular;
      console.log(previousImages.length);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='flex gap-4 mt-2'>
      <select
        className='select select-primary w-full max-w-xs'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      >
        <option disabled value=''>
          Category
        </option>
        {categories.map((cat, index) => (
          <option value={cat.name} key={index}>
            {cat.title}
          </option>
        ))}
      </select>
      <button
        className={`btn ${!query || loading ? "btn-disabled" : ""}`}
        onClick={handleImageSearch}
        type='button'
        disabled={!query || loading}
      >
        Get random img
      </button>
    </div>
  );
};

const InputField = ({
  label,
  type,
  id,
  value,
  onChange,
  placeholder,
  setImages,
  setLoading,
  loading,
  category,
  setCategory,
  className,
}) => {
  const inputRef = useRef(null);
  return (
    <div className='relative'>
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <input
        ref={inputRef}
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={className || inputClasses}
        placeholder={placeholder}
        disabled={type === "url"}
      />
      {type === "url" && (
        <SelectCategory
          setCategory={setCategory}
          category={category}
          loading={loading}
          setLoading={setLoading}
          setImages={setImages}
          inputRef={inputRef}
        />
      )}
    </div>
  );
};

export default InputField;
