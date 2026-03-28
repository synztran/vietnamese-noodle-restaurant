import bcrypt from "bcryptjs";
import connectDB from "./mongoose";
import UserModel from "./models/User";
import OrderModel from "./models/Order";
import SettingsModel from "./models/Settings";
import type {
	IUser,
	IOrder,
	ISettings,
	CreateOrderInput,
	CreateUserInput,
} from "./types";
import {
	OrderStatus,
	ToppingCategory,
	NoodleType,
	NOODLE_PRICES,
	MENU_TOPPINGS,
	type ITopping,
	type IDish,
} from "./types";

// ─── Topping helpers (static catalogue — no DB needed) ────────────────────

export function getToppings(): ITopping[] {
	return MENU_TOPPINGS;
}

export function getToppingById(id: string): ITopping | null {
	return MENU_TOPPINGS.find((t) => t.id === id) ?? null;
}

export function getToppingsByCategory(cat: ToppingCategory): ITopping[] {
	return MENU_TOPPINGS.filter((t) => t.category === cat);
}

// ─── User helpers ─────────────────────────────────────────────────────────

export async function getUsers(): Promise<Omit<IUser, "passWord">[]> {
	await connectDB();
	const users = await UserModel.find({}).lean();
	return users.map(({ passWord: _pw, _id, ...rest }) => ({
		...rest,
		_id: String(_id),
	}));
}

export async function getUserById(id: string): Promise<IUser | null> {
	await connectDB();
	const user = await UserModel.findById(id).lean();
	if (!user) return null;
	return { ...user, _id: String(user._id) } as IUser;
}

export async function getUserByUserName(
	userName: string,
): Promise<IUser | null> {
	await connectDB();
	const user = await UserModel.findOne({ userName }).lean();
	if (!user) return null;
	return { ...user, _id: String(user._id) } as IUser;
}

export async function createUser(
	input: CreateUserInput,
): Promise<Omit<IUser, "passWord">> {
	await connectDB();
	const existing = await UserModel.findOne({ userName: input.userName });
	if (existing) throw new Error("USERNAME_TAKEN");
	const passWord = bcrypt.hashSync(input.passWord, 10);
	const doc = await UserModel.create({
		userName: input.userName,
		passWord,
		role: input.role,
		createdAt: new Date(),
	});
	const { passWord: _pw, _id, ...rest } = doc.toObject();
	return { ...rest, _id: String(_id) };
}

// ─── Order helpers ────────────────────────────────────────────────────────

function docToOrder(doc: Record<string, unknown>): IOrder {
	const { _id, __v, ...rest } = doc;
	return { ...rest, _id: String(_id) } as IOrder;
}

export async function getOrders(status?: OrderStatus): Promise<IOrder[]> {
	await connectDB();
	const query = status ? { status } : {};
	const docs = await OrderModel.find(query).sort({ createdAt: -1 }).lean();
	return docs.map((d) => docToOrder(d as unknown as Record<string, unknown>));
}

export async function getOrderById(id: string): Promise<IOrder | null> {
	await connectDB();
	const doc = await OrderModel.findById(id).lean();
	if (!doc) return null;
	return docToOrder(doc as unknown as Record<string, unknown>);
}

export async function createOrder(
	input: CreateOrderInput,
	userId: string,
): Promise<IOrder> {
	await connectDB();

	const settings = await getSettings();

	const last = await OrderModel.findOne(
		{},
		{ orderNumber: 1 },
		{ sort: { orderNumber: -1 } },
	).lean();
	const nextNumber = last ? (last.orderNumber as number) + 1 : 8894;

	const dishes: IDish[] = input.dishes.map((d) => {
		// Only the first noodle type sets the base price (combos don't add extra)
		const basePrice =
			d.noodleTypes.length > 0
				? (settings.noodlePrices[d.noodleTypes[0]] ??
					NOODLE_PRICES[d.noodleTypes[0]] ??
					0)
				: 0;
		const toppingsTotal = d.toppings.reduce(
			(s, tid) =>
				s +
				(settings.toppingPrices[tid] ??
					MENU_TOPPINGS.find((t) => t.id === tid)?.price ??
					0),
			0,
		);
		return {
			noodleTypes: d.noodleTypes,
			toppings: d.toppings,
			customerNote: d.customerNote,
			basePrice,
			totalDishPrice: basePrice + toppingsTotal,
		};
	});

	const dishSubtotal = dishes.reduce((s, d) => s + d.totalDishPrice, 0);
	let holidayFeeAmount = 0;
	if (settings.holidayServiceFee.enabled) {
		if (settings.holidayServiceFee.feeType === "percent") {
			holidayFeeAmount = Math.round(
				dishSubtotal * (settings.holidayServiceFee.amount / 100),
			);
		} else {
			holidayFeeAmount = settings.holidayServiceFee.amount;
		}
	}
	const totalAmount = dishSubtotal + holidayFeeAmount;
	const now = new Date();

	const doc = await OrderModel.create({
		orderNumber: nextNumber,
		tableNumber: input.tableNumber,
		createdBy: input.createdBy ?? userId,
		dishes,
		totalAmount,
		status: input.scheduleOrder
			? OrderStatus.Scheduled
			: OrderStatus.Pending,
		createdAt: now,
		updatedAt: now,
		fees: {
			holidayServiceFee: holidayFeeAmount,
		},
		...(input.scheduleOrder && {
			scheduleOrder: {
				scheduledAt: new Date(input.scheduleOrder.scheduledAt),
				customerName: input.scheduleOrder.customerName,
				customerPhone: input.scheduleOrder.customerPhone,
			},
		}),
	});

	return docToOrder(doc.toObject() as unknown as Record<string, unknown>);
}

