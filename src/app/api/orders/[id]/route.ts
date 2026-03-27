import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOrderById, updateOrderStatus } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { OrderStatus } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const order = await getOrderById(id);
	if (!order) {
		return NextResponse.json({ error: "Order not found" }, { status: 404 });
	}
	return NextResponse.json({ order });
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token")?.value;
	if (!token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const user = await verifyToken(token);
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { id } = await params;

	try {
		const body = (await request.json()) as { status?: OrderStatus };
		if (!body.status || !Object.values(OrderStatus).includes(body.status)) {
			return NextResponse.json(
				{ error: "Valid status required" },
				{ status: 400 },
			);
		}
		const order = await updateOrderStatus(id, body.status);
		if (!order) {
			return NextResponse.json(
				{ error: "Order not found" },
				{ status: 404 },
			);
		}
		return NextResponse.json({ order });
	} catch {
		return NextResponse.json(
			{ error: "Invalid request body" },
			{ status: 400 },
		);
	}
}
