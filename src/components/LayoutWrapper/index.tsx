import { ViewportProvider } from "@/contexts/viewportContext";
import { Navigator } from "../Navigator/navigator";

interface IProps {
  pathName: string;
  isEmpty?: boolean;
}

const LayoutWrapper = (props: IProps) => {
  return (
    <ViewportProvider pathName={props.pathName}>
      <Navigator
        classes={props.isEmpty ? "opacity-0 pointer-event-none" : ""}
      />
    </ViewportProvider>
  );
};

export default LayoutWrapper;
