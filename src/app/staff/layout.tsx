import StaffBottomNav from "@/components/StaffBottomNav";
import StaffSideNav from "@/components/StaffSideNav";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <StaffSideNav />
      <div className="md:pl-52">
        {children}
      </div>
      <StaffBottomNav />
    </div>
  );
}
