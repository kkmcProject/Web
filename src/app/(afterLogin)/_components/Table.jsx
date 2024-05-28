import TableComponent from "./TableComponent";

export default function Table() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="flex w-full max-w-7xl mt-20">
        <div className="flex-1 mr-4">
          <TableComponent />
        </div>
      </div>
    </div>
  );
}
