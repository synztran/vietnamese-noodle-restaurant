import { ViewportProvider } from "@/contexts/viewportContext";
import { Navigator } from "../Navigator/navigator";

interface IProps {
  pathName: string
}

const LayoutWrapper = (props: IProps) => {
	return (
		<ViewportProvider pathName={props.pathName}>
			<Navigator />
		</ViewportProvider>
	);
};

export default LayoutWrapper;
