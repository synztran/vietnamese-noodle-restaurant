import { ViewportProvider } from "@/contexts/viewportContext";
import SampleMenu from "../SampleMenu";

interface IProps {
	rate: number;
	page: string | number;
}

const MenuWrapper = ({ rate, page }: IProps) => {
	return (
		<ViewportProvider>
			<main className="flex justify-center">
				<SampleMenu currentPage={page as string} currencyRate={rate} />
			</main>
		</ViewportProvider>
	);
};

export default MenuWrapper;
