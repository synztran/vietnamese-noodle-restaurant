import LikeIcon from "@/iconify/like";
import StarIcon from "@/iconify/star";

export const MENU_CATEGORY: Record<
	string,
	{
		name?: string;
		items?: { name: string }[];
		price?: number;
		replaceName?: string;
		tag?: string;
		vnTag?: string;
		tagStyle?: string;
		iconTag?: () => JSX.Element;
	}[]
> = {
	"Vietnamese rice noodle": [
		{
			name: "Hủ tiếu gà",
			price: 35000,
			items: [{ name: "Hủ tiếu" }, { name: "gà" }, { name: "rau sạch" }],
			replaceName: "Chicken rice noodle soup",
		},
		{
			name: "Hủ tiếu hải sản",
			price: 35000,
			items: [
				{ name: "Hủ tiếu" },
				{ name: "tôm" },
				{ name: "mực" },
				{ name: "rau sạch" },
			],
			replaceName: "Seafood rice noodle soup",
			tag: "Must try",
			vnTag: "Nên thử",
			iconTag: LikeIcon,
			tagStyle: "bg-orange-500",
		},
		{
			name: "Hủ tiếu lòng heo",
			price: 35000,
			items: [
				{ name: "Hủ tiếu" },
				{ name: "gan" },
				{ name: "cật" },
				{ name: "lòng" },
				{ name: "rau sạch" },
			],
			replaceName: "Pork organ rice noodle soup",
		},
		{
			name: "Hủ tiếu thập cẩm",
			price: 35000,
			items: [{ name: "Cá" }, { name: "Cơm" }],
			replaceName: "Combination rice noodle soup",
		},
		{
			name: "Hủ tiếu xương / giò heo",
			price: 35000,
			items: [{ name: "Cá" }, { name: "Cơm" }],
			replaceName: "Pork bone/hock rice noodle soup",
		},
		{
			name: "Hủ tiếu hoành thánh",
			price: 35000,
			items: [{ name: "Cá" }, { name: "Cơm" }],
			replaceName: "Wonton rice noodle soup",
			tag: "Signature",
			vnTag: "Độc quyền",
			iconTag: StarIcon,
			tagStyle: "bg-red-500",
		},
	],
	"Vietnamese noodle": [
		{
			name: "Mì gà",
			price: 35000,
			items: [{ name: "Hủ tiếu" }, { name: "gà" }, { name: "rau sạch" }],
			replaceName: "Chicken vietnamese noodle soup",
		},
		{
			name: "Mì hải sản",
			price: 35000,
			items: [
				{ name: "Hủ tiếu" },
				{ name: "tôm" },
				{ name: "mực" },
				{ name: "rau sạch" },
			],
			replaceName: "Seafood vietnamese noodle soup",
			tag: "Must try",
			vnTag: "Nên thử",
			iconTag: LikeIcon,
			tagStyle: "bg-orange-500 text-lg sm:text-xs",
		},
		{
			name: "Mì lòng heo",
			price: 35000,
			items: [
				{ name: "Hủ tiếu" },
				{ name: "gan" },
				{ name: "cật" },
				{ name: "lòng" },
				{ name: "rau sạch" },
			],
			replaceName: "Pork organ vietnamese noodle soup",
		},
		{
			name: "Mì thập cẩm",
			price: 35000,
			items: [{ name: "Cá" }, { name: "Cơm" }],
			replaceName: "Combination vietnamese noodle soup",
		},
		{
			name: "Mì xương/giò heo",
			price: 35000,
			items: [{ name: "Cá" }, { name: "Cơm" }],
			replaceName: "Pork bone/hock  vietnamese noodle soup",
		},
		{
			name: "Mì hoành thánh",
			price: 35000,
			items: [{ name: "Cá" }, { name: "Cơm" }],
			replaceName: "Wonton vietnamese noodle soup",
			tag: "Signature",
			vnTag: "Độc quyền",
			iconTag: StarIcon,
			tagStyle: "bg-red-500 text-lg sm:text-xs",
		},
		{
			name: "Mì gói/Mì bột/Mì trứng",
			price: 0,
			replaceName: "Instant/Wheat flour/Egg noodles",
		},
	],
	"Vietnamese thick noodle": [
		{
			name: "Bánh canh gà",
			price: 35000,
			items: [{ name: "Hủ tiếu" }, { name: "gà" }, { name: "rau sạch" }],
			replaceName: "Chicken vietnamese noodle soup",
		},
		{
			name: "Bánh canh hải sản",
			price: 35000,
			items: [
				{ name: "Hủ tiếu" },
				{ name: "tôm" },
				{ name: "mực" },
				{ name: "rau sạch" },
			],
			replaceName: "Seafood vietnamese noodle soup",
			tag: "Must try",
			vnTag: "Nên thử",
			iconTag: LikeIcon,
			tagStyle: "bg-orange-500 text-lg sm:text-xs",
		},
		{
			name: "Bánh canh lòng heo",
			price: 35000,
			items: [
				{ name: "Hủ tiếu" },
				{ name: "gan" },
				{ name: "cật" },
				{ name: "lòng" },
				{ name: "rau sạch" },
			],
			replaceName: "Pork organ vietnamese noodle soup",
		},
		{
			name: "Bánh canh thập cẩm",
			price: 35000,
			items: [{ name: "Cá" }, { name: "Cơm" }],
			replaceName: "Combination vietnamese noodle soup",
		},
		{
			name: "Bánh canh xương/giò heo",
			price: 35000,
			items: [{ name: "Cá" }, { name: "Cơm" }],
			replaceName: "Pork bone/hock  vietnamese noodle soup",
		},
		{
			name: "Bánh canh hoành thánh",
			price: 35000,
			items: [{ name: "Cá" }, { name: "Cơm" }],
			replaceName: "Wonton vietnamese noodle soup",
			tag: "Signature",
			vnTag: "Độc quyền",
			iconTag: StarIcon,
			tagStyle: "bg-red-500 text-lg sm:text-xs",
		},
	],
};

