import { tw } from "../../utils/twStyles.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CollectionPagination({ pagination, onPage }) {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className={tw("vanta-collection-pagination")}>
      <button type="button" disabled={!pagination.hasPreviousPage} onClick={() => onPage((page) => Math.max(page - 1, 1))}>
        <ChevronLeft size={16} />
      </button>
      <span>{pagination.currentPage}</span>
      <button type="button" disabled={!pagination.hasNextPage} onClick={() => onPage((page) => page + 1)}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
