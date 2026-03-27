import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByUserName } from "@/lib/db";
import { signToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { username, password } = body as {
			username?: string;
			password?: string;
		};

		if (
			!username ||
			typeof username !== "string" ||
			!password ||
			typeof password !== "string"
		) {
			return NextResponse.json(
				{ error: "Username and password are required" },
				{ status: 400 },
			);
		}

		// Sanitise inputs
		const safeUserName = username.trim().slice(0, 64);

		const user = await getUserByUserName(safeUserName);
		// Always run bcrypt to prevent timing-based username enumeration.
		// Dummy hash is a real bcrypt hash so compare() never throws.
		const DUMMY_HASH =
			"$2a$10$67dQmknNi7NF9ygWGTtd5.FCdALnOCfLqcs6nCs9s36PI5IJ8N9EC";
		const valid = await bcrypt.compare(
			password,
			user?.passWord ?? DUMMY_HASH,
		);

		if (!user || !valid) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 },
			);
		}

		const token = await signToken({
			sub: user._id!,
			userName: user.userName,
			role: user.role,
		});

		const response = NextResponse.json({
			user: {
				_id: user._id,
				userName: user.userName,
				role: user.role,
			},
		});

		response.cookies.set("auth_token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24, // 24 h
			path: "/",
		});

		return response;
	} catch {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
