import { MENU_CATEGORY } from "@/constants";
import { calculateVh, calculateVw, formatCurrency } from "@/lib/utils";
import clsx from "clsx";
import { MoveLeft, MoveRight } from "lucide-react";
import React, { useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import "./styles.css";

interface PageProps {
	children: React.ReactNode;
	number: string;
	text?: string;
	leftText?: string;
	rightText?: string;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>((props, ref) => {
	return (
		<div className="page !grid grid-rows-12 grid-flow-col" ref={ref}>
			<div className="grid row-span-2">
				<div>
					<p
						className="text-center text-2xl font-bold"
						style={{ color: "#000" }}>
						{props.text}
					</p>
				</div>
			</div>
			<div className="grid row-span-8">{props.children}</div>
			<div className="grid row-span-2">
				<div className="grid grid-row-3 grid-flow-col">
					<div className="grid row-span-1">
						<p className="text-black text-3xl font-bold">
							Trang&nbsp;{props.number}
						</p>
					</div>
					<div className="grid row-span-1" />
					<div className="grid row-span-1" />
				</div>
			</div>
		</div>
	);
});

export default function MenuComp() {
	const menuRef = useRef(null);
	const [flipBookHeight, setFlipBookHeight] = React.useState(1180);
	const [flipBookWidth, setFlipBookWidth] = React.useState(700);

	const handleResize = () => {
		let vh = Math.round(calculateVh(70));
		let vw = Math.round(calculateVw(30));
		console.log("v", vw, vh);
		const compareVhWithPx = Math.min(flipBookHeight, vh);
		const compareVwWithPx = Math.min(flipBookWidth, vw);
		setFlipBookHeight(compareVhWithPx);
		setFlipBookWidth(compareVwWithPx);
	};

	useEffect(() => {
		handleResize();
		// calculate height of flipbook
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [flipBookHeight, flipBookWidth]);

	console.log("flipBookHeight", flipBookHeight);
	console.log("flipBookWidth", flipBookWidth);

	return (
		<div className="menuContainer">
			<div className="menuWrapper">
				<PrevArrow menuRef={menuRef} />
				<HTMLFlipBook
					ref={menuRef}
					width={flipBookWidth}
					height={flipBookHeight}
					minWidth={400}
					maxWidth={650}
					minHeight={750}
					maxHeight={1280}
					showCover={false}
					flippingTime={800}
					// style={{ margin: "0 auto" }}
					maxShadowOpacity={0.5}
					drawShadow={false}
					mobileScrollSupport={true}
					showPageCorners={false}
					useMouseEvents={false}
					className="menuMain"
					style={{ margin: "0" }}
					startPage={0}
					size={"stretch"}
					usePortrait={true}
					startZIndex={0}
					autoSize={true}
					clickEventForward={false}
					swipeDistance={0}
					disableFlipByClick={false}>
					<Page number="1" text="Hủ tiếu - Vietnamese rice noodle">
						{MENU_CATEGORY["Hủ tiếu"].map((item, index) => (
							<Menu key={index} item={item} />
						))}
					</Page>
					<Page number="2" text="Mì - Vietnamese noodle">
						{MENU_CATEGORY["Mì"].map((item, index) => (
							<Menu key={index} item={item} />
						))}
					</Page>
					<Page number="3" text="Bánh canh - Vietnamese thick noodle">
						{MENU_CATEGORY["Bánh canh"].map((item, index) => (
							<Menu key={index} item={item} />
						))}
					</Page>
					<Page number="4">
						<hr></hr>
					</Page>
				</HTMLFlipBook>
				<NextArrow menuRef={menuRef} />
			</div>
		</div>
	);
}

const Pagination = ({ bookRef }: { bookRef: any }) => {
	const handleNext = () => {
		bookRef.current.pageFlip().flipNext();
	};

	const handlePrev = () => {
		bookRef.current.pageFlip().flipPrev();
	};

	return (
		<div className="flex justify-between items-center w-40 mx-auto">
			<button
				onClick={handlePrev}
				className="disabled:opacity-80 cursor-pointer">
				<MoveLeft width={30} height={30} />
			</button>
			<button
				onClick={handleNext}
				className="disabled:opacity-80 cursor-pointer">
				<MoveRight width={30} height={30} />
			</button>
		</div>
	);
};

const NextArrow = ({ menuRef }: { menuRef: any }) => {
	const handleNext = () => {
		menuRef.current.pageFlip().flipNext();
	};

	return (
		<div className="flex justify-start items-center w-40 mr-auto hover:bg-slate-200 hover:rounded-md max-w-max p-0.5">
			<button
				onClick={handleNext}
				className="disabled:opacity-80 cursor-pointer">
				<MoveRight width={30} height={30} />
			</button>
		</div>
	);
};

const PrevArrow = ({ menuRef }: { menuRef: any }) => {
	const handleClick = () => {
		menuRef.current.pageFlip().flipPrev();
	};

	return (
		<div className="flex justify-end items-center w-40 ml-auto hover:bg-slate-200 hover:rounded-md max-w-max p-0.5">
			<button
				onClick={handleClick}
				className="disabled:opacity-80 cursor-pointer">
				<MoveLeft width={30} height={30} />
			</button>
		</div>
	);
};

const Menu = ({
	item,
}: {
	item: {
		name: string;
		price: number;
		items?: { name: string }[];
		replaceName: string;
		tag?: string;
		tagStyle?: string;
	};
}) => {
	return (
		<div className="flex justify-between px-4">
			<div className="flex flex-col">
				<div className="text-left text-xl font-bold flex items-center">
					{item.name}
					&nbsp;
					{item.tag ? (
						<span
							className={clsx(
								"text-sm rounded-sm bg-red-500 text-white p-1 rotate-6",
								item.tagStyle
							)}>
							{item.tag}
						</span>
					) : null}
				</div>
				<div className="flex text-lg justify-start text-left">
					{item.replaceName}
					{/* {item.items.map((subItem, index) => (
            <div key={index}>
              {subItem.name}
              {index < item.items.length - 1 && <span>,&nbsp;</span>}
            </div>
          ))} */}
				</div>
			</div>
			<div className="flex gap-1">
				{item.price > 0 ? (
					<div>
						<span
							className="text-lg rounded-md max-h-max p-0.5 text-white font-bold"
							style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
							{formatCurrency(item.price)}
						</span>
						<span className="text-lg p-0.5">/</span>
						<span
							className="text-lg rounded-md max-h-max p-0.5 text-white font-bold"
							style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
							{formatCurrency(item.price, "en-US")}
						</span>
					</div>
				) : null}
			</div>
		</div>
	);
};
