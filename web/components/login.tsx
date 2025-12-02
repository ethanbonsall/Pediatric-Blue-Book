// File: web/components/login.tsx
// Login component that provides authentication form for users to sign in to the application.
// Handles email/password authentication via Supabase and provides navigation options.

"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import PBB from "../public/transparent-logo.png";

// Props interface for Login component
interface LoginProps {
  onLoginSuccess: () => void; // Callback function called when login is successful
  onBackToLanding: () => void; // Callback function called when user wants to return to landing page
}

const Login = ({ onLoginSuccess, onBackToLanding }: LoginProps) => {
  // State: User's email input value
  const [email, setEmail] = useState("");
  // State: User's password input value
  const [password, setPassword] = useState("");

  // Handler: Submits login credentials to Supabase and handles authentication result
  const handleSubmit = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      // Display error message if authentication fails
      alert(error.message);
    } else {
      // Call success callback if authentication succeeds
      onLoginSuccess();
    }
  };

  return (
    <>
      <Head>
        <title>Login - Pediatric Blue Book</title>
      </Head>
      <div className="bg-flow flex flex-col items-center justify-center w-full font-roboto min-h-screen">
        <div className="flex flex-col text-center items-center justify-center min-h-screen">
          <div className="flex flex-col items-center justify-center mb-[5dvh]">
            <img
              className="w-[80dvw] lg:w-[25dvw]"
              alt="Pediatric Blue Book"
              src={PBB.src}
            />
          </div>
          <div className="flex flex-col w-fit h-fit bg-gradient-to-bl from-primary to-primary-600 justify-center text-white text-left items-center gap-6 p-8 rounded mb-[5dvh] shadow-2xl mx-1">
            <div className="flex flex-col w-full gap-2 items-center text-center">
              <p className="text-4xl md:text-5xl font-bold text-white">Login</p>
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col text-left w-full">
              <div className="flex flex-row justify-between items-center">
                <p className="text-2xl mb-2 font-medium text-white">Password</p>
                <Link
                  className="text-md md:text-xl mb-1 md:mb-2 hover:underline"
                  href="/forgot-password"
                >
                  Forgot your password?
                </Link>
              </div>
              <input
                className="rounded px-4 py-2 bg-white text-black w-full"
                autoComplete="current-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full justify-center items-center gap-y-4">
              <button
                className="bg-secondary hover:bg-secondary-900 text-white px-4 py-2 rounded w-full transition-all duration-300"
                onClick={handleSubmit}
                type="button"
              >
                Login
              </button>
              <div className="flex flex-col sm:flex-row gap-4 w-full items-center justify-center">
                <button
                  className="text-white text-md text-center hover:underline"
                  onClick={onBackToLanding}
                  type="button"
                >
                  ← Back to Landing
                </button>
                <span className="text-white hidden sm:block">|</span>
                <Link
                  href="/signup"
                  className="text-white text-md text-center hover:underline"
                >
                  Don&apos;t have an account? Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
