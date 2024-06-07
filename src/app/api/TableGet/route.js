import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
export async function POST(req){
    // const { filename, flag } = await req.json();

    const filename = '2024-05-01';

    try {
        const result = await sql`
            SELECT * FROM workplandoc WHERE plan_title = ${filename};
        `

        return new Promise((resolve, reject) => {
            resolve(NextResponse.json({message: "Successfully get data"}, {status:200}, {result:result}));
        })
        
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