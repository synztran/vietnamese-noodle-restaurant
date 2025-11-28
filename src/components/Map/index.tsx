import { useViewport } from "@/contexts/viewportContext";
import { Skeleton } from "../ui/skeleton";

export default function GGMap() {
  const { viewportWidth, isCalculating, validWidth } = useViewport();
  if (isCalculating) {
    return (
      <Skeleton className="h-[120px] w-full bg-[rgba(0,0,0,0.4)] rounded-none" />
    );
  }

  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d251267.1646715411!2d106.05917229453128!3d10.2575958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310aa99b5b85ee29%3A0x655909c19d6b7740!2zSOG7pyBUaeG6v3UgTmfhu41jIE1haQ!5e0!3m2!1sen!2s!4v1732416573431!5m2!1sen!2s"
      width={viewportWidth <= 640 ? validWidth : 600}
      height="450"
      style={{ border: 0, marginLeft: "auto" }}
      loading="lazy"
    />
  );
}
