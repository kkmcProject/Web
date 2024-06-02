"use client";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import Swiper from "swiper";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import { useShallow } from "zustand/react/shallow";
import { useTableData } from "@/store/TableData";

export default function TableButton() {
  const { rows, setRows, checkedRows, setCheckedRows } = useTableData(
    useShallow(state => ({
      rows: state.rows,
      setRows: state.setRows,
      checkedRows: state.checkedRows,
      setCheckedRows: state.setCheckedRows,
    })),
  );
  const [filename, setFilename] = useState("");

  console.log("checkedROws", checkedRows.includes(0));

  useEffect(() => {
    const swiper = new Swiper(".swiper", {
      direction: "horizontal",
      loop: false,
      centeredSlides: false,
      touchRatio: 1,
      freeMode: true,
      grabCursor: true,
      slidesPerView: "auto",
      spaceBetween: 0,
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
    });
  }, [checkedRows]);

  const handleLoad = async e => {
    let file = e.target.files[0];
    if (file) {
      setFilename(file.name);
    }

    let readFile = file =>
      new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);

        reader.readAsText(file);
      });

    let csvText = await readFile(file);

    Papa.parse(csvText, {
      header: true,
      complete: async function (results) {
        setRows(results.data);

        // if (!rows) return;

        // const body = {
        //   filename,
        //   rows,
        // };

        // const res = await fetch("/api/TableInsert", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(body),
        // });
      },
    });
    //const result = JSON.stringify(rows, null, 2);
  };

  const handleMoveUp = () => {
    console.log("upupupupp");
    setRows(prevRows => {
      console.log("prevRows", prevRows);
      const newRows = [...prevRows];
      console.log("checkdRows", checkedRows);
      checkedRows.forEach(index => {
        if (index > 0) {
          const temp = newRows[index];
          newRows[index] = newRows[index - 1];
          newRows[index - 1] = temp;
        }
      });
      return newRows;
    });

    const newCheckedRows = checkedRows.map(index => index - 1);
    setCheckedRows(newCheckedRows);

    // 포커스 이동
    setTimeout(() => {
      newCheckedRows.forEach(index => {
        rowRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }, 100);
  };
  const handleMoveDown = () => {};

  return (
    <div className="Button flex swiper overflow-hidden h-full items-center">
      <div className="w-full flex text-nowrap swiper-wrapper h-full items-center ">
        <div className="upward hover:cursor-pointer hover:bg-blue-100 p-1 swiper-slide" onClick={handleMoveUp}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
            <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" />
          </svg>
        </div>
        <div className="downward hover:cursor-pointer hover:bg-blue-100 p-1 swiper-slide" onClick={handleMoveDown}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
            <path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z" />
          </svg>
        </div>
        {/* <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={onChange} />
        <button type="submit">Upload</button>
      </form>
      <Link href="/manage-plan/modal">모달 띄우기</Link> */}

        <div className="ml-4 mr-4 text-gray-300">|</div>

        <div className="load hover:bg-blue-100 p-1 hover:cursor-pointer swiper-slide">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
            <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
          </svg>
        </div>
        <div className="upload  hover:bg-blue-100 p-1 swiper-slide ">
          <label htmlFor="load-file" className="hover:cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
              <path d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
            </svg>
          </label>
        </div>
        <div className="add hover:cursor-pointer hover:bg-blue-100 p-1 swiper-slide">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
            <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
          </svg>
        </div>

        <div className="create ml-5 hover:cursor-pointer hover:bg-blue-100 p-1 swiper-slide text-sm">작업 이동</div>
        <div className="create ml-5 hover:cursor-pointer hover:bg-blue-100 p-1 swiper-slide text-sm">작업 할당</div>
        <div className="delete ml-5 hover:cursor-pointer hover:bg-blue-100 p-1 swiper-slide">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
          </svg>
        </div>
      </div>
      <input type="file" id="load-file" accept=".csv" onChange={handleLoad} className="hidden" />
    </div>
  );
}
