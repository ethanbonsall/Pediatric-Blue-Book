// File: web/pages/index.tsx
// Main entry point for the application. Handles routing between landing page, login, and authenticated app views.
// Manages authentication state and determines which component to render based on user session status.

"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { supabase } from "@/lib/supabase";
import NavBar from "@/components/navbar";
import NutrientNeedsCalculator from "@/components/nutrient-needs-calculator";
import FormulaNeedsCalculator from "@/components/formula-needs-calculator";
import FormulaLookup from "@/components/formula-lookup";
import LandingPage from "@/components/landing-page";
import Login from "@/components/login";
import { useSearchParams } from "next/navigation";

// Type definition for nutrient data structure
type Nutrient = {
  name: string;
  amount: string;
};

const Index = () => {
  // State management
  const [showLogin, setShowLogin] = useState(false); // Controls whether login form is displayed
  const [signedIn, setSignedIn] = useState(false); // Tracks user authentication status
  const [loading, setLoading] = useState(true); // Loading state while checking authentication
  const [nutrients, setNutrients] = useState<Nutrient[]>([]); // Stores calculated nutrient values

  const searchParams = useSearchParams();
  // Effect: Check URL parameters for login query string and show login form if present
  useEffect(() => {
    const loginParam = searchParams?.get("login");
    if (loginParam === "true") {
      setShowLogin(true);
    }
  }, [searchParams]);

  // Effect: Check authentication status on component mount and set up auth state listener
  useEffect(() => {
    // Function to check current session and update signed in state
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSignedIn(!!session);
      setLoading(false);
    };

    checkSession();

    // Set up listener for authentication state changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSignedIn(!!session);
      }
    );

    // Cleanup: Unsubscribe from auth listener when component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Handler: Displays contact information alert (placeholder for future implementation)
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
      <Login
        onLoginSuccess={() => setSignedIn(true)}
        onBackToLanding={() => setShowLogin(false)}
      />
    );
  }

  return (
    <LandingPage
      onLoginClick={() => setShowLogin(true)}
      onContactClick={handleContact}
    />
  );
};

export default Index;
