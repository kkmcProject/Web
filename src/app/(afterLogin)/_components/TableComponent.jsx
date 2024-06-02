"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useShallow } from "zustand/react/shallow";
import { useTableData } from "@/store/TableData";
import { useWorkGroup } from "@/store/WorkGroup";

export default function TableComponent() {
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
  )

  const pathname = usePathname();
  const checkPathname = pathname === "/manage-plan" || pathname === "/manage-plan/modal";

  const RowKeys = rows.length > 0 && rows[0] ? Object.keys(rows[0]) : [];
  const headers = rows.length > 0 ? ["체크", ...RowKeys] : [];

  const handleCheck = index => {
    let newCheckedRows = [...checkedRows];

    if (checkedRows.includes(index)) {
      newCheckedRows = newCheckedRows.filter(i => i !== index);
    }
    else {
      newCheckedRows = [...newCheckedRows, index];
    }

    setCheckedRows(newCheckedRows);

  };

  // checkPathname 안의 경로가 아니라면 첫번째("체크")항목 제거
  if (!checkPathname) headers.shift();


  useEffect(() => {
    const TempRows = workGroup === "전체" ? rows : rows.filter(row => row.workGroup === workGroup);
    setActiveTabRows(TempRows);
    console.log('ActiveTabRows는 ', ActiveTabRows)
  }, [workGroup, rows])
  
  return (
    <div className="w-full">
      <div className="w-full flex items-center"></div>
      <table className="min-w-full max-w-full w-fulloverflow-y-scroll whitespace-nowrap">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="py-2 px-4 border border-gray-300 bg-gray-200 text-gray-600">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
        {
          !ActiveTabRows|| ActiveTabRows.length === 0 && (
            <tr>
            <td colSpan={headers.length} className="py-2 px-4 text-center">
              데이터 없음
            </td>
          </tr>
          ) 
        }
        { ActiveTabRows && ActiveTabRows.length > 0 &&
            ActiveTabRows.map((row, rowIndex) => (
              <tr key={rowIndex} id={'index' + rowIndex} className="hover:bg-gray-100">
                {checkPathname && (
                  <td className="py-2 px-4 border border-gray-300 text-center">
                    <input
                      type="checkbox"
                      checked={checkedRows.includes(rowIndex)}
                      onChange={() => handleCheck(rowIndex)}
                    />
                  </td>
                )}

                {Object.keys(row).map(key => (
                  <td key={key} className="py-2 px-4 border border-gray-300">
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))
        }     
        </tbody>
      </table>
    </div>
  );
}
