import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number, locale = "vi-VN", rate = 25000) {
	if (typeof value !== "number") return value;

	if (locale === "vi-VN") {
		return value.toLocaleString("vi-VN", {
			style: "currency",
			currency: "VND",
		});
	}

	const roundedValue = Math.round(value * 2) / 2;
	return (roundedValue / rate).toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
	});
	// return "$" + Math.round(value / rate)
}

export function calculateVh(targetVh?: number) {
	return (window.innerHeight * (targetVh || 100)) / 100;
}

export function calculateVw(targetVw?: number) {
	return (window.innerWidth * (targetVw || 100)) / 100;
}
