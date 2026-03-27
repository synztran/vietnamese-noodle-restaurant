import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "./types";

function getSecret(): Uint8Array {
	const secret = process.env.JWT_HEX32 || process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET environment variable is required");
	}
	return new TextEncoder().encode(secret);
}

export async function signToken(payload: JWTPayload): Promise<string> {
	return new SignJWT({ ...payload })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("24h")
		.sign(getSecret());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
	try {
		const { payload } = await jwtVerify(token, getSecret());
		return payload as unknown as JWTPayload;
	} catch {
		return null;
	}
}
