/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import PBB from "../public/transparent-logo.png";
import { Apple, Calculator, Search, Table } from "lucide-react";
import avatar from "../public/avatar.png";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const GetUserRole = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single();

          if (error) {
            console.error("Error fetching user role: ", error);
          }
          if (data?.role == "superuser" || data?.role == "admin") {
            setIsAdmin(true);
          }
        }
      } finally {
        // setIsLoading(false);
      }
    };
    GetUserRole();
  }, []);

  return (
    <nav className="flex sticky top-0 p-2 lg:p-6 justify-between w-full z-50 bg-primary shadow-xl text-text">
      <Link href="#home" className="h-12">
        <img src={PBB.src} alt="Pediatric Blue Book" className="h-full"></img>
      </Link>

      <div className="flex flex-row gap-x-3 lg:gap-x-7 text-2xl items-center font-medium text-background">
        {isAdmin && (
          <Link href="/admin" className="lg:slide delay-[${i * 100}ms]">
            <Table className="flex lg:hidden" />
            <span className="hidden lg:flex">Admin Panel</span>
          </Link>
        )}
        <Link
          href="#nutrient"
          className="lg:slide delay-[${i * 100}ms] transition-colors duration-150"
        >
          <Apple className="flex lg:hidden text-current" />
          <span className="hidden lg:flex">Nutrient Needs Calculator</span>
        </Link>
        <Link
          href="#formula_calc"
          className="lg:slide delay-[${i * 100}ms] transition-colors duration-150"
        >
          <Calculator className="flex lg:hidden text-current" />
          <span className="hidden lg:flex">Formula Recipe Calculator</span>
        </Link>
        <Link
          href="#formula_lookup"
          className="lg:slide delay-[${i * 100}ms] transition-colors duration-150"
        >
          <Search className="flex lg:hidden text-current" />
          <span className="hidden lg:flex">Formula Look Up Tool </span>
        </Link>
        <Link href="/profile">
          <img
            src={avatar.src}
            alt="user"
            className="rounded-full h-[50px] aspect-square"
          />
        </Link>
      </div>
    </nav>
  );
}
