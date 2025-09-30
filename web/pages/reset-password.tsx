import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useState } from "react";

const Forgot = () => {
  const [Password, setPassword] = useState("");

  async function updatePassword() {
    const { error } = await supabase.auth.updateUser({ password: Password });
    if (error) {
      alert(error.message);
    }
  }

  return (
    <div className="flex flex-col justify-center min-h-screen bg-gradient-to-br items-center from-primary-50 to-primary-400">
      <div className="flex flex-col justify-center bg-background text-text w-fit h-fit shadow-2xl p-8">
        <p className="text-center text-5xl font-bold">Password Reset?</p>
        <form className="flex flex-col gap-y-6 pt-6 w-[500px] justify-center">
          <label htmlFor="email" className="text-lg">
            Enter your new password below to reset your password.
          </label>
          <input
            type="password"
            autoComplete="password"
            id="password"
            name="password"
            placeholder="New Password"
            className="border-b-2 rounded-md focus:outline-none"
            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
          />
          <button
            type="submit"
            className="bg-primary-600 text-background p-2 hover:bg-primary-700"
            onClick={async (e) => {
              e.preventDefault();
              await updatePassword();
            }}
          >
            Set New Password
          </button>
          <Link
            href="/"
            className="text-lg self-center text-black font-semibold hover:text-gray-800"
          >
            Back To Login
          </Link>
        </form>
      </div>
    </div>
  );
};
export default Forgot;
