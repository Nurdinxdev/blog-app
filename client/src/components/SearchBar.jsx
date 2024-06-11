import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Shared constants for repeated TailwindCSS classes
const inputClasses =
  "w-full px-4 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
const containerClasses =
  "absolute left-0 right-0 bg-white border border-t-0 border-zinc-300 rounded-b-md shadow-lg dark:bg-zinc-800 dark:border-zinc-700 py-2";
const suggestionClasses =
  "p-2 hover:bg-zinc-100 cursor-pointer dark:hover:bg-zinc-700";

const SearchBar = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // List of possible suggestions
  const allSuggestions = [
    { name: "Apple", category: "Fruit", id: 1 },
    { name: "Banana", category: "Fruit", id: 2 },
    { name: "Cherry", category: "Fruit", id: 3 },
    { name: "Date", category: "Fruit", id: 4 },
    { name: "Elderberry", category: "Fruit", id: 5 },
    { name: "Fig", category: "Fruit", id: 6 },
    { name: "Grape", category: "Fruit", id: 7 },
    { name: "Honeydew", category: "Fruit", id: 8 },
  ];

  useEffect(() => {
    if (selectedSuggestionIndex > -1) return;
    if (inputValue) {
      const filteredSuggestions1 = allSuggestions
        .map((suggestion) => {
          return {
            name: suggestion.name,
            match: suggestion.name.replace(
              new RegExp(inputValue, "gi"),
              (match) => `<span class="text-blue-500">${match}</span>`
            ),
            category: suggestion.category,
            id: suggestion.id,
          };
        })
        .filter((suggestion) =>
          suggestion.name.toLowerCase().includes(inputValue.toLowerCase())
        );

      setSuggestions(filteredSuggestions1);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setSelectedSuggestionIndex(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Tab" ||
      (event.key === "ArrowDown" && suggestions.length > 0)
    ) {
      event.preventDefault();
      const newIndex =
        selectedSuggestionIndex === suggestions.length - 1
          ? 0
          : selectedSuggestionIndex + 1;
      setSelectedSuggestionIndex(newIndex);
      setInputValue(suggestions[newIndex].name);
    } else if (event.key === "ArrowUp" && selectedSuggestionIndex > 0) {
      setSelectedSuggestionIndex(selectedSuggestionIndex - 1);
      setInputValue(suggestions[selectedSuggestionIndex - 1].name);
    } else if (event.key === "Enter") {
      setShowSuggestions(false);
      // Navigate to search page or perform search
      navigate(`/posts/${suggestions[selectedSuggestionIndex].id}`);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (!event.target.closest("#searchInput")) {
      setShowSuggestions(false);
    }
  };

  return (
    <div className='relative max-w-xl mx-auto hidden sm:block'>
      <input
        id='searchInput'
        type='text'
        placeholder='Search...'
        className={`${inputClasses} pl-9`}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoComplete='off'
        ref={inputRef}
      />
      <FaSearch className='absolute top-3 left-3 text-zinc-400' />
      {showSuggestions && suggestions.length > 0 && (
        <div className={containerClasses}>
          {suggestions.map((suggestion, index) => (
            <SuggestionItem
              key={index}
              suggestion={suggestion.match}
              isSelected={index === selectedSuggestionIndex}
              onClick={() => handleSuggestionClick(suggestion.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function SuggestionItem({ suggestion, onClick, isSelected }) {
  return (
    <div
      className={`${suggestionClasses} ${isSelected ? "bg-zinc-100" : ""}`}
      onClick={onClick}
    >
      <span dangerouslySetInnerHTML={{ __html: suggestion }} />
    </div>
  );
}

export default SearchBar;
