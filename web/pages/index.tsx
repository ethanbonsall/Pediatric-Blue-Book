/* eslint-disable @next/next/no-img-element */
import NavBar from "@/components/navbar";
import PBB from "../public/transparent-logo.png";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";

const Index = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSignedIn(!!session);
      setLoading(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSignedIn(!!session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center ">
        Loading...
      </div>
    );
  }

  const handleSubmit = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      setSignedIn(true);
    }
  };

  return (
    <div>
      {signedIn ? (
        <div className="bg-background flex flex-col items-center w-full font-roboto min-h-screen">
          <NavBar />
        </div>
      ) : (
        <div className="bg-gradient-to-tr from-primary to-background flex flex-col items-center justify-center w-full font-roboto min-h-screen">
          <div className="flex flex-col text-center items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center mb-[5dvh]">
              <img
                className="text-5xl md:text-6xl xl:text-[80px] w-[80dvw] lg:w-[25dvw] font-semibold text-white"
                alt="Pediatric Blue Book"
                src={PBB.src}
              />
            </div>
            <div className="flex flex-col w-fit h-fit bg-gradient-to-bl from-primary to-primary-600 justify-center text-white text-left items-center gap-6 p-8 rounded mb-[5dvh] shadow-2xl mx-1">
              <div className="flex flex-col w-full gap-2">
                <p className="text-4xl md:text-5xl font-bold text-white">
                  Login
                </p>
                <p className="text-md md:text-xl">
                  Enter your email and password below to login to your account.
                </p>
              </div>
              <div className="flex flex-col text-left w-full">
                <p className="text-2xl mb-2 text-white">Email</p>
                <input
                  className="rounded px-4 py-2 bg-white text-black w-full"
                  autoComplete="email"
                  name="email"
                  onInput={(e) =>
                    setEmail((e.target as HTMLInputElement).value)
                  }
                />
              </div>
              <div className="flex flex-col text-left w-full">
                <div className="flex flex-row justify-between items-center">
                  <p className="text-2xl mb-2 font-medium text-white">
                    Password
                  </p>
                  <Link
                    className="text-md md:text-xl mb-1 md:mb-2 hover:underline"
                    href="/forgot-password"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <input
                  className="rounded px-4 py-2 bg-white text-black w-full"
                  autoComplete="password"
                  name="password"
                  type="password"
                  onInput={(e) =>
                    setPassword((e.target as HTMLInputElement).value)
                  }
                />
              </div>
              <div className="flex flex-row w-full gap-x-4">
                <Link
                  className="bg-secondary text-white px-4 py-3 rounded w-full uppercase font-bold text-center"
                  href="/signup"
                >
                  Sign Up
                </Link>
                <button
                  className="bg-secondary hover:bg-secondary-900 text-white px-4 py-2 rounded w-full transition-all duration-300"
                  onClick={async () => {
                    await handleSubmit();
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      )}
    </div>
  );
};

export default Index;
