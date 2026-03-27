import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token")?.value;

	if (!token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const payload = await verifyToken(token);
	if (!payload) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	return NextResponse.json({
		_id: payload.sub,
		userName: payload.userName,
		role: payload.role,
	});
}
