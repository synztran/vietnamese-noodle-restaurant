import useMotion from "@/hook/useMotion";
import { HIGH_LIGHT_BANH_CANH, HIGH_LIGHT_HU_TIEU, HIGH_LIGHT_MI_BOT, HIGH_LIGHT_SUI_CAO_NHIEU, NOODLE_ICON } from "@/images";
import { motion } from "framer-motion";
import { useRef } from "react";
import Link from "../Link";
import { Button } from "../ui/button";

const temp = {
	upper: [
		{
			image: HIGH_LIGHT_HU_TIEU,
			label: "Hủ tiếu",
			langLabel: "Vietnamese rice noodle",
		},
		{
			image: HIGH_LIGHT_MI_BOT,
			label: "Mì bột",
			langLabel: "Vietnamse noodle",
		},
		{
			image: HIGH_LIGHT_BANH_CANH,
			label: "Bánh canh",
			langLabel: "Vietnamese rice thin noodle",
		},
		{
			image: HIGH_LIGHT_SUI_CAO_NHIEU,
			label: "Hoành thánh",
			langLabel: "Wonton",
		},
	],
	under: [
		{
			image: NOODLE_ICON,
			label: "Nui",
			langLabel: "",
		},
		{
			image: NOODLE_ICON,
			label: "Hoành thánh",
			langLabel: "",
		},
		{
			image: NOODLE_ICON,
			label: "Lòng heo",
			langLabel: "",
		},
	],
};

export default function HighlightMenus() {
	const highLightMenuRef = useRef(null);
	const { motionProps } = useMotion({
		initial: { opacity: 1, y: 0 },
		animateStart: {
			opacity: 1,
			scale: [1, 0.9, 1.125, 1, 1],
			rotate: [0, -15, 15, -15, 0],
			borderRadius: ["0%", "0%", "5%", "5%", "0%"],
		},
		animateEnd: {
			opacity: 0,
		},
		transition: {
			ease: "easeInOut",
			duration: 1.5,
		},
		targetRef: highLightMenuRef,
		threshold: 0.5,
	});
	return (
		<div className="flex flex-col items-center justify-center h-full text-white text-center gap-8">
			<div>
				<h1 className="text-6xl xs:text-5xl font-bold mb-4 bg-gradient-to-b from-gradient-start via-gradient-middle to-gradient-end bg-clip-text text-transparent">
					Món ăn đặc trưng
				</h1>
				<span className="text-lg">
					Những món ăn ưa chuộng bởi người việt
				</span>
			</div>
			<div className="grid grid-cols-4 sm:grid-cols-2 gap-8">
				{temp.upper.map((item, index) => (
					<motion.section
						ref={highLightMenuRef}
						key={index}
						className="col-span-1 bg-[rgba(255,255,255,0.1)] !rounded-tr-[50px] !rounded-tl-[50px] !rounded-br-[5px] !rounded-bl-[5px]   px-2 pt-2 pb-8 min-h-[300px] justify-between grid grid-rows-2 sm:grid-rows-1 w-full sm:justify-center"
						{...motionProps}>
						<img
							src={item.image}
							alt={item.label}
							width={180}
							height={60}
							className="row-span-1 sm:my-auto rounded-full"
						/>
						<div className="row-span-1">
							<span className="text-black text-2xl font-bold">
								{item.label}
							</span>
							<br />
							<span className="text-black text">
								{item.langLabel}
							</span>
						</div>
					</motion.section>
				))}
			</div>
			<Link href="/menus">
				<Button className="text-xl transition-all hover:rotate-6">
					Khá phá nhiều hơn
				</Button>
			</Link>
		</div>
	);
}
