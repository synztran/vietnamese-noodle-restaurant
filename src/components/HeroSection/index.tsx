import { Button } from "@/components/ui/button";
import useMotion from "@/hook/useMotion";
import { motion } from "framer-motion";
import { useRef } from "react";

const HeroSection = () => {
	const ref = useRef(null);
	const { motionProps } = useMotion({
		initial: { opacity: 0, y: 100 },
		animateStart: { opacity: 1, y: 0 },
		animateEnd: { opacity: 0, y: 50 },
		transition: { ease: "circOut", duration: 1 },
		targetRef: ref,
	});

	return (
		<motion.section
			ref={ref}
			{...motionProps}
			className="relative h-[400px] bg-cover bg-center"
			style={{ backgroundImage: "url(/hero-image.jpg)" }}>
			<div className="absolute inset-0 bg-black/50"></div>
			<div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
				<h1 className="text-5xl font-bold mb-4">
					Chào mừng bạn đến quán ăn địa phương
				</h1>
				<p className="text-xl mb-8">
					Mì Việt Nam đích thực, được chế biến bằng tình yêu
				</p>
				<Button className="text-xl">Đặt bàn ngay</Button>
			</div>
		</motion.section>
	);
};

export default HeroSection;
