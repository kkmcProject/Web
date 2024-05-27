// import { auth } from "./auth";
// import { NextResponse } from "next/server";

// export async function middleware() {
//   const session = await auth();
//   if (!session) {
//     return NextResponse.redirect("http://localhost:3000/flow/login");
//   } else {
//     return NextResponse.redirect("http://localhost:3000/");
//   }
// }

// export const config = {
//   matcher: ["/change-info", "/manage-plan"],
// };

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
