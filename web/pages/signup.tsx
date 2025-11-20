/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from "react";
import PBB from "../public/transparent-logo.png";
import { Check, ChevronRight, X } from "lucide-react";
import * as React from "react";
import { supabase } from "@/lib/supabase";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import router from "next/router";
import Link from "next/link";
import Head from "next/head";

const Index = () => {
  const [signUp, setSignUp] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [policyClick, setViewedPolicy] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const pop_up_email = "https://www.knowingnutritionhub.com/bluebook";
  const passwordsMatch = password === confirmPassword;
  const allFieldsFilled =
    firstName && title && email && password && confirmPassword != "";
  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const handlePolicyClick = () => {
    setViewedPolicy(true);
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/");
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          router.push("/");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    const user = data.user;

    if (user) {
      const {} = await supabase.from("users").insert([
        {
          id: user.id,
          email: user.email,
          created_at: new Date(),
          first_name: firstName,
          title: title,
        },
      ]);
    }
    if (error) {
      alert(error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <Head>
        <title>PBB | Sign Up</title>
      </Head>
      <div className="bg-gradient-to-tr from-primary to-background flex flex-col items-center justify-center w-full font-roboto min-h-screen">
        {signUp && allFieldsFilled && passwordsMatch ? (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:w-[50dvw] 2xl:w-[25dvw] bg-background p-4 rounded text-md md:text-lg lg:text-xl z-50">
            <button className="self-start" onClick={() => setSignUp(false)}>
              <X />
            </button>
            <p className="mb-4">
              This website is intended for use by healthcare professionals for
              general information purposes only. By using this website you are
              agreeing to the terms of use. This website is not a substitute for
              professional medical judgment.
            </p>
            <p className="mb-4">
              If accessed by non-healthcare professionals, the user should seek
              professional medical advice in determining what is best for their
              individual situation. No one should rely on information on this
              website as a substitute for professional medical advice,
              diagnosis, or treatment.
            </p>
            <p className="mb-4">
              The developers made every effort to provide accurate product
              information; however, it is subject to change. The label of
              product contains the most current information for the applicable
              formula. The developers do not endorse or recommend any specific
              product included in this website.
            </p>
            <p className="mb-4 ">{`To report corrections, please go to: ${pop_up_email}`}</p>

            <div className="flex flex-row text-center items-center justify-center gap-x-1 md:gap-x-2 mb-4 text-sm md:text-xl">
              <p>
                I have read and agree to{" "}
                <a
                  href="/Privacy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handlePolicyClick}
                  className="text-blue-600 underline"
                >
                  these terms and conditions
                </a>
              </p>
              <button
                className="bg-background border-black border-2 aspect-square h-[2dvh] rounded 
             disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  if (!policyClick) {
                    alert(
                      "Please click the link and read the policy before continuing."
                    );
                    return;
                  }

                  setTermsAccepted(!termsAccepted);
                }}
              >
                {termsAccepted ? (
                  <Check className="w-auto h-[1.7dvh] bg-white rounded" />
                ) : (
                  <div></div>
                )}
              </button>
            </div>
            <button
              className="w-full px-4 py-2 flex flex-row items-center justify-center bg-primary hover:bg-primary-600 transition-all duration-300 text-white text-center rounded"
              onClick={async () => {
                if (termsAccepted) {
                  await handleSignUp(email, password);
                } else {
                  alert("You must accept the terms and conditions to proceed.");
                }
              }}
            >
              Continue To Calculator
              <ChevronRight />
            </button>
          </div>
        ) : (
          <div></div>
        )}
        <div className="flex flex-col text-center items-center justify-center min-h-screen">
          <div className="flex flex-col items-center justify-center my-4 xl:mb-[5dvh] h-fit">
            <img
              className="text-5xl md:text-6xl xl:text-[80px] w-[70dvw] lg:w-[25dvw] font-semibold text-white"
              alt="Pediatric Blue Book"
              src={PBB.src}
            />
          </div>
          <div className="flex flex-col w-fit h-fit bg-gradient-to-bl from-primary to-primary-600 justify-center text-white text-left items-center gap-6 p-4 md:p-8 rounded mb-4 xl:mb-[5dvh] shadow-2xl mx-1">
            <div className="flex flex-col w-full gap-2">
              <p className="text-4xl lg:text-5xl font-bold text-white">
                Sign Up
              </p>
              <p className="text-md lg:text-xl">
                Enter your email and password below to create to your account.
              </p>
            </div>
            <div className="flex flex-col text-left w-full">
              <p className="text-xl xl:text-2xl mb-2 text-white">First Name</p>
              <input
                className="rounded px-4 py-2 bg-white text-black w-full"
                autoComplete="given-name"
                name="given-name"
                placeholder="Ramses"
                onInput={(e) =>
                  setFirstName((e.target as HTMLInputElement).value)
                }
              />
            </div>
            <div className="flex flex-col text-left w-full">
              <p className="text-xl xl:text-2xl mb-2 text-white">Title</p>
              <Select
                onValueChange={(value) => {
                  switch (value) {
                    case "registered_dietician":
                      setTitle("Registered Dietician");
                      break;
                    case "dietician_technician":
                      setTitle("Dietician Technician");
                      break;
                    case "advanced_practice_provider":
                      setTitle("Advanced Practice Provider");
                      break;
                    case "nurse":
                      setTitle("Nurse");
                      break;
                    case "physician":
                      setTitle("Physician");
                      break;
                  }
                }}
              >
                <SelectTrigger className="w-full bg-white rounded text-text px-4 py-2">
                  <SelectValue placeholder="Select an occupation" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup className="bg-white">
                    <SelectItem
                      className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                      value="registered_dietician"
                    >
                      Registered Dietician
                    </SelectItem>
                    <SelectItem
                      className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                      value="dietician_technician"
                    >
                      Dietician Technician
                    </SelectItem>
                    <SelectItem
                      className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                      value="advanced_practice_provider"
                    >
                      Advanced Practice Provider
                    </SelectItem>
                    <SelectItem
                      className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                      value="nurse"
                    >
                      Nurse
                    </SelectItem>
                    <SelectItem
                      className="w-full bg-white rounded text-text px-4 py-2 hover:bg-primary"
                      value="physician"
                    >
                      Physician
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col text-left w-full">
              <p className="text-xl xl:text-2xl mb-2 text-white">Email</p>
              <input
                className="rounded px-4 py-2 bg-white text-black w-full"
                autoComplete="email"
                name="email"
                placeholder="email@example.com"
                onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
              />
            </div>
            <div className="flex flex-col text-left w-full">
              <p className="text-xl xl:text-2xl mb-2 font-medium text-white">
                Password
              </p>
              <input
                className="rounded px-4 py-2 bg-white text-black w-full"
                autoComplete="password"
                name="password"
                type="password"
                placeholder="Enter a secure password"
                onInput={(e) =>
                  setPassword((e.target as HTMLInputElement).value)
                }
              />
            </div>
            <div className="flex flex-col text-left w-full">
              <p className="text-xl xl:text-2xl mb-2 font-medium text-white">
                Confirm Password
              </p>

              <input
                className="rounded px-4 py-2 bg-white text-black w-full"
                autoComplete="password"
                name="password"
                placeholder="Re-enter your password"
                type="password"
                onInput={(e) =>
                  setConfirmPassword((e.target as HTMLInputElement).value)
                }
              />
            </div>
            <div className="flex flex-col w-full items-center gap-y-2">
              <button
                className="bg-secondary text-white px-4 py-3 rounded w-full"
                onClick={() => {
                  if (!allFieldsFilled) {
                    alert("Please fill out all fields");
                  } else if (!passwordValid) {
                    alert(
                      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
                    );
                  } else if (!emailValid) {
                    alert("Please enter a valid email address");
                  } else if (!passwordsMatch) {
                    alert("Passwords do not match");
                  } else {
                    setSignUp(true);
                  }
                }}
              >
                Sign Up
              </button>
              <Link href="/" className="hover:underline text-md md:text-lg">
                Already have an account?
              </Link>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Index;
