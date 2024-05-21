import { auth } from "./auth";
import { NextResponse } from "next/server";

export async function middleware() {
  const session = await auth();
  if (!session) {
    return NextResponse.redirect("http://localhost:3000/flow/login");
  }
}

export const config = {
  matcher: ["/", "/change-info", "/manage-plan"],
};
