import { getProducts } from "@/lib/actions/product.actions";
import { Product, columns } from "./columns";
import { DataTable } from "./data-table";

const ProductsPage = async () => {
  const data = await getProducts({});
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Products</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ProductsPage;
