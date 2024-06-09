import path from 'path';
import { NextResponse } from 'next/server';

const fruitTranslation = {
  '키위': 'Kiwi',
  '망고': 'Mango',
  '고구마': 'Sweet Potato',
  '오렌지': 'Orange',
  '아보카도': 'Avocado',
  '자몽': 'Grapefruit',
  '레몬': 'Lemon',
  '라임': 'Lime',
  '체리': 'Cherry'
};

function combineFruitsWithIndex(rows) {
  const combined = {};
  rows.forEach(row => {
    const fruit = row.fruit;
    if (!combined[fruit]) {
      combined[fruit] = { hard: 0, indices: [] };
    }
    combined[fruit].hard += row.hard;
    combined[fruit].indices.push(row.index);
  });
  return Object.keys(combined).map(fruit => ({
    fruit: fruit,
    hard: combined[fruit].hard,
    indices: combined[fruit].indices
  }));
}

function splitHighestHard(combinedRows, originalRows) {
  combinedRows.sort((a, b) => b.hard - a.hard);

  const highestHard = combinedRows[0].hard;
  const secondHighestHard = combinedRows.length > 1 ? combinedRows[1].hard : 0;
  const highestFruit = combinedRows[0].fruit;

  const newRows = [];
  let remainingHard = 0;
  let splitIndices = [];

  if (highestHard > secondHighestHard) {
    originalRows.forEach(row => {
      if (row.fruit === highestFruit) {
        remainingHard += row.hard;
        splitIndices.push(row.index);
        if (remainingHard >= secondHighestHard) {
          let splitHard = remainingHard - row.hard;
          if (splitHard > 0) {
            newRows.push({ fruit: highestFruit, hard: splitHard, indices: splitIndices.slice(0, -1) });
          }
          splitHard = row.hard;
          newRows.push({ fruit: highestFruit, hard: splitHard, indices: [splitIndices[splitIndices.length - 1]] });
          remainingHard = 0;
          splitIndices = [];
        }
      }
    });

    if (remainingHard > 0) {
      newRows.push({ fruit: highestFruit, hard: remainingHard, indices: splitIndices });
    }
  }

  const remainingCombinedRows = combinedRows.slice(1);
  return remainingCombinedRows.concat(newRows);
}

function heuristicAllocation(rows, groupInfo) {
  console.log("Starting heuristic allocation");

  let combinedRows = combineFruitsWithIndex(rows);
  combinedRows = splitHighestHard(combinedRows, rows);

  const groupNames = groupInfo.map(group => group.name);
  const groupSizes = {};
  const groupHard = {};
  const groupFruitCounts = {};

  groupInfo.forEach(group => {
    groupSizes[group.name] = group.count;
    groupHard[group.name] = 0;
    groupFruitCounts[group.name] = {};
  });

  combinedRows.sort((a, b) => b.hard - a.hard);

  const allocation = {};

  combinedRows.forEach(task => {
    const minEtaGroup = groupNames.reduce((minGroup, group) => {
      const eta = groupHard[group] / groupSizes[group];
      const fruitCount = groupFruitCounts[group][task.fruit] || 0;
      if (!minGroup || eta < groupHard[minGroup] / groupSizes[minGroup] ||
          (eta === groupHard[minGroup] / groupSizes[minGroup] && fruitCount < groupFruitCounts[minGroup][task.fruit])) {
        return group;
      }
      return minGroup;
    }, null);

    if (!allocation[minEtaGroup]) allocation[minEtaGroup] = [];
    allocation[minEtaGroup].push(...task.indices);

    groupHard[minEtaGroup] += task.hard;
    if (!groupFruitCounts[minEtaGroup][task.fruit]) {
      groupFruitCounts[minEtaGroup][task.fruit] = 0;
    }
    groupFruitCounts[minEtaGroup][task.fruit] += 1;
  });

  console.log("Initial allocation from heuristic:");
  groupNames.forEach(group => {
    const eta = groupHard[group] / groupSizes[group];
    const fruits = combinedRows.filter(task => allocation[group].includes(task.indices)).map(task => task.fruit);
    const indices = allocation[group];
    console.log(`Group ${group} eta: ${eta}, fruits: ${fruits}, indices: ${indices}`);
  });

  rows.forEach(task => {
    groupNames.forEach(group => {
      if (allocation[group] && allocation[group].includes(task.index)) {
        task.group = group;
      }
    });
  });

  console.log("Allocation:");
  rows.forEach(task => {
    console.log({ index: task.index, group: task.group || 'Not assigned' });
  });

  return rows;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { rows, workGroup } = body;

    if (!rows || !workGroup) {
      throw new Error('Invalid input data');
    }

    rows['전체'] = rows['전체'].map((item, index) => ({
      ...item,
      index: index + 1
    }));

    const rows_extracted = rows['전체']
      .filter(item => item['작업 난도'] !== 0)
      .map(item => ({
        fruit: fruitTranslation[item['품목분류']] || item['품목분류'],
        hard: item['작업 난도'],
        index: item.index
      }));

    const result_rows = heuristicAllocation(rows_extracted, workGroup);

    // `groupedData` 생성
    const groupedData = result_rows.reduce((acc, item) => {
      // 원본 rows에서 해당 index의 항목 찾기
      const originalItem = rows['전체'].find(row => row.index === item.index);

      if (originalItem) {
        // 그룹화된 데이터에 workGroup 추가
        originalItem.workGroup = item.group;

        // 전체 그룹에 추가
        if (!acc['전체']) acc['전체'] = [];
        acc['전체'].push(originalItem);

        // 각 작업 그룹에 항목 추가
        if (!acc[item.group]) acc[item.group] = [];
        acc[item.group].push(originalItem);
      }
      return acc;
    }, {});

    console.log('groupedData:', groupedData['전체']);

    return new NextResponse(JSON.stringify({ message: 'Success', updatedRows: groupedData }), { status: 200 });
  } catch (error) {
    console.error(`Request error: ${error}`);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}

export function GET() {
  return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}
