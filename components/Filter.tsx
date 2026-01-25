"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
const Filter = ({
  filterType,
  defaultValue,
}: {
  filterType: string;
  defaultValue: string;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentSort = searchParams.get(filterType) || defaultValue;
  const handleFilter = (Value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(filterType, Value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return (
    <>
      {filterType === "sort" && (
        <div className="flex items-center justify-end gap-2 text-sm text-gray-500 my-6">
          <span>Sort by:</span>
          <Select defaultValue={currentSort} onValueChange={handleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="asc">Price: Low to High</SelectItem>
              <SelectItem value="desc">Price: Hight to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {filterType === "duration" && (
        <div className="gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
          <Select defaultValue={currentSort} onValueChange={handleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="half-year">Last 6 Months</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};

export default Filter;
