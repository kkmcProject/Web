"use client";

import { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import Swiper from "swiper";
import { useShallow } from "zustand/react/shallow";
import { useWorkGroup } from "@/store/WorkGroup";
import { useTableData } from "@/store/TableData";

export default function ActiveTab() {
  const { workGroup, setWorkGroup } = useWorkGroup(
    useShallow(state => ({
      workGroup : state.workGroup,
      setWorkGroup: state.setWorkGroup,
    })),
  );
  const { setCheckedRows } = useTableData(
    useShallow(state => ({
      setCheckedRows: state.setCheckedRows,
    }))
  )
  const defaultData = {
    전체: [
      [],
    ],
    "Group1": [],
    "Group2": [],
    "Group3": [],
    "Group4": [],
  };
  const handleTabClick = tab => () => {
    setWorkGroup(tab);
    if(tab !== workGroup){
      setCheckedRows([]);
    }
  }

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
  }, []);

  return (
    <div className="flex p-2 swiper overflow-hidden tablet:min-w-120 flex-1">
      <div className="swiper-wrapper">
        {Object.keys(defaultData).map(tab => (
          <button
            key={tab}
            className={`swiper-slide text-center py-2 px-4 border border-gray-300 whitespace-nowrap ${workGroup === tab ? "bg-blue-500 text-white" : "bg-white"}`}
            onClick={handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
