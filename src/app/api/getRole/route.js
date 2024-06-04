import { sql } from "@vercel/postgres";

export async function POST(req) {
  const { id } = await req.json();

  try {
    const result = await sql`
      SELECT role FROM users WHERE id = ${id} 
    `;
    if (result.rowCount > 0) {
      return new Response(JSON.stringify({ role: result.rows[0].role }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error("Error during SQL execution:", err);
    return new Response(JSON.stringify({ message: "Failed to fetch user role", error: err.message }), {
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
