import { Button } from "@/components/ui/button";
import { useViewport } from "@/contexts/viewportContext";
import useMotion from "@/hook/useMotion";
import { motion } from "framer-motion";
import { useRef } from "react";

const HeroSection = () => {
	const viewportWidth = useViewport();
	const ref = useRef(null);
	const { motionProps } = useMotion({
		initial: { opacity: 0, y: 100 },
		animateStart: { opacity: 1, y: 0 },
		animateEnd: { opacity: 0, y: 50 },
		transition: { ease: "circOut", duration: 1 },
		targetRef: ref,
	});

	const motionStyle = {
		backgroundImage: "url(./hero.jpeg)",
		backgroundSize: "100% 100%",
		backgroundPosition: "0px 10px",
	};

	return (
		<motion.section
			ref={ref}
			{...motionProps}
			className="relative h-[400px]"
			style={viewportWidth <= 640 ? motionStyle : {}}>
			{viewportWidth <= 640 ? (
				<>
					<div className="absolute inset-0" />
					<div className="relative z-10 flex flex-col items-end justify-end h-full text-white text-center p-2">
						<Button className="text-xl">Đặt bàn ngay</Button>
					</div>
				</>
			) : (
				<>
					<div className="absolute inset-0 bg-black/50" />
					<div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
						<h1 className="text-5xl font-bold mb-4">
							Chào mừng bạn đến quán ăn địa phương
						</h1>
						<p className="text-xl mb-8">
							Mì Việt Nam đích thực, được chế biến bằng tình yêu
						</p>
						<Button className="text-xl">Đặt bàn ngay</Button>
					</div>
				</>
			)}
		</motion.section>
	);
};

export default HeroSection;
