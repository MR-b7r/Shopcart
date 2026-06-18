"use client";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Input } from "./ui/input";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("search", value);
    router.push(`/products?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="flex-1 max-w-md block relative">
      <Input
        type="text"
        placeholder="Search products, brands, and more..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(searchTerm);
          }
        }}
        id="search"
        className="rounded-full border-border "
      ></Input>
      <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer" />
    </div>
  );
};

export default SearchBar;
