import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { BANNER_1, BANNER_2, BANNER_3 } from "@/images";
import { useMemo } from "react";

const defaultBanners = [
	{
		title: "Banner 1",
		image: BANNER_1,
	},
	{
		title: "Banner 2",
		image: BANNER_2,
	},
	{
		title: "Banner 3",
		image: BANNER_3,
	},
	// {
	// 	title: "Banner 1",
	// 	image: BANNER_1,
	// },
];

interface IProps {
	banners?: {
		id: number;
		title: string;
		image: string;
	}[];
}

export default function CarouselComponent(props: IProps) {
	const { banners } = props;

	const bannerState = useMemo(() => {
		if (banners && banners?.length > 0) {
			return banners;
		}
		return defaultBanners;
	}, [banners]);

	console.log(bannerState);

	return (
		<Carousel
			style={{ maxWidth: 800, flex: "0 0 100%" }}
			className="mx-auto"
			opts={{
				align: "start",
				slidesToScroll: 1,
				containScroll: "trimSnaps",
			}}>
			<CarouselContent className="justify-center">
				{bannerState?.map((banner, idx) => (
					<CarouselItem key={idx} className="">
						<div className="p-1">
							<Card>
								<CardContent className="flex aspect-square items-center justify-center p-6">
									<img
										src={banner.image}
										loading="lazy"
										width={800}
										height={400}
										alt={banner.title}
									/>
								</CardContent>
							</Card>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}
