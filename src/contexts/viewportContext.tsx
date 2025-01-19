import React, { createContext, useContext, useEffect, useState } from "react";

const ViewportContext = createContext<{
	viewportWidth: number;
	isCalculating: boolean;
  validWidth: number;
  pathName: string;
}>({
	viewportWidth: 0,
	isCalculating: true,
  validWidth: 0,
  pathName: "",
});

interface IProps {
	children: React.ReactNode;
  pathName?: string
}

export const ViewportProvider = ({ children, pathName = '' }: IProps) => {
	const [viewportWidth, setViewportWidth] = useState<number>(0);
	const [isCalculating, setCalculating] = useState<boolean>(true);
  const [validWidth, setValidWidth] = useState(0)

	useEffect(() => {
		const handleResize = () => {
		  setCalculating(true);
			setViewportWidth(window.innerWidth);
      setValidWidth(window.innerWidth * 0.9)
		  setCalculating(false);
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
		<ViewportContext.Provider value={{ viewportWidth, isCalculating, validWidth, pathName }}>
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
