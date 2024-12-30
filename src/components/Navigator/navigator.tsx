"use client";

import * as React from "react";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useViewport } from "@/contexts/viewportContext";
import { HEADER_NOODLE_ICON_REMOVE_BG, NOODLE_ICON } from "@/images";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import Link from "../Link";
import { MobileNavigator } from "./Mobile";
import "./style.css";

const menu: { title: string; href: string; description: string }[] = [
	{
		title: "Alert Dialog",
		href: "/docs/primitives/alert-dialog",
		description:
			"A modal dialog that interrupts the user with important content and expects a response.",
	},
	{
		title: "Hover Card",
		href: "/docs/primitives/hover-card",
		description:
			"For sighted users to preview content available behind a link.",
	},
	{
		title: "Progress",
		href: "/docs/primitives/progress",
		description:
			"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
	},
	{
		title: "Scroll-area",
		href: "/docs/primitives/scroll-area",
		description: "Visually or semantically separates content.",
	},
	{
		title: "Tabs",
		href: "/docs/primitives/tabs",
		description:
			"A set of layered sections of content—known as tab panels—that are displayed one at a time.",
	},
	{
		title: "Tooltip",
		href: "/docs/primitives/tooltip",
		description:
			"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
	},
];

const leftComp: { title: string; href: string; description: string }[] = [
	{
		title: "Alert Dialog",
		href: "/docs/primitives/alert-dialog",
		description:
			"A modal dialog that interrupts the user with important content and expects a response.",
	},
	{
		title: "Hover Card",
		href: "/docs/primitives/hover-card",
		description:
			"For sighted users to preview content available behind a link.",
	},
	{
		title: "Progress",
		href: "/docs/primitives/progress",
		description:
			"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
	},
	{
		title: "Scroll-area",
		href: "/docs/primitives/scroll-area",
		description: "Visually or semantically separates content.",
	},
	{
		title: "Tabs",
		href: "/docs/primitives/tabs",
		description:
			"A set of layered sections of content—known as tab panels—that are displayed one at a time.",
	},
	{
		title: "Tooltip",
		href: "/docs/primitives/tooltip",
		description:
			"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
	},
];

const rightComp: { title: string; href: string; description: string }[] = [];

const title = "Hủ tiếu ngọc mai";

export function Navigator() {
	const viewportWidth = useViewport();
	console.log(viewportWidth);
	const [isSticky, setSticky] = React.useState(false);
	const sentinelRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const handleScroll = () => {
			setSticky(window.scrollY > 80);
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	if (viewportWidth <= 640) {
		return <MobileNavigator />;
	}

	return (
		<div
			className={clsx(
				"flex items-center gap-[5rem] justify-center mx-auto transition-all",
				isSticky
					? "fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] z-[1000] w-full"
					: ""
			)}
			style={{ minHeight: "10vh" }}>
			<LeftNavigator />
			<div>
				<Link href="/">
					<img
						src={HEADER_NOODLE_ICON_REMOVE_BG}
						alt="header icon"
						width={120}
						height={80}
					/>
				</Link>
			</div>
			<RightNavigator />
		</div>
	);
}

const LeftNavigator = () => {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem
					style={{ minWidth: 130, textAlign: "center" }}>
					<Link href="/menus">
						<NavigationMenuLink
							className={navigationMenuTriggerStyle()}>
							Thực đơn (Menu)
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
				<NavigationMenuItem
					style={{ minWidth: 130, textAlign: "center" }}>
					<NavigationMenuTrigger>Menu</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
							<li className="row-span-3">
								<NavigationMenuLink asChild>
									<a
										className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
										href="/">
										<img
											src={NOODLE_ICON}
											width={60}
											height={60}
											alt="icon"
										/>
										<div className="mb-2 mt-4 text-lg font-medium">
											shadcn/ui
										</div>
										<p className="text-sm leading-tight text-muted-foreground">
											Beautifully designed components that
											you can copy and paste into your
											apps. Accessible. Customizable. Open
											Source.
										</p>
									</a>
								</NavigationMenuLink>
							</li>
							<ListItem
								href="/docs"
								title="Introduction"
								className="hover:bg-gray-100">
								Re-usable components built using Radix UI and
								Tailwind CSS.
							</ListItem>
							<ListItem
								href="/docs/installation"
								title="Installation"
								className="hover:bg-gray-100">
								How to install dependencies and structure your
								app.
							</ListItem>
							<ListItem
								href="/docs/primitives/typography"
								title="Typography"
								className="hover:bg-gray-100">
								Styles for headings, paragraphs, lists...etc
							</ListItem>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem
					style={{ minWidth: 130, textAlign: "center" }}>
					<NavigationMenuTrigger>Components</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
							{leftComp.map((component) => (
								<ListItem
									key={component.title}
									title={component.title}
									href={component.href}>
									{component.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
};

const RightNavigator = () => {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem
					style={{ minWidth: 130, textAlign: "center" }}>
					<Link href="/about-us">
						<NavigationMenuLink
							className={navigationMenuTriggerStyle()}>
							Về chúng tôi
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
				<NavigationMenuItem
					style={{
						minWidth: 150,
						textAlign: "center",
					}}>
					<Link href="/contact">
						<NavigationMenuLink
							className={navigationMenuTriggerStyle()}>
							Liên hệ
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
				<NavigationMenuItem
					style={{ minWidth: 130, textAlign: "center" }}>
					{/* <Link href="/rating"> */}
					<NavigationMenuLink
						className={navigationMenuTriggerStyle()}>
						Góp ý
					</NavigationMenuLink>
					{/* </Link> */}
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
};

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className
					)}
					{...props}>
					<div className="text-sm font-medium leading-none">
						{title}
					</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});

ListItem.displayName = "ListItem";
