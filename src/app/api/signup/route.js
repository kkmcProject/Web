import { sql } from "@vercel/postgres";

const ROLE = "user";

export async function POST(req) {
  const { id, name, password, position, class: classs } = await req.json();

  try {
    const result =
      await sql`INSERT INTO users (id, name, password, position, role, class) VALUES (${id}, ${name}, ${password}, ${position}, ${ROLE}, ${classs})`;
    return new Response(JSON.stringify({ message: "UserData Inserted Successfully", result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: "UserData Inserted Failed", error: err }), {
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
