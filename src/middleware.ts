import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {

  // const allowList = [
  //   "http://localhost",
  //   "http://localhost:3000",
  //   `http://${process.env.NEXT_PUBLIC_BACKEND_URL}`,
  //   `https://www.google.com`,
  // ];

  // const origin = req.headers.get("origin");
  // console.log(origin);

  // if (origin && !allowList.includes(origin)) {
  //   return new NextResponse(null, { status: 400 });
  // }

  const headers = new Headers({
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": `*`, // replace this your actual origin
    "Access-Control-Allow-Methods": "GET,DELETE,PATCH,POST,PUT",
    "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  });

  return NextResponse.next({
    headers,
  });
}

export const config = {
  matcher: "/:path*",
}