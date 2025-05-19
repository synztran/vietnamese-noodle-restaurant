import CustomerReview from "@/components/CustomerReview";
import HeroSection from "@/components/HeroSection";
import HighlightMenus from "@/components/HighlightMenu";
import Introduction from "@/components/Intro";
import SliderSwiper from "@/components/SliderSwiper";
import { ViewportProvider } from "@/contexts/viewportContext";
import ImageBlock from "../ImageBlock";

const AppWrapper = () => {
	return (
		<ViewportProvider>
			<main className="flex flex-col gap-16 mx-auto">
				<Introduction />
				<HighlightMenus />
				<SliderSwiper />
				{/* <HeroSection /> */}
        <ImageBlock />
				<CustomerReview />
			</main>
		</ViewportProvider>
	);
};

export default AppWrapper;
