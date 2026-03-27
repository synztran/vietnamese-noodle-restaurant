import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUsers, createUser } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import type { CreateUserInput } from "@/lib/types";

export const runtime = "nodejs";

async function requireAdmin(request: NextRequest) {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token")?.value;
	if (!token) return null;
	const user = await verifyToken(token);
	if (!user || user.role !== "Admin") return null;
	return user;
}

// GET /api/users — Admin only
export async function GET(request: NextRequest) {
	const admin = await requireAdmin(request);
	if (!admin) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}
	const users = await getUsers();
	return NextResponse.json({ users });
}

// POST /api/users — Admin only
export async function POST(request: NextRequest) {
	const admin = await requireAdmin(request);
	if (!admin) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	try {
		const body = (await request.json()) as Partial<CreateUserInput>;

		if (!body.userName || typeof body.userName !== "string") {
			return NextResponse.json(
				{ error: "userName is required" },
				{ status: 400 },
			);
		}
		if (!body.passWord || typeof body.passWord !== "string") {
			return NextResponse.json(
				{ error: "passWord is required" },
				{ status: 400 },
			);
		}
		if (!body.role || !["Admin", "Staff", "Customer"].includes(body.role)) {
			return NextResponse.json(
				{ error: "role must be Admin, Staff, or Customer" },
				{ status: 400 },
			);
		}

		const user = await createUser({
			userName: body.userName.trim(),
			passWord: body.passWord,
			role: body.role,
		});

		return NextResponse.json({ user }, { status: 201 });
	} catch (err) {
		const message =
			err instanceof Error ? err.message : "Failed to create user";
		return NextResponse.json({ error: message }, { status: 409 });
	}
}
