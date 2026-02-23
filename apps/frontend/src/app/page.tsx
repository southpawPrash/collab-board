import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomeRedirect() {
  const token = (await cookies()).get("token");

  if (!token) {
    redirect("/auth/login");
  } else {
    redirect("/dashboard");
  }
}
