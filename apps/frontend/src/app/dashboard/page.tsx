import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "../../components/LogoutButton";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/auth/login");
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p>You are authenticated.</p>
      <LogoutButton />
    </div>
  );
}
