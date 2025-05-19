"use client";

import { cn } from "@/utils/cn";
import { useState } from "react";

export interface BlurSearchBarProps {
  className?: string;
}

export default function BlurSearchBar({ className }: BlurSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const searchInput = (
    <div className={cn("relative group", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
        <svg
          className="h-4 w-4 text-white/50 group-focus-within:text-white transition-colors duration-200"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        id="search"
        name="search"
        className={`block w-full rounded-md border-0 bg-white/10 backdrop-blur-md py-1.5 pl-10 pr-3 text-white placeholder:text-white/50 appearance-none outline-none [&::-webkit-search-cancel-button]:hidden sm:text-sm sm:leading-6`}
        placeholder="Search documentation..."
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );

  return (
    <div className="hidden lg:flex lg:flex-1 lg:justify-center">
      <div className="w-full max-w-md">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        {searchInput}
      </div>
    </div>
  );
}
