import bcrypt from "bcryptjs";
import connectDB from "./mongoose";
import UserModel from "./models/User";
import OrderModel from "./models/Order";
import type { IUser, IOrder, CreateOrderInput, CreateUserInput } from "./types";
import {
	OrderStatus,
	ToppingCategory,
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

	const last = await OrderModel.findOne(
		{},
		{ orderNumber: 1 },
		{ sort: { orderNumber: -1 } },
	).lean();
	const nextNumber = last ? (last.orderNumber as number) + 1 : 8894;

	const dishes: IDish[] = input.dishes.map((d) => {
		const basePrice = d.noodleTypes.reduce(
			(s, nt) => s + (NOODLE_PRICES[nt] ?? 0),
			0,
		);
		const toppingsTotal = d.toppings.reduce(
			(s, tid) =>
				s + (MENU_TOPPINGS.find((t) => t.id === tid)?.price ?? 0),
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

	const totalAmount = dishes.reduce((s, d) => s + d.totalDishPrice, 0);
	const now = new Date();

	const doc = await OrderModel.create({
		orderNumber: nextNumber,
		tableNumber: input.tableNumber,
		createdBy: input.createdBy ?? userId,
		dishes,
		totalAmount,
		status: OrderStatus.Pending,
		createdAt: now,
		updatedAt: now,
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
