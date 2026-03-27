import { redirect } from "next/navigation";

// /staff → redirect to orders
export default function StaffRootPage() {
  redirect("/staff/orders");
}
