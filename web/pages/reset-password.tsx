import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";
import Head from "next/head";
import router from "next/router";
import { useState } from "react";

const Reset = () => {
  const [Password, setPassword] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  async function updatePassword() {
    const { error } = await supabase.auth.updateUser({ password: Password });
    if (error) {
      alert(error.message);
    } else {
      setPassword("");
      setShowNotification(true);
    }
  }
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
      return;
    }
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <div className="flex flex-col justify-center min-h-screen bg-gradient-to-br items-center from-primary-50 to-primary-400">
        <div
          className={`${
            showNotification ? "fixed" : "hidden"
          } top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:w-[50dvw] xl:w-[25dvw] bg-primary p-4 rounded text-md md:text-lg lg:text-xl z-50 gap-y-6`}
        >
          <button onClick={() => setShowNotification(false)}>
            <X />
          </button>
          <p>Password Reset Succesfully</p>
        </div>
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
            <button
              type="button"
              className="text-lg self-center text-black font-semibold hover:text-gray-800"
              onClick={handleSignOut}
            >
              Back To Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
export default Reset;
