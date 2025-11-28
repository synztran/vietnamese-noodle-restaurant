import { Button } from "@/components/ui/button";
import { useViewport } from "@/contexts/viewportContext";
import useMotion from "@/hook/useMotion";
import { IMAGE_BLOCK_2, IMAGE_BLOCK_3, IMAGE_BLOCK_4 } from "@/images";
import { IMAGE_BLOCK_1 } from "@/images";
import { motion } from "framer-motion";
import { useRef } from "react";

const images = [
  {
    image: IMAGE_BLOCK_1,
    alt: "1"
  },
  {
    image: IMAGE_BLOCK_4,
    alt: "2"
  },
  {
    image: IMAGE_BLOCK_3,
    alt: "3"
  },
  {
    image: IMAGE_BLOCK_2,
    alt: "4"
  }
]

const ImageBlock = () => {
	const {viewportWidth, isCalculating} = useViewport();
	const ref = useRef(null);
	const { motionProps } = useMotion({
		initial: { opacity: 0, y: 100 },
		animateStart: { opacity: 1, y: 0 },
		animateEnd: { opacity: 0, y: 50 },
		transition: { ease: "circOut", duration: 1 },
		targetRef: ref,
	});

	const motionStyle = {
		backgroundImage: "url(./hero.jpeg)",
		backgroundSize: "100% 100%",
		backgroundPosition: "0px 10px",
	};

	return (
		<motion.section
			ref={ref}
			{...motionProps}
			className="relative"
			// style={viewportWidth <= 640 ? motionStyle : {}}
      >
			{viewportWidth <= 640 ? (
				<div className="flex flex-wrap py-0 px-[4px]">
          <div className="flex-[50%] py-0 px-[4px]">
            {
              images.map((image, index) => index % 2 === 0 && (
                  <img key={index} src={image.image} alt={image.alt} className="mt-[8px] align-middle rounded-md" />
              ))
            }
          </div>
          <div className="flex-[50%] py-0 px-[4px]">
            {
              images.map((image, index) => index % 2 !== 0 && (
                  <img key={index} src={image.image} alt={image.alt} className={`${image.alt === "2" ? 'mt-12' : 'mt-2'} align-middle rounded-md`} />
              ))
            }
          </div>
          <div className="mt-4">
            <span className="text-2xl text-white">Sự kì công tô <strong className="text-3xl bg-gradient-to-r from-[#fcab01] to-[#fe214f] text-transparent bg-clip-text">Hủ tiếu Ngọc Mai</strong></span>
            <div className="w-[5rem] h-[3px] bg-gradient-to-r from-[#fcab01] to-[#fe214f] rounded-md my-2" />
            <span className="text-sm text-white">
              Ở Hủ tiếu Ngọc Mai, chúng tôi tin rằng mỗi tô hủ tiếu đều là một câu chuyện về sự kì công và tình yêu. Chủ quán đã dành hết tình yêu và tâm huyết của mình để tạo nên món ăn tuyệt vời này.
              <br /> <br />
              Nước dùng xương được hầm từ khoảng 8-12 giờ để đạt được độ ngọt đặc trưng cùng với sự đậm đà của hương vị. Kết hợp với những món ăn kèm tạo nên một hương vị đặc biệt khó quên.
            </span>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className=" h-[80px] rounded-lg border border-gray-500 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-yellow-400">8+</span>
                <span className="text-sm text-gray-800 font-semibold">Giờ hầm xương</span>
              </div>
              <div className=" h-[80px] rounded-lg border border-gray-500 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-yellow-400">4+</span>
              <span className="text-sm text-gray-800 font-semibold">Loại sợi bánh ăn kèm</span>
              </div>
              <div className=" h-[80px] rounded-lg border border-gray-500 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-yellow-400">100%</span>
                <span className="text-sm text-gray-800 font-semibold">Nguyên liệu chất lượng</span>
              </div>
              <div className=" h-[80px] rounded-lg border border-gray-500 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-yellow-400">Mỗi ngày</span>
                <span className="text-sm text-gray-800 font-semibold">Món ăn được chế biến</span>
              </div>
            </div>
          </div>
				</div>
			) : (
				<div className="p-6">
					<div className="absolute inset-0 bg-black/50" />
					<div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
						<h1 className="text-5xl font-bold mb-4 text-gray-400">
							Chào mừng bạn đến quán ăn địa phương
						</h1>
						<p className="text-xl mb-8">
							Mì Việt Nam đích thực, được chế biến bằng tình yêu
						</p>
						<Button className="text-xl">Đặt bàn ngay</Button>
					</div>
				</div>
			)}
		</motion.section>
	);
};

export default ImageBlock;
