import bcrypt from "bcryptjs";
import UserModel from "./models/User";

/**
 * Seeds the database with an initial admin account if no users exist.
 * Called once after the MongoDB connection is established.
 */
export async function seedIfEmpty(): Promise<void> {
	const count = await UserModel.countDocuments();
	if (count > 0) return;

	const hash = await bcrypt.hash("123456", 10);
	await UserModel.create({
		userName: "ngocmai",
		passWord: hash,
		role: "Admin",
		createdAt: new Date(),
	});
	console.log("[seed] Created initial admin account: ngocmai / 123456");
}
