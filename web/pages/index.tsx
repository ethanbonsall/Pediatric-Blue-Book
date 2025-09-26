/* eslint-disable @next/next/no-img-element */
import NavBar from "@/components/navbar";
import { useState } from "react";
import PBB from "../public/transparent-logo.png";
import { Check, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const place_holder_email = "placeholder@gmail.com";

  const handleSubmit = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert("Login failed: " + error.message);
      return false;
    } else {
      alert("Welcome " + data.user?.email);
      return true;
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
          {signUp ? (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:w-[50dvw] lg:w-[25dvw] bg-background p-4 rounded text-xl">
              <p className="mb-4">
                This website is intended for use by healthcare professionals for
                general information purposes only. By using this website you are
                agreeing to the terms of use. This website is not a substitute
                for professional medical judgment.
              </p>
              <p className="mb-4">
                If accessed by non-healthcare professionals, the user should
                seek professional medical advice in determining what is best for
                their individual situation. No one should rely on information on
                this website as a substitute for professional medical advice,
                diagnosis, or treatment.
              </p>
              <p className="mb-4">
                The developers made every effort to provide accurate product
                information; however, it is subject to change. The label of
                product contains the most current information for the applicable
                formula. The developers do not endorse or recommend any specific
                product included in this website.
              </p>
              <p>{`To report corrections, please contact ${place_holder_email}`}</p>
              <div className="flex flex-row text-center items-center justify-center gap-x-2 mb-4">
                <p>I have read and agree to these terms and conditions</p>
                <button
                  className="bg-background border-black border-2 aspect-square h-[2dvh]"
                  onClick={() => setTermsAccepted(!termsAccepted)}
                >
                  {termsAccepted ? (
                    <Check className="w-auto h-[1.7dvh] bg-yellow-400" />
                  ) : (
                    <div></div>
                  )}
                </button>
              </div>
              <button
                className="w-full px-4 py-2 flex flex-row items-center justify-center bg-primary hover:bg-primary-600 transition-all duration-300 text-white text-center rounded"
                onClick={() => setSignUp(!signUp)}
              >
                Continue To Calculator
                <ChevronRight />
              </button>
            </div>
          ) : (
            <div></div>
          )}
          <div className="flex flex-col text-center items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center mb-[5dvh]">
              <img
                className="text-5xl md:text-6xl xl:text-[80px] w-[80dvw] lg:w-[25dvw] font-semibold text-white"
                alt="Pediatric Blue Book"
                src={PBB.src}
              />
            </div>
            <div className="flex flex-col w-fit h-fit bg-gradient-to-bl from-primary to-primary-600 justify-center text-white text-left items-center gap-6 p-8 rounded mb-[5dvh] shadow-2xl">
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
                  <a
                    className="text-md md:text-xl mb-1 md:mb-2 hover:underline"
                    href="/forgot-password"
                  >
                    Forgot your password?
                  </a>
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
                <a
                  className="bg-secondary text-white px-4 py-3 rounded w-full uppercase font-bold text-center"
                  href="/signup"
                >
                  Sign Up
                </a>
                <button
                  className="bg-secondary hover:bg-secondary-900 text-white px-4 py-2 rounded w-full transition-all duration-300"
                  onClick={async () => {
                    const success = await handleSubmit();
                    if (success) setSignedIn(true);
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
