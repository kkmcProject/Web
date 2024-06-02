import TableComponent from "./TableComponent";

export default function Table() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 tablet:mt-36 zero-to-tablet:mt-20 overflow-x-auto">
      <div className="flex w-full max-w-7xl mt-20">
        <div className="flex-1 mr-4 -auto">
          <TableComponent />
        </div>
      </div>
    </div>
  );
}
