import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
export async function POST(req){
    let { filename, flag } = await req.json();


    // const filename = '2024-05-01';
    console.log('filename:', filename);
    try {
        if(flag === '/'){
            const result = await sql`
            SELECT plan_title FROM workplandoc ORDER BY plan_title DESC LIMIT 1;
        `;
        if(result.rowCount > 0) {
                filename = result.rows[0].plan_title;
            } else {
                return NextResponse.json({ message: "No plan_title found in the database", status: 404 });
            }
        }

        const result = await sql`
            SELECT * FROM workplandoc WHERE plan_title = ${filename};
        `   
        const returnFilename = result?.rows[0]?.plan_title;
        const cleanedRows = result.rows.map(row => {
            const { plan_title, ...cleanedRow } = row;
            return cleanedRow;
        });

        return NextResponse.json({message: "Successfully get data", status:200, result:cleanedRows, filename: returnFilename});
    } catch(err){
        console.error("Error during SQL execution:", err);
        return NextResponse.json(({ message: "Failed to upload CSV data", error: err.message }, {status:500}), {          
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
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

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

    const scriptPath = path.resolve('script.py');
    const tempDir = path.resolve('/tmp');

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const rowsFilePath = path.join(tempDir, `${uuidv4()}_rows.json`);
    const workGroupFilePath = path.join(tempDir, `${uuidv4()}_workGroup.json`);

    fs.writeFileSync(rowsFilePath, JSON.stringify(rows_extracted), { encoding: 'utf-8' });
    fs.writeFileSync(workGroupFilePath, JSON.stringify(workGroup), { encoding: 'utf-8' });

    return new Promise((resolve, reject) => {
      exec(`python "${scriptPath}" "${rowsFilePath}" "${workGroupFilePath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          console.error(`stderr: ${stderr}`);
          fs.unlinkSync(rowsFilePath);
          fs.unlinkSync(workGroupFilePath);
          resolve(NextResponse.json({ error: 'Something went wrong', details: stderr }, { status: 500 }));
        } else {
          const fileContent = fs.readFileSync(rowsFilePath, { encoding: 'utf-8' });
          const updatedRows = JSON.parse(fileContent);
          rows['전체'] = rows['전체'].map(item => {
            const updatedItem = updatedRows.find(u => u.index === item.index);
            return updatedItem ? { ...item, workGroup: updatedItem.group } : item;
          });

          fs.unlinkSync(rowsFilePath);
          fs.unlinkSync(workGroupFilePath);

          resolve(NextResponse.json({ message: 'Success', updatedRows: rows }, { status: 200 }));
        }
      });
    });
  } catch (error) {
    console.error(`Request error: ${error}`);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}

export function GET() {
  return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}
*/