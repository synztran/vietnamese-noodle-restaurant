// Import Swiper React components
import { motion } from "framer-motion";
import {
	A11y,
	Autoplay,
	Navigation,
	Pagination,
	Scrollbar,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import { useViewport } from "@/contexts/viewportContext";
import useMotion from "@/hook/useMotion";
import { BANNER_1, BANNER_2, BANNER_3 } from "@/images";
import { useMemo, useRef } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const deplayAutoplay = 4500;
const defaultSlideToView = 1.5;

const defaultBanners = [
	{
		title: "Banner 1",
		image: BANNER_1,
	},
	{
		title: "Banner 2",
		image: BANNER_2,
	},
	{
		title: "Banner 3",
		image: BANNER_3,
	},
];

interface IProps {
	banners?: Array<{ title: string; image: string }>;
}

export default function SliderSwiper(props: IProps) {
	const viewportWidth = useViewport();
	const sliderWiperRef = useRef(null);
	const stateBanners = useMemo(
		() => props.banners || defaultBanners,
		[props.banners]
	);
	const { motionProps } = useMotion({
		initial: { opacity: 0, y: 50 },
		animateStart: { opacity: 1, y: 0 },
		animateEnd: { opacity: 0, y: 50 },
		transition: { duration: 0.8 },
		targetRef: sliderWiperRef,
	});

	return (
		<motion.section ref={sliderWiperRef} {...motionProps}>
			<Swiper
				modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
				spaceBetween={20}
				loop={true}
				grabCursor={true}
				slidesPerView={viewportWidth <= 640 ? 1 : defaultSlideToView}
				scrollbar={{ draggable: true }}
				autoplay={{ delay: deplayAutoplay }}
				className="">
				{stateBanners.map((banner, index) => (
					<SwiperSlide key={index}>
						<img
							src={banner.image}
							alt={banner.title}
							className="object-contain"
							style={{ maxHeight: 450, pointerEvents: "none" }}
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</motion.section>
	);
}
