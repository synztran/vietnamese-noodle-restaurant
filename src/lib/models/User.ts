import mongoose, { Schema, model, models, type Document } from "mongoose";
import type { IUser } from "@/lib/types";

export interface IUserDocument extends Omit<IUser, "_id">, Document {}

const UserSchema = new Schema<IUserDocument>(
	{
		userName: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			maxlength: 64,
		},
		passWord: { type: String, required: true },
		role: {
			type: String,
			enum: ["Admin", "Staff", "Customer"],
			required: true,
		},
		createdAt: { type: Date, default: () => new Date() },
	},
	{ timestamps: false, versionKey: false },
);

// Index for fast username lookup
UserSchema.index({ userName: 1 });

const UserModel =
	(models.User as mongoose.Model<IUserDocument>) ||
	model<IUserDocument>("User", UserSchema);

export default UserModel;
