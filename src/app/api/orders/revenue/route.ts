import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDailyRevenue } from "@/lib/db";

export const runtime = "nodejs";

// GET /api/orders/revenue — returns today's total revenue for Paid orders
export async function GET() {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token")?.value;
	if (!token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const user = await verifyToken(token);
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const revenue = await getDailyRevenue();
	return NextResponse.json({ revenue });
}
