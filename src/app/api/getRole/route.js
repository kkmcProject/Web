import { sql } from "@vercel/postgres";

export async function POST(req) {
  const { id } = await req.json();

  try {
    const result = await sql`
      SELECT role, id, name, position, class FROM users WHERE id = ${id}
    `;
    if (result.rowCount > 0) {
      return new Response(JSON.stringify(result.rows[0]), {
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
    return new Response(JSON.stringify({ message: "Failed to fetch user data", error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(req) {
  const { id, name, position, class: classs } = await req.json();

  try {
    const result = await sql`
      UPDATE users 
      SET name = ${name}, position = ${position}, class = ${classs}
      WHERE id = ${id}
    `;
    return new Response(JSON.stringify({ message: "User data updated successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error during SQL execution:", err);
    return new Response(JSON.stringify({ message: "Failed to update user data", error: err.message }), {
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



// import { sql } from "@vercel/postgres";

// export async function POST(req) {
//   const { id } = await req.json();

//   try {
//     const result = await sql`
//       SELECT role, id, name, position, class FROM users WHERE id = ${id}
//     `;
//     if (result.rowCount > 0) {
//       return new Response(JSON.stringify(result.rows[0]), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       });
//     } else {
//       return new Response(JSON.stringify({ message: "User not found" }), {
//         status: 404,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//   } catch (err) {
//     console.error("Error during SQL execution:", err);
//     return new Response(JSON.stringify({ message: "Failed to fetch user data", error: err.message }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

// export function GET() {
//   return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
//     status: 405,
//     headers: { "Content-Type": "application/json" },
//   });
// }

// import { sql } from "@vercel/postgres";

// export async function POST(req) {
//   const { id } = await req.json();

//   try {
//     const result = await sql`
//       SELECT role FROM users WHERE id = ${id} 
//     `;
//     if (result.rowCount > 0) {
//       return new Response(JSON.stringify({ role: result.rows[0].role }), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       });
//     } else {
//       return new Response(JSON.stringify({ message: "User not found" }), {
//         status: 404,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//   } catch (err) {
//     console.error("Error during SQL execution:", err);
//     return new Response(JSON.stringify({ message: "Failed to fetch user role", error: err.message }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

// export function GET() {
//   return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
//     status: 405,
//     headers: { "Content-Type": "application/json" },
//   });
// }
