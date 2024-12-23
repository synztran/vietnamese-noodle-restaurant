import { Map, PhoneCall } from "lucide-react";

export default function Footer() {
	return (
		<footer
			className="fixed bottom-0 left-0 bg-white z-10 py-2"
			style={{ height: "min(80px, 8vh)" }}>
			<div>
				<div className="text-2xl"> © 2024 Hủ tiếu Ngọc Mai. </div>
				<div className="min-w-20 flex gap-4">
					<a href="tel:+84902728472">
						<PhoneCall className="hover:scale-125 transition-all cursor-pointer w-12 h-12 ml-auto bg-blue-400 rounded-lg p-1" />
					</a>
					<a
						href="https://maps.app.goo.gl/vtGd8iAUD4qqDYo48"
						target="_blank"
						rel="noreferrer">
						<Map className="hover:scale-125 transition-all cursor-pointer w-12 h-12 ml-auto bg-blue-400 rounded-lg" />
					</a>
				</div>
			</div>
		</footer>
	);
}
