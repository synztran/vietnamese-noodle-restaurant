import GGMap from "../Map"
import Tag from "../Tag"
import TitleWithText from "../TitleWithText"

export interface IOpen {
  [x: string]: {
    start?: string
    end?: string
  }
}

export interface ITag {
  text: string
}

interface IProps {
  opens: IOpen[]
  tags: ITag[]
}

const ContactComp = ({opens, tags}: IProps) => {
  return (
    <div className="flex flex-col items-center my-4 gap-4">
			<div className="text-4xl text-muted">Liên hệ ngay với chúng tôi</div>
			<div
				className="flex xs:flex-col gap-12 md:flex-col lg:flex-row xl:flex-row xs:max-w-[90vw]">
				<div className="w-1/2 xs:w-full">
					<GGMap />
				</div>
				<div className="flex flex-col w-1/2 xs:w-full">
					<div className="text-3xl text-muted">Thông tin chi tiết</div>
					<div
						className="w-full h-1 border-b border-solid border-gray-500">
					</div>
					<TitleWithText title="Tên quán" text="Hủ tiếu Ngọc Mai" textClassName="text-muted" />
					<TitleWithText
            textClassName="text-muted"
						title="Địa chỉ"
						text="Hẻm 56A2 Đại lộ Đồng Khởi p. Phú Tân TP. Bến Tre (Hẻm cạnh UBND Phú Tân)"
					/>
					<TitleWithText
						title="Liên hệ đặt bàn hoặc giao món"
						text=""
					/>
					<a href="tel:+84902728472">
						<span className="underline text-muted font-bold text-xl">
							+84 902 72 84 72
						</span>
					</a>
					<TitleWithText title="Tiện ích" text="" />
					<div className="flex flex-wrap gap-2">
						{
							tags.map((tag) => (
								<Tag text={tag.text} textColor="#fff" />
							))
						}
					</div>
					<TitleWithText title="Thời gian mở bán" text="" />
					{
						opens.map((open) => (
							<div className="flex flex-wrap gap-2">
								{Object.entries(open).map(([day, time]) => (
									<div>
										<span className="capitalize">{day}:</span>
										<span className="font-semibold text-xl text-muted">
											{time.start} - {time.end}
										</span>
									</div>
								))}
							</div>
						))
					}
				</div>
			</div>
		</div>
  )
}

export default ContactComp
