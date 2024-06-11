import { useEffect } from "react";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages < 9) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3 || currentPage >= totalPages - 3) {
        pageNumbers.push(
          1,
          2,
          3,
          "...",
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pageNumbers;
  };

  return (
    <div className='flex justify-between my-4 max-w-screen'>
      <button
        className='btn btn-primary'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        type='button'
      >
        Prev
      </button>
      <div className='flex flex-row gap-4'>
        {getPageNumbers().map((number, index) => (
          <button
            key={index}
            className={`btn ${number === currentPage ? "btn-active" : ""}`}
            onClick={() => typeof number === "number" && onPageChange(number)}
            disabled={typeof number !== "number"}
            type='button'
          >
            {number}
          </button>
        ))}
      </div>
      <button
        className='btn btn-primary'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        type='button'
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
