import { sql } from "@vercel/postgres";

export async function POST(req) {
  const body = await req.json();

  const { filename, rows } = body;


  // const dateMatch = filename.match(/\((\d{4}-\d{2}-\d{2})\)/);
  // if (dateMatch) {
  //   date = dateMatch[1];
  // }


  const columnMapping = {
    품목번호: "item_number",
    업체: "vendor",
    품목: "item",
    과수: "fruit_type",
    원산지: "origin",
    포장형태: "packaging_type",
    상품명: "product_name",
    입수: "quantity_perpack",
    단량: "unit_weight",
    특이사항: "particulars",
    수량: "quantity",
    중량: "weight",
    바코드: "barcode",
    상품명_2: "product_name2",
    작업인원: "workers",
    "작업시간(분)": "work_time",
    workGroup: "workGroup",
    품목분류: "item_category",
    "작업 난도": "work_difficulty",
    index: "index",
  };

  try {
    Object.keys(rows).forEach(async key =>{
      if(key === '전체') return;
      for (const row of rows[key]) {
        const mappedRow = {};
        for (const key in row) {
          if (columnMapping[key]) {
            mappedRow[columnMapping[key]] = row[key];
          }
        }
        const {
          item_number,
          vendor,
          item,
          fruit_type,
          origin,
          packaging_type,
          product_name,
          quantity_perpack,
          unit_weight,
          particulars,
          quantity,
          weight,
          barcode,
          product_name2,
          workers,
          work_time,
          workGroup,
          item_category,
          work_difficulty,
          index,
        } = mappedRow;
  
        await sql`
          INSERT INTO workplandoc (
            item_number, vendor, item, fruit_type, origin,
            packaging_type, product_name, quantity_perpack, unit_weight, particulars,
            quantity, weight, barcode, product_name2, workers, work_time, workgroup,
            item_category, work_difficulty, index, plan_title
          ) VALUES (
            ${item_number}, ${vendor}, ${item}, ${fruit_type}, ${origin},
            ${packaging_type}, ${product_name}, ${quantity_perpack}, ${unit_weight}, ${particulars},
            ${quantity}, ${weight}, ${barcode}, ${product_name2}, ${workers}, ${work_time}, ${workGroup},
            ${item_category}, ${work_difficulty}, ${index}, ${filename}
          )
        `;
      }
  

    })

    return new Response(JSON.stringify({ message: "CSV data successfully uploaded and stored in the database" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error during SQL execution:", err);
    return new Response(JSON.stringify({ message: "Failed to upload CSV data", error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export function GET() {
  return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}

/*
CREATE문

CREATE TABLE workplandoc (
  item_number VARCHAR(255), 
  vendor VARCHAR(255), 
  item VARCHAR(255), 
  fruit_type VARCHAR(255), 
  origin VARCHAR(255), 
  packaging_type VARCHAR(255), 
  product_name VARCHAR(255), 
  quantity_perpack VARCHAR(255), 
  unit_weight VARCHAR(255), 
  particulars VARCHAR(255), 
  quantity VARCHAR(255), 
  weight VARCHAR(255), 
  barcode VARCHAR(255), 
  product_name2 VARCHAR(255), 
  workers VARCHAR(255), 
  work_time VARCHAR(255), 
  workgroup VARCHAR(255), 
  item_category VARCHAR(255), 
  work_difficulty VARCHAR(255), 
  index VARCHAR(255), 
  plan_title VARCHAR(255)
);

*/
