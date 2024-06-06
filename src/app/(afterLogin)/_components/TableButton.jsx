"use client";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import Swiper from "swiper";
import { useState, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTableData } from "@/store/TableData";
import { useWorkGroup } from "@/store/WorkGroup";
import { usePathname } from "next/navigation";
import clsx from 'clsx';
import * as XLSX from 'xlsx';
import Modal from 'react-modal';

export default function TableButton() {
  const defaultSelected = "작업 이동";
  const pathname = usePathname();
  const [selected, setSelected] = useState(defaultSelected);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

  const { rows, setRows, checkedRows, setCheckedRows, headers, filteredColumns, setFilteredColumns } = useTableData(
    useShallow(state => ({
      rows: state.rows,
      setRows: state.setRows,
      checkedRows: state.checkedRows,
      setCheckedRows: state.setCheckedRows,      
      headers: state.headers,
      filteredColumns: state.filteredColumns,
      setFilteredColumns: state.setFilteredColumns,
    })),
  );
  const { workGroup, groups, setGroups, setWorkGroupCounts, workGroupCounts } = useWorkGroup(
    useShallow(state => ({
      workGroup: state.workGroup,
      groups: state.groups,
      setGroups: state.setGroups,
      setWorkGroupCounts: state.setWorkGroupCounts,
      workGroupCounts: state.workGroupCounts,
    }))
  );

  const [filename, setFilename] = useState("");

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
      observer: true,
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
    });
  }, [checkedRows]);

  const handleLoad = async e => {
    
    let file = e.target.files[0];
    if (!file) {
      // 파일이 선택되지 않은 경우 처리 중단
      return;
    }

    // 그룹을 몇개 받을건지 입력
    const groupsArr = ["Group1", "Group2", "Group3", "Group4", "Group5"];
    const groupCount = prompt("작업반의 개수를 입력해주세요.");
    
    let groups = [];
    for(let i = 0; i< groupCount; i++){
      groups.push(groupsArr[i]);
    }

    // state 초기화
    setCheckedRows([]);
    setFilename(file.name);
    setFilteredColumns([]);

    let readFile = file =>
      new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsArrayBuffer(file);
      });

    let arrayBuffer = await readFile(file);
    let data = new Uint8Array(arrayBuffer);
    let workbook = XLSX.read(data, { type: 'array' });
    let worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // 첫 번째 행(사용자 정의 헤더)을 제외하고 데이터를 가져옵니다.
    jsonData = jsonData.slice(1);

    // 사용자 정의 헤더
    const header = ["품목번호", "업체", "품목", "과수", "원산지", "포장형태", "상품명", "입수", "단량", "특이사항", "수량", "중량", "바코드", "상품명_2", "작업인원", "작업시간(분)", ];

    // 첫 번째 열에 내용이 없는 행을 제거
    let filteredData = jsonData.filter(row => row[0] !== undefined && row[0] !== null);

    // 정의된 헤더 길이에 맞게 데이터를 조정합니다.
    filteredData = filteredData.map(row => row.slice(0, header.length));

    // 객체 배열로 변환합니다.
    let resultData = filteredData.map(row => {
      let obj = {};
      header.forEach((key, index) => {
        obj[key] = row[index];
      });
      return obj;
    });


    resultData = resultData.map(row => ({
      ...row,
      workGroup: groups[Math.floor(Math.random() * groups.length)],
    }));



    // 품목분류 열 추가.

    const categories = ['키위', '망고', '고구마', '오렌지', '아보카도', '자몽', '레몬', '라임', '체리'];

    resultData = resultData.map(item => {
      let newColumn = '';

      for (const category of categories){
        if(item['품목'].includes(category)){
          newColumn = category;
          break;
        }
      }
      return { ...item, '품목분류': newColumn };
    })
    
    const uniqueGroups = [...new Set(resultData.map(row => row.workGroup))];
    uniqueGroups.sort();
    uniqueGroups.unshift("전체");

    setGroups(uniqueGroups);

    const grouped = resultData.reduce((acc, row) => {
      const group = row.workGroup || "전체";
      if (!acc[group]) {
        acc[group] = [];
      }
      acc["전체"] = acc["전체"] || [];
      acc["전체"].push(row);
      acc[group].push({...row, index: acc[group].length});
      return acc;
    }, {});


    setRows(grouped);
  };

  const handleMoveUp = () => {
    if (!rows[workGroup] || rows[workGroup].length === 0) return;
  
    const newRows = [...rows[workGroup]];
    const newCheckedRows = checkedRows.slice().sort((a, b) => a - b);
  
    // Traverse each checked row and move it up
    for (let i = 0; i < newCheckedRows.length; i++) {
      const index = newCheckedRows[i];
      if (index > 0 && !newCheckedRows.includes(index - 1)) {
        // Swap elements
        const temp = newRows[index];
        newRows[index] = { ...newRows[index - 1], index: newRows[index].index };
        newRows[index - 1] = { ...temp, index: newRows[index - 1].index };
  
        // Update the checkedRows with new positions
        newCheckedRows[i] = index - 1;
      }
    }
  
    setRows({ ...rows, [workGroup]: newRows });
    setCheckedRows(newCheckedRows);
  
    const firstCheckedIndex = newCheckedRows[0];
    if (firstCheckedIndex !== undefined) {
      const element = document.getElementById("index" + firstCheckedIndex);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };
  
  const handleMoveDown = () => {
    if (!rows[workGroup] || rows[workGroup].length === 0) return;
  
    const newRows = [...rows[workGroup]];
    const newCheckedRows = checkedRows.slice().sort((a, b) => b - a);
  
    // Traverse each checked row in reverse and move it down
    for (let i = 0; i < newCheckedRows.length; i++) {
      const index = newCheckedRows[i];
      if (index < newRows.length - 1 && !newCheckedRows.includes(index + 1)) {
        // Swap elements
        const temp = newRows[index];
        newRows[index] = { ...newRows[index + 1], index: newRows[index].index };
        newRows[index + 1] = { ...temp, index: newRows[index + 1].index };
  
        // Update the checkedRows with new positions
        newCheckedRows[i] = index + 1;
      }
    }
  
    setRows({ ...rows, [workGroup]: newRows });
    setCheckedRows(newCheckedRows);
  
    const lastCheckedIndex = newCheckedRows[newCheckedRows.length - 1];
    if (lastCheckedIndex !== undefined) {
      const element = document.getElementById("index" + lastCheckedIndex);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };


  const handleAddClick = () => {
    if (rows && rows[workGroup]) {
      const workGroupRows = rows[workGroup] || [];
      const RowKeys = workGroupRows.length > 0 && workGroupRows[0] ? Object.keys(workGroupRows[0]) : [];
  
      // 새로운 행 생성
      const newRow = RowKeys.reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {});
      newRow.index = workGroupRows.length;
  
      const newRows = [...workGroupRows, newRow];
  
      setRows({ ...rows, [workGroup]: newRows });
  
      // 포커싱
      setTimeout(() => {
        const lastIndex = newRows.length - 1;
        const element = document.getElementById("index" + lastIndex);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }, 0);
    }
  };
  
  const confirmDelete = () => {
    if (checkedRows.length === 0) return alert("삭제할 행을 선택해주세요.");
    if (confirm("정말 삭제하시겠습니까?")) {
      // 삭제할 행을 제외한 새 행 배열 생성
      const newRows = rows[workGroup].filter((_, index) => !checkedRows.includes(index));
      
      // 인덱스를 다시 할당
      const updatedRows = newRows.map((row, index) => ({
        ...row,
        index: index
      }));
  
      setRows({ ...rows, [workGroup]: updatedRows });
      setCheckedRows([]);
      alert("삭제 완료");
    }
  }
  
  const handleSelect = (e) => {
    setSelected(e.target.value);
  }
  const onClickMoveBtn = () => {
    // 선택되지 않은 행, 갱신해줘야할 행
    const newRows = rows[workGroup].filter((row, index) => !checkedRows.includes(index));
    
    // 선택한 작업반의 목록
    const newGroupRows = rows[selected] || [];
  
    // 체크된 행을 선택한 작업반에 추가하고 인덱스 갱신
    const updatedRows = checkedRows.map(index => {
      const updatedRow = { ...rows[workGroup][index] };
      updatedRow.index = newGroupRows.length; // 선택한 작업반의 길이에 따라 인덱스 갱신
      newGroupRows.push(updatedRow);
      return updatedRow;
    });
  
    setRows({ ...rows, [workGroup]: newRows, [selected]: newGroupRows });
    setCheckedRows([]);
  }
  

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const toggleLoadModal = () => {
    setIsLoadModalOpen(!isLoadModalOpen);
  };

  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    let newFilters = checked ? [...filteredColumns, value] : filteredColumns.filter(filter => filter !== value);
    setFilteredColumns(newFilters);
  };

  const onClickAlloc = async () => {
    // 각 workGroup별 인원수 입력
    const workGroupCounts = {};
    const uniqueWorkGroups = new Set(Object.keys(rows).filter(key => key !== "전체"));
  
    uniqueWorkGroups.forEach(group => {
      const count = prompt(`Enter number of people for ${group}:`, "0");
      workGroupCounts[group] = parseInt(count, 10);
    });
  
    setWorkGroupCounts(workGroupCounts);
  
    const uniqueProducts = new Set();
    const productWeights = {};
  
    // 고유한 품목 수집
    rows["전체"].forEach(row => {
      if (row["품목분류"]) {
        uniqueProducts.add(row["품목분류"]);
      }
    });
  
    // 고유한 품목에 대해 가중치 입력
    uniqueProducts.forEach(product => {
      const weight = prompt(`Enter weight for ${product}:`, "0");
      productWeights[product] = parseFloat(weight);
    });
  
    // 작업 난도 열 추가
    rows["전체"] = rows["전체"].map(row => {
      const 입수 = parseFloat(row["입수"]);
      const 수량 = parseFloat(row["수량"]);
      const weight = productWeights[row["품목분류"]];
      row["작업 난도"] = weight * 입수 * 수량;
      return row;
    });
  
    setRows(rows);
    // console.log(rows);
    // 작업반 정보 생성
    const workGroupInfo = Object.keys(workGroupCounts).map(group => ({
      name: group,
      count: workGroupCounts[group],
    }));
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/python`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rows: rows,
          workGroup: workGroupInfo,
        }),
      });
      const data = await response.json();
    } catch (err) {
      console.log(err);
    }
  };
  
  
  return (
    <div className="Button flex swiper overflow-hidden h-full items-center">
      <div className="w-full flex text-nowrap swiper-wrapper h-full items-center ">
        {pathname === "/manage-plan" &&
        (
          <>
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

        <div className="ml-4 mr-4 text-gray-300">|</div>
          </>
        )}
        <div className="load hover:bg-blue-100 p-1 hover:cursor-pointer swiper-slide" onClick={toggleLoadModal}>
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
        <div className="add hover:cursor-pointer hover:bg-blue-100 p-1 swiper-slide" onClick={handleAddClick}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
            <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
          </svg>
        </div>
        <div className="filter hover:cursor-pointer hover:bg-blue-100 p-1 swiper-slide " onClick={toggleFilterModal}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
           <path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z"/>
          </svg>
        </div>

        <div className="ml-2 mr-2 text-gray-300 swiper-slide">|</div>
        {workGroup !== '전체' && groups.length > 0 &&
          <div className="p-1 text-sm">
            <select onChange={handleSelect} value={selected}>
              <option value={defaultSelected}>{defaultSelected}</option>
              {
                groups.map((group) => {
                  if (group === workGroup) return;
                  return (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  )
                })
              }
            </select>
            <button className={clsx("ml-2 p-2",
              {
                "hover:cursor-pointer hover:bg-blue-100": selected !== defaultSelected,
                "text-gray-300": selected === defaultSelected
              })} onClick={onClickMoveBtn} disabled={selected === defaultSelected}>
              확인
            </button>
          </div>}

        {workGroup !== '전체' && rows?.length > 0 && <div className="ml-2 mr-2 text-gray-300">|</div>}

        <div className="create hover:cursor-pointer hover:bg-blue-100 p-1 swiper-slide text-sm" onClick={onClickAlloc}>작업 할당</div>
        <div className="create ml-2 hover:cursor-pointer hover:bg-blue-100 p-1 swiper-slide text-sm">작업 저장</div>
        <div className="delete ml-2 hover:cursor-pointer hover:bg-blue-100 p-1 swiper-slide" onClick={confirmDelete}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
          </svg>
        </div>
      </div>
      <input type="file" id="load-file" accept=".xlsx" onChange={handleLoad} className="hidden" />

      <Modal
  isOpen={isFilterModalOpen}
  onRequestClose={toggleFilterModal}
  contentLabel="Filter Modal"
  ariaHideApp={false}
  className="flex flex-col absolute inset-0 m-auto w-3/4 h-3/4 max-w-lg border-2 border-solid border-gray-300 bg-white overflow-auto outline-none"
>
  <div>
    <svg onClick={toggleFilterModal} className="hover:bg-blue-100 hover:cursor-pointer ml-6 mt-6" 
      xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#5f6368">
      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
    </svg>
  </div>
  <div className="flex flex-col justify-start items-center">
    <span className="flex text-lg font-bold">필터링 메뉴</span>
    <div className="flex flex-col mt-5">
    {headers.map((header, index) => (
      header !== '체크' &&
      <div key={index} className="w-full">
        <input
          type="checkbox"
          id={header}
          value={header}
          checked={filteredColumns.includes(header)}
          onChange={handleFilterChange}
          className="mr-2"
        />
        <label className="ml-2" htmlFor={header}>{header}</label>
      </div>
    ))}
    </div>
  </div>
      </Modal>

      <Modal
  isOpen={isLoadModalOpen}
  onRequestClose={toggleLoadModal}
  contentLabel="Filter Modal"
  ariaHideApp={false}
  className="flex flex-col absolute inset-0 m-auto w-3/4 h-3/4 max-w-lg border-2 border-solid border-gray-300 bg-white overflow-auto outline-none"
>
  <div>
    <svg onClick={toggleLoadModal} className="hover:bg-blue-100 hover:cursor-pointer ml-6 mt-6" 
      xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#5f6368">
      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
    </svg>
  </div>
  <div className="flex flex-col justify-start items-center">
    <span className="flex text-lg font-bold">작업계획서 불러오기</span>
    <div className="flex flex-col mt-5">
      불러올 데이터들..
    </div>
  </div>
      </Modal>
  </div>
  );
}
