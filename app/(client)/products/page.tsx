import ProductList from "@/components/ProductList";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string; sort: string; search: string }>;
}) => {
  const category = (await searchParams).category;
  const sort = (await searchParams).sort;
  const search = (await searchParams).search;
  return (
    <div className="">
      <ProductList
        category={category}
        sort={sort}
        search={search}
        params="products"
      />
    </div>
  );
};

export default page;