export async function updateOrderStatus(
	id: string,
	status: OrderStatus,
): Promise<IOrder | null> {
	await connectDB();
	const doc = await OrderModel.findByIdAndUpdate(
		id,
		{ status, updatedAt: new Date() },
		{ new: true },
	).lean();
	if (!doc) return null;
	return docToOrder(doc as unknown as Record<string, unknown>);
}

export async function getDailyRevenue(): Promise<number> {
	await connectDB();
	const start = new Date();
	start.setHours(0, 0, 0, 0);
	const end = new Date();
	end.setHours(23, 59, 59, 999);
	const result = await OrderModel.aggregate([
		{
			$match: {
				status: OrderStatus.Paid,
				createdAt: { $gte: start, $lte: end },
			},
		},
		{
			$group: {
				_id: null,
				total: { $sum: "$totalAmount" },
			},
		},
	]);
	return result[0]?.total ?? 0;
}

export async function getOrderHistory(
	from?: string,
	to?: string,
): Promise<IOrder[]> {
	await connectDB();
	const filter: Record<string, unknown> = { status: OrderStatus.Paid };
	if (from || to) {
		const dateFilter: Record<string, Date> = {};
		if (from) dateFilter.$gte = new Date(from);
		if (to) {
			const d = new Date(to);
			d.setHours(23, 59, 59, 999);
			dateFilter.$lte = d;
		}
		filter.createdAt = dateFilter;
	}
	const docs = await OrderModel.find(filter).sort({ createdAt: -1 }).lean();
	return docs.map((d) => docToOrder(d as unknown as Record<string, unknown>));
}

// ─── Settings helpers ─────────────────────────────────────────────────────

function mapToObject(val: unknown): Record<string, number> {
	if (!val) return {};
	if (val instanceof Map)
		return Object.fromEntries(val) as Record<string, number>;
	return val as Record<string, number>;
}

function normaliseSettings(raw: Record<string, unknown>): ISettings {
	const fee = (raw.holidayServiceFee ?? {}) as {
		enabled?: boolean;
		feeType?: string;
		amount?: number;
	};
	return {
		noodlePrices: mapToObject(raw.noodlePrices) as Partial<
			Record<NoodleType, number>
		>,
		toppingPrices: mapToObject(raw.toppingPrices),
		holidayServiceFee: {
			enabled: fee.enabled ?? false,
			feeType: fee.feeType === "percent" ? "percent" : "absolute",
			amount: fee.amount ?? 5000,
		},
		dailyTarget: (raw.dailyTarget as number) ?? 15_000_000,
		monthlyTarget: (raw.monthlyTarget as number) ?? 400_000_000,
	};
}

export async function getSettings(): Promise<ISettings> {
	await connectDB();
	const doc = await SettingsModel.findOne({}).lean();
	if (!doc) {
		return {
			noodlePrices: {},
			toppingPrices: {},
			holidayServiceFee: {
				enabled: false,
				feeType: "absolute",
				amount: 5000,
			},
			dailyTarget: 15_000_000,
			monthlyTarget: 400_000_000,
		};
	}
	return normaliseSettings(doc as unknown as Record<string, unknown>);
}

export async function updateSettings(
	input: Partial<ISettings>,
): Promise<ISettings> {
	await connectDB();

	const patch: Record<string, unknown> = {};
	// Pass plain objects — Mongoose does not reliably serialize JS Map
	// instances in findOneAndUpdate $set operations
	if (input.noodlePrices) patch.noodlePrices = { ...input.noodlePrices };
	if (input.toppingPrices) patch.toppingPrices = { ...input.toppingPrices };
	if (input.holidayServiceFee)
		patch.holidayServiceFee = input.holidayServiceFee;
	if (typeof input.dailyTarget === "number")
		patch.dailyTarget = input.dailyTarget;
	if (typeof input.monthlyTarget === "number")
		patch.monthlyTarget = input.monthlyTarget;

	const doc = await SettingsModel.findOneAndUpdate(
		{},
		{ $set: patch },
		{ new: true, upsert: true },
	).lean();

	return normaliseSettings(doc as unknown as Record<string, unknown>);
}
