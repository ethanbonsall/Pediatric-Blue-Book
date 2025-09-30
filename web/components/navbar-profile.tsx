/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import PBB from "../public/transparent-logo.png";
import { Home } from "lucide-react";
import avatar from "../public/avatar.png";

export default function Navbar() {
  return (
    <nav className="flex sticky top-0 p-6 justify-between w-full z-50 bg-primary text-text">
      <Link href="/" className="h-12">
        <img src={PBB.src} alt="Pediatric Blue Book" className="h-full"></img>
      </Link>
      <div className="flex flex-row gap-x-8 text-2xl items-center font-medium text-background">
        <Link href="/" className="flex flex-row items-center gap-x-1">
          <Home></Home>Home
        </Link>
        <Link href="/profile">
          <img src={avatar.src} alt="user" className="rounded-full h-[50px]" />
        </Link>
      </div>
    </nav>
  );
}
