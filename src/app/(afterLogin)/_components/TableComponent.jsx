"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useShallow } from "zustand/react/shallow";
import { useTableData } from "@/store/TableData";
import { useWorkGroup } from "@/store/WorkGroup";

export default function TableComponent() {
  const [headers, setHeaders] = useState([]);
  const [ActiveTabRows, setActiveTabRows] = useState([]);
  const { rows, checkedRows, setRows, setCheckedRows } = useTableData(
    useShallow(state => ({
      rows: state.rows,
      checkedRows: state.checkedRows,
      setRows: state.setRows,
      setCheckedRows: state.setCheckedRows,
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
    newRows[originIndex][key] = value;
    setRows({ ...rows, [workGroup]: newRows });
  };

  useEffect(() => {
    // 현재 workGroup에 따라 ActiveTabRows 설정
    console.log('현재 rows는', rows);
    const RowKeys = rows[workGroup].length > 0 && rows[workGroup][0] ? Object.keys(rows[workGroup][0]) : [];
    const newHeaders = rows[workGroup].length > 0 ? ["체크", ...RowKeys] : [];
    if (!checkPathname) newHeaders.shift();

    setHeaders(newHeaders);
    setActiveTabRows(rows[workGroup] || rows["전체"] || []);
    // checkPathname 안의 경로가 아니라면 첫번째("체크")항목 제거
    
  }, [workGroup, rows]);

  return (
    <div className="w-full">
      <div className="w-full flex items-center"></div>
      <table className="min-w-full max-w-full w-full overflow-y-scroll table-auto">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="py-2 px-4 border border-gray-300 bg-gray-200 text-gray-600 whitespace-nowrap">
                {header}
              </th>
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
                      checked={checkedRows.includes(rows[workGroup].indexOf(row))}
                      onChange={() => handleCheck(rows[workGroup].indexOf(row))}
                    />
                  </td>
                )}

                {Object.keys(row).map(key => (
                  <td key={key} className="py-2 px-4 border border-gray-300 w-full">
                    <input
                      type="text"
                      value={row[key]}
                      onChange={(e) => handleInputChange(rows[workGroup].indexOf(row), key, e.target.value)}
                      className="bg-transparent border-none focus:outline-none w-fit"/>
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
