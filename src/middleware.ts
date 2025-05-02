import type { NextRequest } from "next/server";

const exports = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const UserJWT = request.cookies.get("jwt3");
  if ((pathname.startsWith("/auth") || pathname.toString() == "/") && UserJWT) {
    return Response.redirect(new URL("/dashboard/home", request.url));
  } else if ((pathname.startsWith("/dashboard") || pathname.toString() == "/") && !UserJWT) {
    return Response.redirect(new URL("/auth/login", request.url));
  }
};

export default exports;
