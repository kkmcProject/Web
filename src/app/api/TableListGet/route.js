import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        const response = await sql`
            SELECT DISTINCT plan_title FROM workplandoc ORDER BY plan_title DESC;
        `
        console.log('rows는', response.rows);
        
        return NextResponse.json({message: "Successfully get Table List", status:200, result:response.rows})
    } catch(err){
        console.error("Error during SQL execution:", err);
        return new Response(JSON.stringify({ message: "Failed to get Table List", error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
    }
}

export async function GET(){
    return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
    });
}