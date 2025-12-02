"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import Head from "next/head";
import { supabase } from "@/lib/supabase";
import NavBar from "@/components/navbar";
import NutrientNeedsCalculator from "@/components/nutrient-needs-calculator";
import FormulaNeedsCalculator from "@/components/formula-needs-calculator";
import FormulaLookup from "@/components/formula-lookup";
import PBB from "../public/transparent-logo.png";
import { useSearchParams } from "next/navigation";

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

type Nutrient = {
  name: string;
  amount: string;
};

const Index: React.FC = () => {
  // State management
  const [showLogin, setShowLogin] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nutrients, setNutrients] = useState<Nutrient[]>([]);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const searchParams = useSearchParams();
 useEffect(() => {
  const loginParam = searchParams?.get("login");
    if (loginParam === "true") {
    setShowLogin(true);
    }
  }, [searchParams]);


  // Colors
  const colors = {
    primary50: "#eaf4fa",
    primary100: "#d6e9f5",
    primary200: "#add2eb",
    primary300: "#84bce1",
    primary400: "#5ba5d7",
    primary500: "#328fcd",
    primary600: "#2872a4",
    primary700: "#1e567b",
    primary800: "#143952",
    primary900: "#0a1d29",
    primary950: "#050e15",
  } as const;

  // Features data
  const features: Feature[] = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Estimating Needs",
      desc: "Calculate calorie, fluid, macro-, and micronutrient requirements for newborns through age 18.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: "Recipe Checks",
      desc: "Evaluate recipes families bring to you and verify nutritional adequacy.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: "Custom Formulas",
      desc: "Create hypercaloric and hypocaloric formulas using up to five products, including powders, liquids, and supplements.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Deficiency Prevention",
      desc: "Ensure recipes meet estimated nutrient needs to minimize deficiency risks.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      ),
      title: "Recipe Management",
      desc: "Print and save your recipes for future reference (no patient data is stored).",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: "Formula Information",
      desc: "Access basic details on over 100 products in our comprehensive database.",
    },
  ];

  // Check authentication on mount
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

  // Handle login
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

  // Handle forgot password
  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    alert("Forgot password functionality - redirect to /forgot-password page");
  };

  // Handle FAQ
  const handleFAQ = () => {
    // TODO: Implement FAQ functionality
    alert("FAQs coming soon");
  };

  // Handle Contact
  const handleContact = () => {
    // TODO: Implement contact functionality
    alert("Contact info coming soon");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        Loading...
      </div>
    );
  }

  // If signed in, show the main app
  if (signedIn) {
    return (
      <>
        <Head>
          <title>Pediatric Blue Book</title>
        </Head>
        <div className="flex flex-col items-center w-full font-roboto min-h-screen bg-background">
          <NavBar />
          <NutrientNeedsCalculator onNutrientsCalculated={setNutrients} />
          <FormulaNeedsCalculator idealNutrients={nutrients} />
          <FormulaLookup />
        </div>
      </>
    );
  }

  // If showing login form
  if (showLogin) {
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col text-left w-full">
                <div className="flex flex-row justify-between items-center">
                  <p className="text-2xl mb-2 font-medium text-white">
                    Password
                  </p>
                  <button
                    className="text-md md:text-xl mb-1 md:mb-2 hover:underline"
                    onClick={handleForgotPassword}
                    type="button"
                  >
                    Forgot your password?
                  </button>
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
                    onClick={() => setShowLogin(false)}
                    type="button"
                  >
                    ← Back to Landing
                  </button>
                  <span className="text-white hidden sm:block">|</span>
                  <a
                    href="/signup"
                    className="text-white text-md text-center hover:underline"
                  >
                    Don't have an account? Sign Up
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default: Show landing page
  return (
    <>
      <Head>
        <title>Pediatric Nutrition Blue Book</title>
        <meta
          name="description"
          content="A comprehensive tool for pediatric dietitians to calculate nutrition needs, create custom formulas, and manage recipes."
        />
      </Head>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 10px 30px rgba(10, 29, 41, 0.2)); }
          50% { filter: drop-shadow(0 20px 50px rgba(10, 29, 41, 0.35)); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float-glow {
          animation: float 4s ease-in-out infinite, pulse-glow 3s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .feature-card {
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 40px rgba(10, 29, 41, 0.2);
        }
      `}</style>

      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: colors.primary300 }}
      >
        {/* Navigation */}
        <nav
          className="flex justify-center items-center p-4 lg:p-6 sticky top-0 z-50"
          style={{ backgroundColor: colors.primary400 }}
        >
          <div className="flex items-center justify-between w-full max-w-6xl">
            <div className="flex-1" />
            <div className="flex items-center justify-center">
              <img
                src={PBB.src}
                alt="Pediatric Blue Book"
                className="h-10 lg:h-12"
              />
            </div>
            <div className="flex-1 flex justify-end gap-3 items-center">
              <button
                onClick={handleFAQ}
                className="px-4 py-2 transition-all text-sm font-medium rounded-lg hover:opacity-80"
                style={{ color: colors.primary900, textTransform: "none" }}
                type="button"
              >
                FAQs
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="px-5 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg text-sm"
                style={{
                  backgroundColor: colors.primary800,
                  color: colors.primary50,
                  textTransform: "none",
                }}
                type="button"
              >
                Login
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 text-center py-12">
          <div className="max-w-4xl mx-auto animate-slide-up">
            <div className="mb-10 animate-float-glow flex justify-center">
              <img
                src={PBB.src}
                alt="Pediatric Blue Book"
                className="w-64 lg:w-80"
              />
            </div>

            <div className="inline-block mb-4">
              <span
                className="text-xs font-medium px-4 py-1.5 rounded-full"
                style={{
                  backgroundColor: colors.primary200,
                  color: colors.primary900,
                  border: `1px solid ${colors.primary400}`,
                  textTransform: "none",
                }}
              >
                ✨ Free for Healthcare Professionals
              </span>
            </div>

            <p
              className="text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed px-2 font-normal"
              style={{ color: colors.primary900, textTransform: "none" }}
            >
              Designed with pediatric dietitians in mind, this comprehensive
              tool consolidates essential clinical resources. Work more
              efficiently, minimize errors, and personalize nutrition plans.
            </p>

            <div className="flex justify-center items-center mb-6">
              <button
                onClick={() => setShowLogin(true)}
                className="group px-8 py-4 rounded-full text-base font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: colors.primary800,
                  color: colors.primary50,
                  textTransform: "none",
                }}
                type="button"
              >
                Get Started Free
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center gap-2 mb-6">
              <a
                href="/signup"
                className="text-sm font-medium hover:underline transition-colors"
                style={{ color: colors.primary900, textTransform: "none" }}
              >
                Don't have an account? Sign Up
              </a>
            </div>

            <div
              className="flex items-center justify-center gap-2 text-sm font-normal"
              style={{ color: colors.primary800, textTransform: "none" }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Developed with UNC Chapel Hill • Managed by Knowing Nutrition
              </span>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section
          className="py-16 px-4"
          style={{ backgroundColor: colors.primary200 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-2xl sm:text-3xl font-bold mb-3"
                style={{ color: colors.primary900, textTransform: "none" }}
              >
                Everything You Need
              </h2>
              <p
                className="max-w-xl mx-auto font-normal"
                style={{ color: colors.primary700, textTransform: "none" }}
              >
                Powerful tools designed specifically for pediatric nutrition
                professionals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="feature-card rounded-2xl p-6 text-left cursor-pointer"
                  style={{
                    backgroundColor: colors.primary50,
                    border: `1px solid ${colors.primary300}`,
                  }}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                    style={{
                      backgroundColor:
                        hoveredFeature === index
                          ? colors.primary700
                          : colors.primary300,
                      color:
                        hoveredFeature === index
                          ? colors.primary50
                          : colors.primary900,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{
                      color: colors.primary900,
                      textTransform: "none",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed font-normal"
                    style={{
                      color: colors.primary700,
                      textTransform: "none",
                    }}
                  >
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section
          className="py-10 px-4"
          style={{ backgroundColor: colors.primary300 }}
        >
          <div
            className="max-w-3xl mx-auto rounded-2xl p-6"
            style={{
              backgroundColor: colors.primary100,
              border: `1px solid ${colors.primary400}`,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                style={{ backgroundColor: colors.primary400 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  style={{ color: colors.primary900 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3
                  className="font-semibold mb-2"
                  style={{
                    color: colors.primary900,
                    textTransform: "none",
                  }}
                >
                  For Health Professionals Only
                </h3>
                <p
                  className="text-sm leading-relaxed font-normal"
                  style={{
                    color: colors.primary700,
                    textTransform: "none",
                  }}
                >
                  This software should only be used by health professionals. The
                  User acknowledges these tools are a reference aid only, and
                  the information is not intended to be (nor should it be used
                  as) a substitute for professional judgement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="py-8 px-4"
          style={{ backgroundColor: colors.primary400 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-6 mb-4 text-sm">
              <button
                onClick={handleFAQ}
                className="transition-colors font-normal hover:opacity-70"
                style={{ color: colors.primary900, textTransform: "none" }}
                type="button"
              >
                FAQs
              </button>
              <button
                onClick={handleContact}
                className="transition-colors font-normal hover:opacity-70"
                style={{ color: colors.primary900, textTransform: "none" }}
                type="button"
              >
                Contact
              </button>
              <a
                href="/Privacy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors font-normal hover:opacity-70"
                style={{ color: colors.primary900, textTransform: "none" }}
              >
                Privacy Policy
              </a>
            </div>
            <p
              className="text-sm font-normal"
              style={{ color: colors.primary800, textTransform: "none" }}
            >
              © 2025 Pediatric Nutrition Blue Book. Managed by Lisa Richardson,
              MS, RD at Knowing Nutrition.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
