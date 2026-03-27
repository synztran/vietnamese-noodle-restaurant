import { NextRequest, NextResponse } from "next/server";
import { getToppings, getToppingsByCategory } from "@/lib/db";
import { ToppingCategory } from "@/lib/types";

export const runtime = "nodejs";

// GET /api/toppings?category=Pork — public
export async function GET(request: NextRequest) {
	const cat = request.nextUrl.searchParams.get(
		"category",
	) as ToppingCategory | null;

	if (cat) {
		if (!Object.values(ToppingCategory).includes(cat)) {
			return NextResponse.json(
				{ error: "Invalid category" },
				{ status: 400 },
			);
		}
		return NextResponse.json({ toppings: getToppingsByCategory(cat) });
	}

	// Return grouped by category
	const all = getToppings();
	const grouped = Object.values(ToppingCategory).reduce(
		(acc, c) => {
			acc[c] = all.filter((t) => t.category === c);
			return acc;
		},
		{} as Record<ToppingCategory, typeof all>,
	);

	return NextResponse.json({ toppings: all, grouped });
}
