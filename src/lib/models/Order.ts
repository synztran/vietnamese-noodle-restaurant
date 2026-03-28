import mongoose, { Schema, model, models, type Document } from "mongoose";
import { OrderStatus, NoodleType } from "@/lib/types";
import type { IOrder, IDish } from "@/lib/types";

export interface IOrderDocument extends Omit<IOrder, "_id">, Document {}

const DishSchema = new Schema<IDish>(
	{
		noodleTypes: [
			{ type: String, enum: Object.values(NoodleType), required: true },
		],
		toppings: [{ type: String }],
		customerNote: { type: String },
		basePrice: { type: Number, required: true },
		totalDishPrice: { type: Number, required: true },
	},
	{ _id: false },
);

const OrderSchema = new Schema<IOrderDocument>(
	{
		orderNumber: { type: Number, required: true },
		tableNumber: { type: Schema.Types.Mixed, required: true },
		createdBy: { type: String, required: true },
		dishes: { type: [DishSchema], required: true },
		totalAmount: { type: Number, required: true },
		status: {
			type: String,
			enum: Object.values(OrderStatus),
			default: OrderStatus.Pending,
			required: true,
		},
		createdAt: { type: Date, default: () => new Date() },
		updatedAt: { type: Date, default: () => new Date() },
    fees: {
      holidayServiceFee: { type: Number, default: 0 },
    }
	},
	{ timestamps: false, versionKey: false },
);

// Index for fast status-based live feed queries
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ createdAt: -1 });

const OrderModel =
	(models.Order as mongoose.Model<IOrderDocument>) ||
	model<IOrderDocument>("Order", OrderSchema);

export default OrderModel;
