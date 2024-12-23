import useMotion from "@/hook/useMotion";
import { NOODLE_ICON } from "@/images";
import { motion } from "framer-motion";
import { useRef } from "react";
import Link from "../Link";
import { Button } from "../ui/button";

const temp = {
	upper: [
		{
			image: NOODLE_ICON,
			label: "Hủ tiếu",
			langLabel: "Vietnamese rice noodle",
		},
		{
			image: NOODLE_ICON,
			label: "Mì",
			langLabel: "Vietnamse noodle",
		},
		{
			image: NOODLE_ICON,
			label: "Bánh canh",
			langLabel: "Vietnamese rice thin noodle",
		},
		{
			image: NOODLE_ICON,
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
				<h1 className="text-6xl font-bold mb-4 bg-gradient-to-b from-gradient-start via-gradient-middle to-gradient-end bg-clip-text text-transparent">
					Món ăn đặc trưng
				</h1>
				<span className="text-xl">
					Những món ăn ưa chuộng bởi người việt
				</span>
			</div>
			<div className="flex gap-8">
				{temp.upper.map((item, index) => (
					<motion.section
						ref={highLightMenuRef}
						key={index}
						className="bg-[rgba(255,255,255,0.1)] !rounded-tr-[50px] !rounded-tl-[50px] px-2 pt-2 pb-8 min-h-[300px] flex flex-col justify-between"
						{...motionProps}>
						<img
							src={item.image}
							alt={item.label}
							width={180}
							height={60}
						/>
						<div>
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
					Show more
				</Button>
			</Link>
		</div>
	);
}
