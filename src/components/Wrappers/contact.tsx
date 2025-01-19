
import { ViewportProvider } from "@/contexts/viewportContext";
import type { IOpen, ITag } from "../Contact";
import ContactComp from "../Contact";

interface IProps {
  opens: IOpen[]
  tags: ITag[]
}

const ContactWrapper = (props: IProps) => {
	return (
		<ViewportProvider>
			<main className="flex justify-center xs:mt-[1rem] xs:mb-[min(80px, 8vh)]">
				<ContactComp  {...props} />
			</main>
		</ViewportProvider>
	);
};

export default ContactWrapper;