export const rating_url = "https://g.page/r/CUB3a53BCVllEBM/review";


export const BIG_FOOD_BASE = [
	{
		id: 1,
		label: "Tô hủ tiếu",
		description: "Bao gồm 1 vắt hủ tiếu, rau, giá, nước dùng, hành, tóp mỡ",
		value: "hu_tieu_base",
		selectedOption: [],
		price: 0,
		image: "🍜"
	},
	{
		id: 2,
		label: "Tô mì",
		description: "Bao gồm 1 vắt mì, rau, giá, nước dùng, hành, tóp mỡ",
		value: "mi_base",
		selectedOption: [],
		price: 0,
		image: "🍝"
	},
	{
		id: 3,
		label: "Tô bánh canh",
		description: "Bao gồm 1 vắt bánh canh, rau, giá, nước dùng, hành, tóp mỡ",
		value: "banh_canh_base",
		selectedOption: [],
		price: 0,
		image: "🥘"
	},
	{
		id: 4,
		label: "Tô mì bột",
		description: "Bao gồm 1 vắt mì bột, rau, giá, nước dùng, hành, tóp mỡ",
		value: "mi_bot_base",
		selectedOption: [],
		price: 0,
		image: "🍲"
	},
	{
		id: 5,
		label: "Tô nui",
		description: "Bao gồm 1 vắt nui, rau, giá, nước dùng, hành, tóp mỡ",
		value: "nui_base",
		selectedOption: [],
		price: 0,
		image: "🥣"
	}
]

export const PORK_MEAT_OPTION = [
	{
		id: 1,
		label: "Thịt heo",
		description: "Thịt heo cắt lát và trụng",
		value: "pork_meat",
		price: 0,
		image: "🥓"
	},
	{
		id: 2,
		label: "Lòng heo",
		description: "Có thể bao gồm gan, cật, phèo, bao tử",
		value: "pork_organs",
		selectedOption: [],
		price: 0,
		image: "🫀"
	},
	{
		id: 3,
		label: "Xương heo",
		description: "Xương heo hầm",
		value: "pork_pone",
		selectedOption: [],
		price: 0,
		image: "🦴"
	},
]

export const CHICKEN_MEAT_OPTION = [
	{
		id: 1,
		label: "Thịt gà xé",
		description: "Thịt gà đã được xé sẵn",
		value: "chicken_meat",
		price: 0,
		image: "🍗"
	},
	{
		id: 2,
		label: "Cánh gà",
		description: "1 chiếc cánh gà",
		value: "chicken_swing",
		price: 0,
		image: "🍗"
	},
	{
		id: 2,
		label: "Đùi gà",
		description: "1 chiếc đùi gà",
		value: "chicken_leg",
		price: 0,
		image: "🍖"
	},
	{
		id: 3,
		label: "Trứng cút",
		description: "1 vài quả trứng cút",
		value: "chicken_small_egg",
		price: 0,
		image: "🥚"
	}
]

export const SEAFOOD_OPTION = [
	{
		id: 1,
		label: "Tôm",
		description: "Tôm tươi được loại bỏ vỏ",
		value: "shrimp",
		price: 0,
		image: "🦐"
	},
	{
		id: 2,
		label: "Mực",
		description: "Mực tươi đã được sơ chế",
		value: "squid",
		price: 0,
		image: "🦑"
	},
]

export const VEGETABLE_OPTION = [
	{
		id: 1,
		label: "Rau & giá sống",
		description: "Rau và giá chưa được trụng qua nước xôi",
		value: "fresh_vegetable",
		price: 0,
		image: "🥬"
	},
	{
		id: 2,
		label: "Rau & giá chín",
		description: "Rau và giá đã được trụng qua nước xôi",
		value: "cooked_vegetable",
		price: 0,
		image: "🥗"
	}
]


export const QUICK_PRICE_OPTION = [
	{
		id: 1,
		label: "10.000",
		value: 10000,
		isActive: true
	},
	{
		id: 2,
		label: "15.000",
		value: 15000,
		isActive: true
	},
	{
		id: 3,
		label: "20.000",
		value: 20000,
		isActive: true
	},
	{
		id: 4,
		label: "25.000",
		value: 25000,
		isActive: true
	},
	{
		id: 5,
		label: "30.000",
		value: 30000,
		isActive: true
	},
	{
		id: 6,
		label: "35.000",
		value: 35000,
		isActive: true
	},
	{
		id: 7,
		label: "40.000",
		value: 40000,
		isActive: true
	},
	{
		id: 8,
		label: "45.000",
		value: 45000,
		isActive: true
	},
	{
		id: 9,
		label: "50.000",
		value: 50000,
		isActive: true
	}
]