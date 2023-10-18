import { User2 } from "lucide-react";
import LoginForm from "./_components/login-form";
import { getPageSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getPageSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
      <div className="flex min-h-[200px] w-full max-w-md flex-col items-center justify-center space-y-6 border-[1px] bg-white px-16 py-20">
        <div className="rounded-full bg-gray-100 p-4">
          <User2 />
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="text-3xl font-semibold">Login</p>
          <p className="text-xl">Login to your account</p>
        </div>

        <div className="w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
