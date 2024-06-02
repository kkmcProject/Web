"use client";

import { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import Swiper from "swiper";

export default function ActiveTab() {
  const [activeTab, setActiveTab] = useState("전체");
  const defaultData = {
    전체: [
      [
        "노브랜드",
        "라임",
        "200과",
        "멕시코",
        "팩",
        "200 팩 3",
        "4",
        "0",
        "재고 111",
        "8",
        "8",
        "111111111111",
        "라임(3입/팩)",
      ],
      [
        "노브랜드",
        "오렌지",
        "100과",
        "미국",
        "팩",
        "100 팩 2",
        "2",
        "0",
        "재고 50",
        "4",
        "4",
        "222222222222",
        "라임(3입/팩)",
      ],
    ],
    세척반: [],
    "1반": [],
    "2반": [],
    "3반": [],
    "4반": [],
    "5반": [],
  };

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
            className={`swiper-slide text-center py-2 px-4 border border-gray-300 whitespace-nowrap ${activeTab === tab ? "bg-blue-500 text-white" : "bg-white"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
