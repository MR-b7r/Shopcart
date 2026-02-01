import { getOrders } from "@/lib/actions/order.actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const OrdersPage = async () => {
  const data = await getOrders();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Orders</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default OrdersPage;
