/**
 * RESTAURANT DATABASE INTERFACES - UNIFIED
 * Project: Vietnamese Noodle Restaurant (Hủ Tiếu & Mì)
 */

// --- USER MANAGEMENT ---

export interface IUser {
	_id?: string;
	userName: string;
	passWord: string; // Always stored as bcrypt hash — never plain text
	role: "Admin" | "Staff" | "Customer";
	createdAt: Date;
}

// --- CONSTANTS & ENUMS ---

export enum NoodleType {
	HuTieu = "Hủ tiếu",
	BanhCanh = "Bánh canh",
	MiGoi = "Mì gói",
	MiBot = "Mì bột",
	MiTuoi = "Mì tươi",
	Nui = "Nui",
}

export enum ToppingCategory {
	Chicken = "Gà",
	Pork = "Heo",
	Seafood = "Hải sản",
	Side = "Món kèm",
	Special = "Đặc biệt",
}

export enum OrderStatus {
	Pending = "Chờ xử lý",
	Cooking = "Đang nấu",
	Served = "Đã phục vụ",
	Paid = "Đã thanh toán",
	Cancelled = "Đã hủy",
	Scheduled = "Đặt trước",
}

// --- CORE DATA STRUCTURES ---

/**
 * Individual Topping definition
 */
export interface ITopping {
	id: string;
	name: string;
	category: ToppingCategory;
	price: number;
	isAvailable: boolean;
}

/**
 * Represents a single bowl (Child dish).
 * Supports multiple noodle types (e.g., "Hủ tiếu mì")
 * and multiple toppings referenced by ID.
 */
export interface IDish {
	noodleTypes: NoodleType[];
	toppings: string[]; // Array of ITopping.id
	customerNote?: string; // e.g., "Ít bánh, không giá"
	basePrice: number; // Sum of noodle-type base prices
	totalDishPrice: number; // basePrice + sum of topping prices
}

/**
 * The Main Order.
 * Connects the staff member (createdBy) to the table and the food.
 */
export interface IOrder {
	_id?: string;
	orderNumber: number;
	tableNumber: string | number;
	createdBy: string; // IUser._id of the staff who took the order
	dishes: IDish[];
	totalAmount: number; // Sum of all dish.totalDishPrice
	status: OrderStatus;
	createdAt: Date;
	updatedAt: Date;
	fees?: {
		holidayServiceFee?: number; // Calculated at order creation based on settings, added to totalAmount
	};
	scheduleOrder?: {
		scheduledAt: Date;
		customerName?: string;
		customerPhone?: string;
	};
	realPaidPrice?: number; // Actual amount paid by customer (can differ from totalAmount if discounts or adjustments are applied at payment time)
}

// --- SETTINGS ---

export interface ISettings {
	noodlePrices: Partial<Record<NoodleType, number>>;
	toppingPrices: Record<string, number>;
	holidayServiceFee: {
		enabled: boolean;
		/** "absolute": fixed VND per order | "percent": % of subtotal */
		feeType: "absolute" | "percent";
		amount: number; // VND if absolute, 0–100 if percent
	};
	dailyTarget: number;
	monthlyTarget: number;
	applyForcePaid: boolean; // If true, staff can mark orders as Paid even if they haven't gone through the normal flow (e.g., for walk-ins or phone orders)
}

// --- JWT PAYLOAD ---

export interface JWTPayload {
	sub: string;
	userName: string;
	role: "Admin" | "Staff" | "Customer";
	name?: string;
}

// --- INPUT TYPES ---

export type CreateOrderInput = {
	tableNumber: string | number;
	createdBy?: string; // staff user ID (resolved server-side from JWT if omitted)
	dishes: Array<{
		noodleTypes: NoodleType[];
		toppings: string[]; // ITopping IDs
		customerNote?: string;
	}>;
	scheduleOrder?: {
		scheduledAt: string; // ISO string from client
		customerName?: string;
		customerPhone?: string;
	};
};

export type UpdateOrderInput = {
	status?: OrderStatus;
	realPaidPrice?: number; // Actual amount received from customer at payment time
};

