import clsx from "clsx";

interface IProps {
	title: string;
	text: string;
	titleClassName?: string;
	textClassName?: string;
}

export default function TitleWithText({
	title,
	text,
	textClassName,
	titleClassName,
}: IProps) {
	return (
		<div className="my-1">
			<span className={clsx(titleClassName)}>{title}:</span>
			<br />
			<span className={clsx(textClassName, "font-bold text-xl")}>
				{text}
			</span>
		</div>
	);
}
