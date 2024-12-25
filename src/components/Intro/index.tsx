import { INTRO_IMAGE } from "@/images";
import Link from "../Link";
import { Button } from "../ui/button";

export default function Introduction() {
	console.log("1");
	return (
		<div className="grid grid-cols-2">
			<div className="col-span-1 xs:col-span-2 flex flex-col gap-4">
				<div className="rounded-[45px] bg-orange-500 px-6 py-2 text-white min-w-[100px] max-w-max">
					Quán ăn địa phương của người Việt
				</div>
				<h2 className="text-[36px] text-white font-bold max-w-[80%] xs:max-w-[100%]">
					Vietnamese Noodle <br /> Local's Restaurant
				</h2>
				<div
					className="text-white max-w-[80%] xs:max-w-[100%]"
					style={{ letterSpacing: "0.5px" }}>
					Quán ăn địa phương chiêu đãi hương vị của xứ Bến Tre với món
					mì truyền thống đậm vị và nước lèo thơm ngon.
				</div>
				<div className="flex gap-4">
					<Link href="/contact">
						<Button className="min-h-[35px] px-12 py-2 rounded-[50px] text-white text-center text-md bg-orange-500">
							Đặt bàn ngay
						</Button>
					</Link>
					<Link href="/menus">
						<Button className="min-h-[35px] px-12 py-2 rounded-[50px] text-white text-center text-md bg-green-500">
							Tham khảo thực đơn
						</Button>
					</Link>
				</div>
			</div>
			<div className="col-span-1 xs:col-span-2 flex justify-center items-center relative max-h-max select-none">
				<img
					src={INTRO_IMAGE}
					className="h-[450px] select-none"
					alt="intro image"
				/>
			</div>
		</div>
	);
}
