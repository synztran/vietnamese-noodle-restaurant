import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Protect all /staff/* routes
	if (pathname.startsWith("/staff")) {
		const token = request.cookies.get("auth_token")?.value;

		if (!token) {
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("from", pathname);
			return NextResponse.redirect(loginUrl);
		}

		try {
			const secret = process.env.JWT_HEX32 || process.env.JWT_SECRET;
			if (!secret) throw new Error("JWT_SECRET not set");
			await jwtVerify(token, new TextEncoder().encode(secret));
			return NextResponse.next();
		} catch {
			const loginUrl = new URL("/login", request.url);
			return NextResponse.redirect(loginUrl);
		}
	}

	// Redirect already-authenticated users away from /login
	if (pathname === "/login") {
		const token = request.cookies.get("auth_token")?.value;
		if (token) {
			try {
				const secret = process.env.JWT_HEX32 || process.env.JWT_SECRET;
				if (!secret) throw new Error("JWT_SECRET not set");
				await jwtVerify(token, new TextEncoder().encode(secret));
				return NextResponse.redirect(
					new URL("/staff/orders", request.url),
				);
			} catch {
				// token invalid – let them log in again
			}
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/staff/:path*", "/login"],
};
