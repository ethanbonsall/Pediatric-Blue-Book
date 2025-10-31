/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import PBB from "../public/transparent-logo.png";
import { Home, Settings } from "lucide-react";
import avatar from "../public/avatar.png";

export default function AdminNavbar() {
  return (
    <nav className="flex sticky top-0 p-2 lg:p-6 justify-between w-full z-50 bg-primary shadow-xl text-text">
      <Link href="/" className="h-12">
        <img src={PBB.src} alt="Pediatric Blue Book" className="h-full" />
      </Link>
      <div className="flex flex-row gap-x-3 lg:gap-x-7 text-2xl items-center font-medium text-background">
        <Link 
          href="/" 
          className="flex flex-row items-center gap-x-2 hover:text-primary-700 transition-colors duration-150"
        >
          <Home className="w-6 h-6" />
          <span className="hidden sm:block">Home</span>
        </Link>
        <div className="flex flex-row items-center gap-x-2 text-background">
          <Settings className="w-6 h-6" />
          <span className="hidden sm:block">Admin Panel</span>
        </div>
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