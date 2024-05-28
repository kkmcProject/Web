import { sql } from "@vercel/postgres";

export async function POST(req) {
  const body = await req.json();

  const { filename, rows } = body;

  let date = null;

  const dateMatch = filename.match(/\((\d{4}-\d{2}-\d{2})\)/);
  if (dateMatch) {
    date = dateMatch[1];
  }

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
    "제고/예비 생산 수량": "reserve_quantity",
    수량: "quantity",
    중량: "weight",
    바코드: "barcode",
    상품명2: "product_name2",
    작업인원: "workers",
    작업시간: "work_time",
    품종: "breed",
    원산지_1: "origin2",
    바코드2: "barcode2",
    진열기간: "display_period",
    "입수*수량": "total_quantity",
    작업난도: "work_difficulty",
    eta: "eta",
  };

  try {
    for (const row of rows) {
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
        reserve_quantity,
        quantity,
        weight,
        barcode,
        product_name2,
        workers,
        work_time,
        breed,
        origin2,
        barcode2,
        display_period,
        total_quantity,
        work_difficulty,
        eta,
      } = mappedRow;

      await sql`
        INSERT INTO workplandoc (
          item_number, vendor, item, fruit_type, origin,
          packaging_type, product_name, quantity_perpack, unit_weight, reserve_quantity,
          quantity, weight, barcode, product_name2, workers, work_time, breed,
          origin2, barcode2, display_period, total_quantity, work_difficulty, eta, plan_title, plan_date
        ) VALUES (
          ${item_number}, ${vendor}, ${item}, ${fruit_type}, ${origin},
          ${packaging_type}, ${product_name}, ${quantity_perpack}, ${unit_weight}, ${reserve_quantity},
          ${quantity}, ${weight}, ${barcode}, ${product_name2}, ${workers}, ${work_time}, ${breed},
          ${origin2}, ${barcode2}, ${display_period}, ${total_quantity}, ${work_difficulty}, ${eta}, ${filename}, ${date}
        )
      `;
    }

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
  reserve_quantity VARCHAR(255),
  quantity VARCHAR(255),
  weight VARCHAR(255),
  barcode VARCHAR(255),
  product_name2 VARCHAR(255),
  workers VARCHAR(255),
  work_time VARCHAR(255),
  breed VARCHAR(255),
  origin2 VARCHAR(255),
  barcode2 VARCHAR(255),
  display_period VARCHAR(255),
  total_quantity VARCHAR(255),
  work_difficulty VARCHAR(255),
  eta VARCHAR(255),
  plan_title VARCHAR(255),
  plan_date VARCHAR(255)
);
*/
