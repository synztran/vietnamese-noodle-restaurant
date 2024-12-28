import CustomerReview from "@/components/CustomerReview";
import HeroSection from "@/components/HeroSection";
import HighlightMenus from "@/components/HighlightMenu";
import Introduction from "@/components/Intro";
import SliderSwiper from "@/components/SliderSwiper";
import { ViewportProvider } from "@/contexts/viewportContext";

const AppWrapper = () => {
	return (
		<ViewportProvider>
			<main className="flex flex-col gap-16">
				<Introduction />
				<HighlightMenus />
				<SliderSwiper />
				<HeroSection />
				<CustomerReview />
			</main>
		</ViewportProvider>
	);
};

export default AppWrapper;
