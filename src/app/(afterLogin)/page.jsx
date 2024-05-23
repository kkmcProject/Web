"use client";

import React, { useState } from 'react';

const Table = () => {
  const headers = [
    '업체', '품목', '과수', '원산지', '포장형태', '상품명1', '입수', '단량',
    '재고/정비 생산수량', '수량', '중량', '바코드', '상품명2'
  ];

  const defaultData = {
    '전체': [
      ['노브랜드', '라임', '200과', '멕시코', '팩', '200 팩 3', '4', '0', '재고 111', '8', '8', '111111111111', '라임(3입/팩)'],
      ['노브랜드', '오렌지', '100과', '미국', '팩', '100 팩 2', '2', '0', '재고 50', '4', '4', '222222222222', '오렌지(2입/팩)'],
    ],
    '세척반': [],
    '1반': [],
    '2반': [],
    '3반': [],
    '4반': [],
    '5반': [],
  };

  const [activeTab, setActiveTab] = useState('전체');

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="overflow-x-auto w-full max-w-6xl mt-32">
        <div className="flex items-start ">
          <div className="flex bg-gray-200 p-2 border-b border-gray-300">
            {Object.keys(defaultData).map((tab) => (
              <button
                key={tab}
                className={`text-center py-2 px-4 border border-gray-300 ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-white'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} className="py-2 px-4 border border-gray-300 bg-gray-200 text-gray-600">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {defaultData[activeTab].length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="py-2 px-4 border border-gray-300 text-center">
                  데이터 없음
                </td>
              </tr>
            ) : (
              defaultData[activeTab].map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-100">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-2 px-4 border border-gray-300">{cell}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
