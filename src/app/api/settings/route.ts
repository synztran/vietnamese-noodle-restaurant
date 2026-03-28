import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getSettings, updateSettings } from "@/lib/db";
import type { ISettings } from "@/lib/types";

export const runtime = "nodejs";

// GET /api/settings — returns current restaurant settings
export async function GET() {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token")?.value;
	if (!token)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const user = await verifyToken(token);
	if (!user)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const settings = await getSettings();
	return NextResponse.json(settings);
}

// PUT /api/settings — updates restaurant settings
export async function PUT(request: NextRequest) {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token")?.value;
	if (!token)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const user = await verifyToken(token);
	if (!user)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	let body: Partial<ISettings>;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	// Validate numeric values are >= 0
	if (body.noodlePrices) {
		for (const val of Object.values(body.noodlePrices)) {
			if (typeof val !== "number" || val < 0 || !isFinite(val)) {
				return NextResponse.json(
					{ error: "Invalid noodle price" },
					{ status: 400 },
				);
			}
		}
	}
	if (body.toppingPrices) {
		for (const val of Object.values(body.toppingPrices)) {
			if (typeof val !== "number" || val < 0 || !isFinite(val)) {
				return NextResponse.json(
					{ error: "Invalid topping price" },
					{ status: 400 },
				);
			}
		}
	}
	if (body.holidayServiceFee) {
		const fee = body.holidayServiceFee;
		if (typeof fee.enabled !== "boolean") {
			return NextResponse.json(
				{ error: "Invalid holiday fee" },
				{ status: 400 },
			);
		}
		if (fee.feeType !== "absolute" && fee.feeType !== "percent") {
			return NextResponse.json(
				{ error: "Invalid fee type" },
				{ status: 400 },
			);
		}
		const maxAmount = fee.feeType === "percent" ? 100 : Infinity;
		if (
			typeof fee.amount !== "number" ||
			fee.amount < 0 ||
			!isFinite(fee.amount) ||
			fee.amount > maxAmount
		) {
			return NextResponse.json(
				{ error: "Invalid holiday fee amount" },
				{ status: 400 },
			);
		}
	}
	if (
		body.dailyTarget !== undefined &&
		(typeof body.dailyTarget !== "number" || body.dailyTarget < 0)
	) {
		return NextResponse.json(
			{ error: "Invalid daily target" },
			{ status: 400 },
		);
	}
	if (
		body.monthlyTarget !== undefined &&
		(typeof body.monthlyTarget !== "number" || body.monthlyTarget < 0)
	) {
		return NextResponse.json(
			{ error: "Invalid monthly target" },
			{ status: 400 },
		);
	}

	const settings = await updateSettings(body);
	return NextResponse.json(settings);
}
