import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOrderHistory } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

// GET /api/history?from=YYYY-MM-DD&to=YYYY-MM-DD
export async function GET(request: NextRequest) {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token")?.value;
	if (!token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const user = await verifyToken(token);
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const from = request.nextUrl.searchParams.get("from") ?? undefined;
	const to = request.nextUrl.searchParams.get("to") ?? undefined;

	const orders = await getOrderHistory(from, to);
	const total = orders.length;
	const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

	return NextResponse.json({ orders, total, revenue });
}
