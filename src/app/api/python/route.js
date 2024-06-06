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
    // 요청 본문을 파싱
    const body = await req.json();
    const { rows, workGroup } = body;

    if (!rows || !workGroup) {
      throw new Error('Invalid input data');
    }

    // 전체에서 index 열 추가
    rows['전체'] = rows['전체'].map((item, index) => ({
      ...item,
      index: index + 1
    }));

    // rows_extracted 만들기
    const rows_extracted = rows['전체']
      .filter(item => item['작업 난도'] !== 0) // 작업 난도가 0인 행 제거
      .map(item => ({
        fruit: fruitTranslation[item['품목분류']] || item['품목분류'],
        hard: item['작업 난도'],
        index: item.index
      }));

    if (!rows || !workGroup) {
      throw new Error('Invalid input data');
    }

    const scriptPath = path.resolve('./script.py'); // script.py의 절대 경로를 지정

    // 임시 파일을 저장할 디렉토리 경로
    const tempDir = path.resolve('./temp');
    
    // temp 디렉토리가 존재하지 않으면 생성
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // JSON 데이터를 임시 파일에 저장
    const rowsFilePath = path.join(tempDir, `${uuidv4()}_rows.json`);
    const workGroupFilePath = path.join(tempDir, `${uuidv4()}_workGroup.json`);

    // JSON 데이터를 파일에 쓰기 전에 콘솔에 로그를 남겨서 확인합니다.
    console.log("Writing JSON data to files");
    console.log("rowsFilePath:", rowsFilePath);
    console.log("workGroupFilePath:", workGroupFilePath);

    // 인코딩 옵션 추가
    fs.writeFileSync(rowsFilePath, JSON.stringify(rows_extracted), { encoding: 'utf-8' });
    fs.writeFileSync(workGroupFilePath, JSON.stringify(workGroup), { encoding: 'utf-8' });

    console.log(`Executing script: python "${scriptPath}" "${rowsFilePath}" "${workGroupFilePath}"`);

    return new Promise((resolve, reject) => {
      // 파일 경로를 파이썬 스크립트로 전달
      exec(`python "${scriptPath}" "${rowsFilePath}" "${workGroupFilePath}"`, { encoding: 'utf-8' }, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          console.error(`stderr: ${stderr}`);
          fs.unlinkSync(rowsFilePath);
          fs.unlinkSync(workGroupFilePath);
          resolve(NextResponse.json({ error: 'Something went wrong', details: stderr }, { status: 500 }));
        } else {
          console.log(`stdout: ${stdout}`);

          // 결과 JSON 파일 읽기 전에 파일 내용을 로그로 출력하여 디버깅
          const fileContent = fs.readFileSync(rowsFilePath, { encoding: 'utf-8' });
          

          // 파이썬 스크립트 실행 후 결과 파일을 읽어서 rows 객체 업데이트
          const updatedRows = JSON.parse(fileContent);
          rows['전체'] = rows['전체'].map(item => {
            const updatedItem = updatedRows.find(u => u.index === item.index);
            return updatedItem ? { ...item, workGroup: updatedItem.group } : item;
          });
          console.log("Result file content:", rows['전체']);

          // 결과 파일 삭제
          fs.unlinkSync(rowsFilePath);
          fs.unlinkSync(workGroupFilePath);

          resolve(NextResponse.json({ message: 'Success', updatedRows: rows }, { status: 200 }));
        }
      });
    });
  } catch (error) {
    console.error(`Request error: ${error}`);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export function GET() {
  return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}
