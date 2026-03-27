import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			fontFamily: {
				headline: ["var(--font-montserrat)", "sans-serif"],
				body: ["var(--font-montserrat)", "sans-serif"],
				label: ["var(--font-montserrat)", "sans-serif"],
			},
			colors: {
				surface: "#fbf8ff",
				"on-surface": "#1a1b27",
				primary: "#7e000a",
				"on-primary": "#ffffff",
				"primary-container": "#a11d1d",
				secondary: "#855300",
				"on-secondary": "#ffffff",
				"secondary-container": "#fea61c",
				"on-secondary-container": "#684000",
				"secondary-fixed": "#ffddb8",
				"secondary-fixed-dim": "#ffb95f",
				"surface-container-lowest": "#ffffff",
				"surface-container-low": "#f4f2ff",
				"surface-container": "#edecfe",
				"surface-container-high": "#e8e6f9",
				"surface-container-highest": "#e2e1f3",
				"surface-dim": "#d9d8ea",
				"surface-variant": "#e2e1f3",
				"on-surface-variant": "#59413e",
				outline: "#8d706d",
				"outline-variant": "#e1bebb",
				error: "#ba1a1a",
				"error-container": "#ffdad6",
				"on-error": "#ffffff",
				tertiary: "#214325",
				"tertiary-container": "#385b3b",
				"on-tertiary": "#ffffff",
				"on-tertiary-container": "#a9d1a8",
				"tertiary-fixed": "#c4edc3",
				"tertiary-fixed-dim": "#a9d1a8",
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			{
				heritage: {
					primary: "#7e000a",
					"primary-content": "#ffffff",
					secondary: "#855300",
					"secondary-content": "#ffffff",
					accent: "#214325",
					neutral: "#1a1b27",
					"base-100": "#fbf8ff",
					"base-200": "#f4f2ff",
					"base-300": "#edecfe",
					info: "#0284c7",
					success: "#214325",
					warning: "#fea61c",
					error: "#ba1a1a",
				},
			},
		],
		darkTheme: "dark",
		base: true,
		styled: true,
		utils: true,
	},
};

export default config;
