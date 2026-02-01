import { getAllUsers } from "@/lib/actions/user.actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const UsersPage = async () => {
  const data = await getAllUsers();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Users</h1>
      </div>
      <DataTable columns={columns} data={data.data} />
    </div>
  );
};

export default UsersPage;
