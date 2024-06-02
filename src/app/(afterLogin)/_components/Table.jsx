import TableComponent from "./TableComponent";

export default function Table() {
  return (
    <div className="flex flex-col items-center min-h-screen tablet:mt-40 zero-to-tablet:mt-20 p-4">
      <div className="flex w-full mt-20">
        <div className="flex-1">
          <TableComponent />
        </div>
      </div>
    </div>
  );
}
