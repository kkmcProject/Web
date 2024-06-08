"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useShallow } from "zustand/react/shallow";
import { useTableData } from "@/store/TableData";
import { useWorkGroup } from "@/store/WorkGroup";

export default function TableComponent() {
  const [ActiveTabRows, setActiveTabRows] = useState([]);
  const { rows, checkedRows, setRows, setCheckedRows, headers, setHeaders, filteredColumns, currentFilename
   } = useTableData(
    useShallow(state => ({
      rows: state.rows,
      checkedRows: state.checkedRows,
      setRows: state.setRows,
      setCheckedRows: state.setCheckedRows,
      headers: state.headers,
      setHeaders: state.setHeaders,
      filteredColumns: state.filteredColumns,
      currentFilename: state.currentFilename,
    })),
  );

  const { workGroup } = useWorkGroup(
    useShallow(state => ({
      workGroup: state.workGroup,
    }))
  );

  const pathname = usePathname();
  const checkPathname = pathname === "/manage-plan" || pathname === "/manage-plan/modal";

  const handleCheck = index => {
    let newCheckedRows = [...checkedRows];

    if (checkedRows.includes(index)) {
      newCheckedRows = newCheckedRows.filter(i => i !== index);
    } else {
      newCheckedRows = [...newCheckedRows, index];
    }

    setCheckedRows(newCheckedRows);
  };

  const handleInputChange = (originIndex, key, value) => {
    let newRows = [...rows[workGroup]];

    if (newRows[originIndex]) {
      newRows[originIndex][key] = value;
      setRows({ ...rows, [workGroup]: newRows });
    }
  };

  useEffect(() => {
    // 현재 workGroup에 따라 ActiveTabRows 설정

    const workGroupRows = rows[workGroup] || [];
    const RowKeys = workGroupRows.length > 0 && workGroupRows[0] ? Object.keys(workGroupRows[0]) : [];
    const newHeaders = workGroupRows.length > 0 ? ["체크", ...RowKeys] : [];
    if (!checkPathname) newHeaders.shift();

     // filteredColumns에 포함된 컬럼을 필터링
   //  newHeaders = newHeaders.filter(header => !filteredColumns.includes(header));
    setHeaders(newHeaders);
    console.log('rows는', rows);
   // ActiveTabRows에서 필터링된 컬럼을 제외
   const filteredRows = workGroupRows.map(row => {
    const filteredRow = { ...row };
    filteredColumns.forEach(column => {
      delete filteredRow[column];
    });
    return filteredRow;
  });

    setActiveTabRows(filteredRows.length > 0 ? filteredRows : (rows["전체"] || []));
  }, [workGroup, rows, filteredColumns]);

  return (
    <div className="w-full">
      {pathname === "/" && currentFilename.length > 0 && <span>작업계획서 : {currentFilename}</span>}
      <table className="min-w-full max-w-full w-full overflow-y-scroll table-auto">
        <thead className="tablet:sticky tablet:top-56 bg-white zero-to-tablet:sticky under-tablet:top-[122px] md:top-24">
          <tr>
            {headers.map((header, index) => (
               filteredColumns.includes(header) ? null :
                (
               <th key={index} className="py-2 px-4 border border-gray-300 bg-gray-200 text-gray-600 whitespace-nowrap">
                {header}
              </th>
                )
            ))}
          </tr> 
        </thead>
        <tbody>
          {!ActiveTabRows || ActiveTabRows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="py-2 px-4 text-center">
                데이터 없음
              </td>
            </tr>
          ) : (
            ActiveTabRows.map((row, rowIndex) => (
              <tr key={rowIndex} id={'index' + rowIndex} className="hover:bg-gray-100">
                {checkPathname && (
                  <td className="py-2 px-4 border border-gray-300 text-center">
                    <input
                      type="checkbox"
                      checked={checkedRows.includes(rowIndex)}
                      onChange={() =>  handleCheck(rowIndex)}
                    />
                  </td>
                )}

                {Object.keys(row).map(key => (
                  <td key={key} className="py-2 px-4 border border-gray-300 w-full">
                    {pathname === "/" ? (
                      <span className="whitespace-nowrap">{rows?.[workGroup]?.[rowIndex]?.[key] ?? ''}</span>
                    ) : (
                      <input
                      type="text"
                      value={rows?.[workGroup]?.[rowIndex]?.[key] ?? ''}
                      onChange={(e) => handleInputChange(rowIndex, key, e.target.value)}
                      className="bg-transparent border-none focus:outline-none whitespace-nowrap"/>
                    )}

                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
