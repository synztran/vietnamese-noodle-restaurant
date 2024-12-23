import type { AnimationControls } from "framer-motion";
import { useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface UseMotionConfig {
	initial?: any;
	animateStart?: any;
	animateEnd?: any;
	exit?: any;
	transition?: any;
	targetRef?: any;
	threshold?: number;
}

const useMotion = (config: UseMotionConfig) => {
	const [visible, setVisible] = useState(false);
	const controls: AnimationControls = useAnimation();
	const { targetRef } = config;
	const observerRef = useRef<IntersectionObserver | null>(null);

	const motionProps = {
		initial: config.initial,
		animate: visible ? config.animateStart : config.animateEnd,
		exit: config.exit,
		transition: config.transition,
	};

	const startAnimation = (animation: any) => {
		controls.start(animation);
	};

	useEffect(() => {
		if (observerRef.current) {
			observerRef.current.disconnect();
		}

		observerRef.current = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
				}
			},
			{
				threshold: config?.threshold ?? 0.1, // Trigger when 10% of component is visible
			}
		);
		if (targetRef.current) {
			observerRef.current.observe(targetRef.current);
		}

		return () => {
			if (targetRef.current && observerRef.current) {
				observerRef.current.unobserve(targetRef.current);
			}
		};
	}, []);

	return { visible, motionProps, startAnimation };
};

export default useMotion;
