import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  async function sendResetEmail(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://www.pediatricbluebook.com/reset-password",
    });
    if (error) {
      console.error("reset email error", error);
      return { ok: false, error };
    }
    return { ok: true };
  }

  const [showNotification, setShowNotification] = useState(false);

  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <div className="flex flex-col justify-center min-h-screen bg-gradient-to-br items-center from-primary-50 to-primary-400">
        <div
          className={`${
            showNotification ? "fixed" : "hidden"
          } top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:w-[50dvw] xl:w-[25dvw] bg-primary p-4 rounded text-md md:text-lg lg:text-xl z-50 gap-y-6 `}
        >
          <button onClick={() => setShowNotification(false)}>
            <X className="text-white"></X>
          </button>
          <div className="p-8">
            <h1 className="text-white font-bold md:text-xl lg:text-2xl 2xl:text-4xl pb-4">
              See you soon!
            </h1>
            <p className="text-white">
              If you have an account, a reset link will be sent to your email.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center bg-background text-text w-fit h-fit shadow-2xl p-8">
          <p className="text-center text-5xl font-bold">
            Forgot Your Password?
          </p>
          <form className="flex flex-col gap-y-6 pt-6 max-w-full w-[500px] justify-center">
            <label htmlFor="email" className="text-lg">
              Enter your email address below and we will send you a link to
              reset your password.
            </label>
            <input
              type="email"
              autoComplete="email"
              id="email"
              name="email"
              placeholder="Email"
              className="border-b-2 rounded-md focus:outline-none"
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            />
            <button
              type="submit"
              className="bg-primary-600 text-background p-2 hover:bg-primary-700"
              onClick={async (e) => {
                if (emailValid) {
                  e.preventDefault();
                  await sendResetEmail(email);
                  setShowNotification(true);
                } else {
                  alert("Please enter a valid email address.");
                }
              }}
            >
              Request Reset Link
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
    </>
  );
};
export default Forgot;
