import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hủ Tiếu Ngọc Mai — Ben Tre Since 1954",
  description:
    "Hủ Tiếu Ngọc Mai — Ben Tre Since 1954.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7e000a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" data-theme="heritage">
      <body>{children}</body>
    </html>
  );
}
