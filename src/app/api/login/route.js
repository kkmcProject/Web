import { sql } from "@vercel/postgres";

export async function POST(req) {
  const { id, password } = await req.json();

  try {
    const result = await sql`
      SELECT id, name, position, role, class FROM users 
      WHERE id = ${id} 
      AND password = ${password}
    `;
    if (result.rowCount > 0) {
      return new Response(JSON.stringify({ message: "Login Success", result: result.rows[0] }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Set-Cookie": "connect.sid=msw-cookie;HttpOnly;Path=/" },
      });
    } else {
      return new Response(JSON.stringify({ message: "Login Failed: Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error("Error during SQL execution:", err);
    return new Response(JSON.stringify({ message: "Login Failed", error: err.message }), {
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
