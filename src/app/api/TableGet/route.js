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