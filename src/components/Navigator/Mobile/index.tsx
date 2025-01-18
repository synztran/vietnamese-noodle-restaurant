"use client";
import Link from "@/components/Link";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { HEADER_NOODLE_ICON_REMOVE_BG } from "@/images";
import { Menu, X } from "lucide-react";
import * as React from "react";

const menuItems = [
	{
		label: "Trang chủ",
		href: "/",
	},
	{
		label: "Menu",
		href: "/menus",
	},
	{
		label: "Về chúng tôi",
		href: "/about",
	},
	{
		label: "Liên hệ",
		href: "/contact",
	},
];

export function MobileNavigator() {
	const [goal, setGoal] = React.useState(350);
	const [isOpen, toggleOpen] = React.useState(false);

	function onClick(adjustment: number) {
		setGoal(Math.max(200, Math.min(400, goal + adjustment)));
	}

	function handleToggleDrawer() {
		toggleOpen(!isOpen);
	}

	return (
		<Drawer onClose={handleToggleDrawer}>
			<div className="flex justify-between items-center">
				<Link href="/">
					<img
						src={HEADER_NOODLE_ICON_REMOVE_BG}
						alt="header icon"
						width={120}
						height={80}
					/>
				</Link>
				<DrawerTrigger asChild>
					<Button
						className="!bg-transparent p-4"
						variant="outline"
						onClick={handleToggleDrawer}>
						{isOpen ? (
							<X className="!w-10 !h-10" />
						) : (
							<Menu className="!w-10 !h-10" />
						)}
					</Button>
				</DrawerTrigger>
			</div>

			<DrawerContent>
				<div className="mx-auto w-full max-w-md">
					<DrawerHeader>
						{/* <DrawerTitle>Move Goal</DrawerTitle>
						<DrawerDescription>
							Set your daily activity goal.
						</DrawerDescription> */}
					</DrawerHeader>
					<div className="flex flex-col gap-4">
						{menuItems?.map((item) => (
							<Link key={item.href} href={item.href}>
								<span className="text-xl py-2 cursor-pointer">{item.label}</span>
							</Link>
						))}
						{/* <div className="flex items-center justify-center space-x-2">
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 shrink-0 rounded-full"
								onClick={() => onClick(-10)}
								disabled={goal <= 200}>
								<Minus />
								<span className="sr-only">Decrease</span>
							</Button>
							<div className="flex-1 text-center">
								<div className="text-7xl font-bold tracking-tighter">
									{goal}
								</div>
								<div className="text-[0.70rem] uppercase text-muted-foreground">
									Calories/day
								</div>
							</div>
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 shrink-0 rounded-full"
								onClick={() => onClick(10)}
								disabled={goal >= 400}>
								<Plus />
								<span className="sr-only">Increase</span>
							</Button>
						</div> */}
						{/* <div className="mt-3 h-[120px]"></div> */}
					</div>
					<DrawerFooter className="px-0">
						{/* <Button>Submit</Button> */}
						<DrawerClose asChild>
							<Button
								className="text-xl"
								variant="default"
								onClick={handleToggleDrawer}>
								Đóng
							</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
