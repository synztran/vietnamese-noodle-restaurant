import React, { createContext, useContext, useEffect, useState } from "react";

const ViewportContext = createContext<number | undefined>(undefined);

interface IProps {
	children: React.ReactNode;
}

export const ViewportProvider = ({ children }: IProps) => {
	const [viewportWidth, setViewportWidth] = useState<number>(0);

	useEffect(() => {
		const handleResize = () => {
			setViewportWidth(window.innerWidth);
		};

		// Set initial viewport width
		handleResize();

		window.addEventListener("resize", handleResize);

		// Cleanup event listener on component unmount
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<ViewportContext.Provider value={viewportWidth}>
			{children}
		</ViewportContext.Provider>
	);
};

export const useViewport = () => {
	const context = useContext(ViewportContext);
	if (context === undefined) {
		throw new Error("useViewport must be used within a ViewportProvider");
	}
	return context;
};
