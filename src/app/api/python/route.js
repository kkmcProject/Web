import { exec } from 'child_process';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST() {
    const scriptPath = path.resolve('script.py'); // script.py의 절대 경로를 지정
    return new Promise((resolve) => {
        exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                resolve(new NextResponse(JSON.stringify({ error: 'Something went wrong', details: stderr }), { status: 500 }));
            } else {
                resolve(new NextResponse(JSON.stringify({ message: stdout.trim() }), { status: 200 }));
            }
        });
    });
}

export function GET() {
    return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
    });
}
