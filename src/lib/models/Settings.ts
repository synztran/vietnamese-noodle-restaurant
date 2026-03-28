import mongoose, { Schema, type Model } from "mongoose";

const holidayFeeSchema = new Schema(
	{
		enabled: { type: Boolean, default: false },
		feeType: {
			type: String,
			enum: ["absolute", "percent"],
			default: "absolute",
		},
		amount: { type: Number, default: 5000 },
	},
	{ _id: false },
);

const settingsSchema = new Schema({
	noodlePrices: { type: Map, of: Number, default: () => new Map() },
	toppingPrices: { type: Map, of: Number, default: () => new Map() },
	holidayServiceFee: { type: holidayFeeSchema, default: () => ({}) },
	dailyTarget: { type: Number, default: 15_000_000 },
	monthlyTarget: { type: Number, default: 400_000_000 },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SettingsModel: Model<any> =
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(mongoose.models.Settings as Model<any>) ??
	mongoose.model("Settings", settingsSchema);

export default SettingsModel;
