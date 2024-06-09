import { sql } from "@vercel/postgres";

export async function POST(req) {
  try {
    const result =
      await sql`SELECT id, name, position, role, class
      FROM users`;
   // console.log(result);
    return new Response(JSON.stringify({ message: "UserData Retrieved Successfully", result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: "UserData Retrieval Failed", error: err }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, role } = body;
    const result =
      await sql`UPDATE users
                SET role = ${role}
                WHERE id = ${id};`
    //console.log(result);
    return new Response(JSON.stringify({ message: "UserData Updated Successfully", result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: "UserData Update Failed", error: err }), {
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
