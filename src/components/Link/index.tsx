import type { ReactNode } from "react";

type TTarget = "_blank" | "_self" | "_parent" | "_top";

interface IProps {
	href: string;
	className?: string;
	children: ReactNode;
	target?: TTarget;
}

export default function Link({ href, className, children, ...props }: IProps) {
	return (
		<a href={href} className={className} {...props} target={props.target}>
			{children}
		</a>
	);
}
