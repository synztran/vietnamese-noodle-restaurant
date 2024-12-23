import { classNames } from "@/lib/utils";

interface IProps {
	text: string;
	textColor?: string;
	backgroundColor?: string;
}

export default function Tag({ text, textColor, backgroundColor }: IProps) {
	const generateTextColor = () => {
		return (
			`#` +
			Math.floor(Math.random() * 16777215)
				.toString(16)
				.padStart(6, "0")
		);
	};
	const generateBackgroundColor = () => {
		return (
			`#` +
			Math.floor(Math.random() * 16777215)
				.toString(16)
				.padStart(6, "0")
		);
	};
	return (
		<div
			className={classNames(
				"p-2 max-w-max rounded-md text-center flex items-center justify-center"
			)}
			style={{
				backgroundColor: backgroundColor ?? generateBackgroundColor(),
			}}>
			<span
				style={{
					margin: "auto 0",
					color: textColor ?? generateTextColor(),
				}}>
				{text}
			</span>
		</div>
	);
}