export type CreateUserInput = {
	userName: string;
	passWord: string; // plain-text — will be hashed before storage
	role: "Admin" | "Staff" | "Customer";
};

// --- REFERENCE DATA ---

/** Full noodle base price map */
export const NOODLE_PRICES: Record<NoodleType, number> = {
	[NoodleType.HuTieu]: 0,
	[NoodleType.BanhCanh]: 0,
	[NoodleType.MiGoi]: 0,
	[NoodleType.MiBot]: 0,
	[NoodleType.MiTuoi]: 0,
	[NoodleType.Nui]: 0,
};

/** Canonical topping catalogue (prices in VND) */
export const MENU_TOPPINGS: ITopping[] = [
	// Gà
	{
		id: "ga-xe",
		name: "Thịt gà xé",
		category: ToppingCategory.Chicken,
		price: 0,
		isAvailable: true,
	},
	{
		id: "canh-ga",
		name: "Cánh gà",
		category: ToppingCategory.Chicken,
		price: 0,
		isAvailable: true,
	},
	{
		id: "dui-ga",
		name: "Đùi gà",
		category: ToppingCategory.Chicken,
		price: 0,
		isAvailable: true,
	},

	// Heo
	{
		id: "heo-tuoi",
		name: "Thịt heo tươi",
		category: ToppingCategory.Pork,
		price: 0,
		isAvailable: true,
	},
	{
		id: "duoi-heo",
		name: "Đuôi heo",
		category: ToppingCategory.Pork,
		price: 0,
		isAvailable: true,
	},
	{
		id: "long-heo",
		name: "Lòng heo",
		category: ToppingCategory.Pork,
		price: 0,
		isAvailable: true,
	},
	{
		id: "xuong-heo",
		name: "Xương heo",
		category: ToppingCategory.Pork,
		price: 0,
		isAvailable: true,
	},
	{
		id: "cha-lua",
		name: "Chả lụa",
		category: ToppingCategory.Pork,
		price: 0,
		isAvailable: true,
	},
	// {
	// 	id: "hoanh-thanh",
	// 	name: "Hoành thánh",
	// 	category: ToppingCategory.Pork,
	// 	price: 0,
	// 	isAvailable: true,
	// },

	// Hải sản
	{
		id: "tom",
		name: "Tôm",
		category: ToppingCategory.Seafood,
		price: 0,
		isAvailable: true,
	},
	{
		id: "muc",
		name: "Mực",
		category: ToppingCategory.Seafood,
		price: 0,
		isAvailable: true,
	},
	{
		id: "hai-san",
		name: "Hải sản",
		category: ToppingCategory.Seafood,
		price: 0,
		isAvailable: true,
	},
	// {
	// 	id: "cua",
	// 	name: "Cua",
	// 	category: ToppingCategory.Seafood,
	// 	price: 0,
	// 	isAvailable: true,
	// },
	// {
	// 	id: "ca-vien",
	// 	name: "Cá viên",
	// 	category: ToppingCategory.Seafood,
	// 	price: 0,
	// 	isAvailable: true,
	// },

	// Món kèm
	{
		id: "trung-cut",
		name: "Trứng cút",
		category: ToppingCategory.Side,
		price: 0,
		isAvailable: true,
	},
	// {
	// 	id: "rau-them",
	// 	name: "Rau thêm",
	// 	category: ToppingCategory.Side,
	// 	price: 0,
	// 	isAvailable: true,
	// },
	// {
	// 	id: "gia-them",
	// 	name: "Giá thêm",
	// 	category: ToppingCategory.Side,
	// 	price: 0,
	// 	isAvailable: true,
	// },
	// {
	// 	id: "chanh",
	// 	name: "Chanh",
	// 	category: ToppingCategory.Side,
	// 	price: 0,
	// 	isAvailable: true,
	// },
	{
		id: "thap-cam",
		name: "Thập cẩm",
		category: ToppingCategory.Special,
		price: 0,
		isAvailable: true,
	},
	{
		id: "hoanh-thanh",
		name: "Hoành thánh",
		category: ToppingCategory.Special,
		price: 0,
		isAvailable: true,
	},
];
