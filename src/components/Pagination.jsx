// components/Pagination.jsx
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center mt-4 space-x-2">
      <button
        className="px-3 py-1 border rounded"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {[...Array(totalPages).keys()].map((n) => (
        <button
          key={n}
          className={`px-3 py-1 border rounded ${
            currentPage === n + 1 ? "bg-black text-white" : ""
          }`}
          onClick={() => onPageChange(n + 1)}
        >
          {n + 1}
        </button>
      ))}
      <button
        className="px-3 py-1 border rounded"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
