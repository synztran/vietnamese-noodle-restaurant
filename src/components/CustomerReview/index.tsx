import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import Link from "../Link";
import { Button } from "../ui/button";

const CustomerReviews = () => {
	const customerReviews = [
		{
			name: "Thành Đạt",
			rating: 5,
			review: "Đây là món mì Việt Nam ngon nhất mà tôi từng ăn! Rất đáng để thử.",
		},
		{
			name: "Hoàng Minh",
			rating: 4.5,
			review: "Nước dùng đậm vị. Mì mềm, thịt thơm. Giá cả hợp lý. Không gian chưa đẹp lắm",
		},
		{
			name: "Thanh Tuấn",
			rating: 4.9,
			review: "Quán ăn không chỉ ngon, mà cón có mấy bé mèo xinh xắn nữa. Rất thích!",
		},
	];

	return (
		<div className="my-12 flex flex-col gap-4">
			<h2 className="text-3xl font-bold">
				Khách hàng nói gì về chúng tôi
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{customerReviews.map((review, index) => (
					<Card key={index} className="bg-[rgba(255,255,255,0.1)]">
						<CardHeader>
							<CardTitle>{review.name}</CardTitle>
							<div className="flex items-center text-yellow-500">
								{Array.from({
									length: Math.floor(review.rating),
								}).map((_, i) => (
									<StarIcon
										key={i}
										size={20}
										className="fill-[yellow]"
									/>
								))}
								{review.rating % 1 !== 0 && (
									<StarIcon
										size={20}
										className="text-yellow-500 opacity-50"
									/>
								)}
							</div>
						</CardHeader>
						<CardContent>
							<p>{review.review}</p>
						</CardContent>
					</Card>
				))}
			</div>
			<div className="w-full text-center mt-4">
				<Link
					href="https://g.page/r/CUB3a53BCVllEBM/review"
					target="_blank">
					<Button className="text-xl hover:rotate-6 transition-all delay-75">
						Đánh giá ngay cho chúng tôi nhé
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default CustomerReviews;
