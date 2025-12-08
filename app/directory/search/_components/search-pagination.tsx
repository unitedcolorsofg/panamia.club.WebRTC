'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  onPageChange: (page: number) => void;
}

export function SearchPagination({
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
}: SearchPaginationProps) {
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        {currentPage > 0 && (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        )}
        {totalResults > 0 && (
          <span className="ml-3 text-xs">({totalResults} results)</span>
        )}
      </div>

      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
