import { ChevronLeft, ChevronRight } from "lucide-react";
import { tw } from "../../utils/twStyles.js";

const Pagination = ({ pagination, setPage }) => {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className={tw("vanta-collection-pagination")}>
      <button
        type="button"
        disabled={!pagination.hasPreviousPage}
        onClick={() => setPage((current) => Math.max(current - 1, 1))}
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, index) => {
        const pageNumber = index + 1;

        return (
          <button
            key={pageNumber}
            type="button"
            className={tw(pageNumber === pagination.currentPage ? "active" : "")}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        type="button"
        disabled={!pagination.hasNextPage}
        onClick={() => setPage((current) => current + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
