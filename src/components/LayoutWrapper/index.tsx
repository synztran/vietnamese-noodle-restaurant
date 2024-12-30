import { ViewportProvider } from "@/contexts/viewportContext";
import { Navigator } from "../Navigator/navigator";

const LayoutWrapper = () => {
	return (
		<ViewportProvider>
			<Navigator />
		</ViewportProvider>
	);
};

export default LayoutWrapper;
