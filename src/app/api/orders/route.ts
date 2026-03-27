import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOrders, createOrder } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { OrderStatus } from "@/lib/types";
import type { CreateOrderInput } from "@/lib/types";

export const runtime = "nodejs";

// GET /api/orders — staff only, optional ?status= filter
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

	const status = request.nextUrl.searchParams.get(
		"status",
	) as OrderStatus | null;
	const orders = await getOrders(status ?? undefined);
	return NextResponse.json({ orders });
}

// POST /api/orders — staff only (JWT required)
export async function POST(request: NextRequest) {
	const cookieStore = await cookies();
	let userId = "anonymous";
	const token = cookieStore.get("auth_token")?.value;
	if (token) {
		const u = await verifyToken(token);
		if (u) userId = u.sub;
	}

	try {
		const body = (await request.json()) as CreateOrderInput;

		if (!Array.isArray(body.dishes) || body.dishes.length === 0) {
			return NextResponse.json(
				{ error: "Order must have at least one dish" },
				{ status: 400 },
			);
		}

		const order = await createOrder(body, userId);
		return NextResponse.json({ order }, { status: 201 });
	} catch {
		return NextResponse.json(
			{ error: "Invalid request body" },
			{ status: 400 },
		);
	}
}
