import StaffBottomNav from "@/components/StaffBottomNav";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      {children}
      <StaffBottomNav />
    </div>
  );
}
