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
	" Vietnamese thick noodle": [
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
