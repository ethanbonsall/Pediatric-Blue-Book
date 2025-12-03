// File: web/components/landing-page.tsx
// Landing page component that displays the marketing/homepage for the Pediatric Blue Book application.
// Includes hero section, features showcase, disclaimer, and footer. Handles user interactions for navigation to login.

"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { features } from "@/components/features";
import PBB from "../public/transparent-logo.png";
import Head from "next/head";

// Props interface for LandingPage component
interface LandingPageProps {
  onLoginClick: () => void; // Callback function triggered when user clicks login button
}

const LandingPage = ({onLoginClick}: LandingPageProps) => {
  // State: Tracks which feature card is currently being hovered (for visual feedback)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <>
      <Head>
        <title>Pediatric Nutrition Blue Book</title>
        <meta
          name="description"
          content="A comprehensive tool for pediatric dietitians to calculate nutrition needs, create custom formulas, and manage recipes."
        />
      </Head>
      <div className="min-h-screen flex flex-col bg-primary-300">
        {/* Navigation */}
        <nav className="flex justify-center items-center p-4 lg:p-6 sticky top-0 z-50 bg-primary-400">
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
              <Link
                href="/user-guide"
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all hover:opacity-80 text-primary-900"
              >
                FAQs
              </Link>
              <button
                onClick={onLoginClick}
                className="px-5 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg text-sm bg-primary-800 text-primary-50 normal-case"
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
              <span className="text-xs font-medium px-4 py-1.5 rounded-full bg-primary-200 text-primary-900 border border-primary-400 normal-case">
                ✨ Free for Healthcare Professionals
              </span>
            </div>

            <p className="text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed px-2 font-normal text-primary-900 normal-case">
              Designed with pediatric dietitians in mind, this comprehensive
              tool consolidates essential clinical resources. Work more
              efficiently, minimize errors, and personalize nutrition plans.
            </p>

            <div className="flex justify-center items-center mb-6">
              <button
                onClick={onLoginClick}
                className="group px-8 py-4 rounded-full text-base font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2 bg-primary-800 text-primary-50 normal-case"
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
              <Link
                href="/signup"
                className="text-sm font-medium hover:underline transition-colors text-primary-900 normal-case"
              >
                Don&apos;t have an account? Sign Up
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm font-normal text-primary-800 normal-case">
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
        <section className="py-16 px-4 bg-primary-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-primary-900 normal-case">
                Everything You Need
              </h2>
              <p className="max-w-xl mx-auto font-normal text-primary-700 normal-case">
                Powerful tools designed specifically for pediatric nutrition
                professionals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="feature-card rounded-2xl p-6 text-left cursor-pointer bg-primary-50 border border-primary-300"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                      hoveredFeature === index
                        ? "bg-primary-700 text-primary-50"
                        : "bg-primary-300 text-primary-900"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-primary-900 normal-case">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed font-normal text-primary-700 normal-case">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="py-10 px-4 bg-primary-300">
          <div className="max-w-3xl mx-auto rounded-2xl p-6 bg-primary-100 border-primary-400">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-primary-400">
                <svg
                  className="w-5 h-5 text-primary-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-primary-900 normal-case">
                  For Health Professionals Only
                </h3>
                <p className="text-sm leading-relaxed font-normal text-primary-700 normal-case">
                  This software should only be used by health professionals. The
                  User acknowledges these tools are a reference aid only, and
                  the information is not intended to be (nor should it be used
                  as) a substitute for professional judgement.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-8 px-4 bg-primary-400">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-6 mb-4 text-sm">
              <Link
                href="/user-guide"
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all hover:opacity-80 text-primary-900"
              >
                FAQs
              </Link>
              <Link
                href="https://www.knowingnutritionhub.com/bluebook"
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all hover:opacity-80 text-primary-900"
              >
                Contact
              </Link>
              <a
                href="/Privacy.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity font-normal hover:opacity-70 text-primary-900 normal-case self-center"
              >
                Privacy Policy
              </a>
            </div>
            <p className="text-sm font-normal text-primary-900 normal-case">
              © 2025 Pediatric Nutrition Blue Book. Managed by Lisa Richardson,
              MS, RD at Knowing Nutrition.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
