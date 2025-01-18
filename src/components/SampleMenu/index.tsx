import { MENU_CATEGORY } from "@/constants";
import { useViewport } from "@/contexts/viewportContext";
import { formatCurrency } from "@/lib/utils";
import clsx from "clsx";
import { MoveLeft, MoveRight } from "lucide-react";
import { forwardRef, useState } from "react";
import "./styles.css";

interface PageProps {
	children: React.ReactNode;
	number: string;
	text?: string;
	leftText?: string;
	rightText?: string;
	disabled?: boolean;
}
const totalPage = Object.entries(MENU_CATEGORY).length + 1;

export default function SampleMenu(props: {
	currentPage: string;
	currencyRate: number;
}) {
	const {viewportWidth, isCalculating} = useViewport();
	const [page, setPage] = useState(Number(props.currentPage) || 1);

	return (
		<div className="menuContainer">
			<div className="menuWrapper">
				{viewportWidth <= 640 ? null : (
					<PrevArrow page={page} setPage={setPage} />
				)}
				<div
					className="relative menuMain h-full"
					style={{ width: "min(100%, 100vw)" }}>
					{Object.entries(MENU_CATEGORY).map(
						([key, value], index) => (
							<Page
								key={index}
								number={(index + 1).toString()}
								text={key}
								disabled={page !== index + 1}>
								{value.map((item, index) => (
									<Menu
										key={index}
										item={item}
										currencyRate={props.currencyRate}
									/>
								))}
							</Page>
						)
					)}
				</div>
				{viewportWidth <= 640 ? null : (
					<NextArrow page={page} setPage={setPage} />
				)}
			</div>
      {viewportWidth <= 640 && !isCalculating ? (
        <div className="flex justify-evenly gap-8 mt-2">
          	<PrevArrow page={page} setPage={setPage} />
            <NextArrow page={page} setPage={setPage} />
        </div>
      ) : null}
		</div>
	);
}

const Page = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
	if (props.disabled) {
		return null;
	}
	return (
		<div
			className="page !grid grid-rows-12 grid-flow-col transition-all"
			ref={ref}>
			<div className="grid row-span-2">
				<p
					className="text-center text-2xl xs:text-xl font-bold w-full"
					style={{ color: "#000" }}>
					{props.text}
				</p>
			</div>
			<div className="grid row-span-8">{props.children}</div>
			<div className="grid row-span-2">
				<div className="grid grid-cols-[1fr,1fr] grid-flow-col">
					<div className="grid row-span-1">
						<p className="text-black text-3xl xs:text-xl font-bold text-center whitespace-normal">
							Trang&nbsp;{props.number} &nbsp;|&nbsp; Page&nbsp;
							{props.number}
						</p>
					</div>
					{/* <div className="grid row-span-1" /> */}
					<div className="grid row-span-1" />
				</div>
			</div>
		</div>
	);
});

const NextArrow = ({
	page = 0,
	setPage,
}: {
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
	const isDisabled = page === totalPage - 1;
	const handleNext = () => {
		setPage((prev) => prev + 1);
	};

	return (
		<div className="flex justify-start items-center w-40 mr-auto hover:bg-slate-200 hover:rounded-md max-w-max p-0.5">
			<button
				disabled={isDisabled}
				onClick={handleNext}
				className="disabled:opacity-80 cursor-pointer">
				<MoveRight width={40} height={40} />
			</button>
		</div>
	);
};

const PrevArrow = ({
	page = 0,
	setPage,
}: {
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
	const isDisabled = page === 1;
	const handleClick = () => {
		setPage((prev) => prev - 1);
	};

	return (
		<div className="flex justify-end items-center w-40 ml-auto hover:bg-slate-200 hover:rounded-md max-w-max p-0.5">
			<button
				disabled={isDisabled}
				onClick={handleClick}
				className="disabled:opacity-80 cursor-pointer">
				<MoveLeft width={40} height={40} />
			</button>
		</div>
	);
};

const Menu = ({
	item,
	currencyRate,
}: {
	item: {
		name?: string;
		price?: number;
		items?: { name: string }[];
		replaceName?: string;
		tag?: string;
		vnTag?: string;
		tagStyle?: string;
    iconTag?: () => JSX.Element;
	};
	currencyRate: number;
}) => {
	return (
		<div className="flex justify-between px-4">
			<div className="flex flex-col">
				<div className="text-left text-xl xs:text-md font-bold flex items-center">
					{item.name}
					&nbsp;
					{/* {item.tag ? (
						<span
							className={clsx(
								"text-sm rounded-sm text-white p-1 rotate-6",
								item.tagStyle
							)}>
							{item.vnTag}
						</span>
					) : null} */}
          {item.iconTag ? (
						<span
							className={clsx(
								"text-sm rounded-sm text-white p-1 rotate-6",
							)}>
							<item.iconTag />
						</span>
					) : null}
				</div>
				<div className="flex text-lg xs:text-sm justify-start text-left mt-1 xs:mt-0">
					{item.replaceName}
					{/* &nbsp;
					{item.vnTag ? (
						<span
							className={clsx(
								"text-sm rounded-sm text-white p-1 rotate-6 font-bold",
								item.tagStyle
							)}>
							{item.tag}
						</span>
					) : null} */}
					{/* {item.items.map((subItem, index) => (
            <div key={index}>
              {subItem.name}
              {index < item.items.length - 1 && <span>,&nbsp;</span>}
            </div>
          ))} */}
				</div>
			</div>
			<div className="flex gap-1">
				{item.price && item.price > 0 ? (
					<div>
						<span
							className="text-lg xs:text-sm rounded-md max-h-max p-0.5 text-white font-bold"
							style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
							{formatCurrency(item.price)}
						</span>
						<span className="text-lg xs:text-sm p-0.5">/</span>
						<span
							className="text-lg xs:text-sm rounded-md max-h-max p-0.5 text-white font-bold"
							style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
							{formatCurrency(item.price, "en-US", currencyRate)}
						</span>
					</div>
				) : null}
			</div>
		</div>
	);
};
