"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <nav className="bg-primary text-text p-6 flex sticky top-0 justify-between w-full z-50">
      {/* Left Logo / Title */}
      <button
        className="flex flex-col text-2xl font-bold"
        onClick={() => {
          const root = document.documentElement;
          const currentTheme = root.classList.contains("dark")
            ? "dark"
            : "light";
          if (currentTheme === "light") {
            root.classList.add("dark");
            root.classList.remove("light");
          } else {
            root.classList.add("light");
            root.classList.remove("dark");
          }
        }}
      >
        <h1>COMP 523</h1>
        <h1>Team O</h1>
      </button>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-x-10 justify-center self-center">
        {/* Deliverables dropdown */}
        <div className="relative group">
          <button className="flex flex-row items-center">
            Deliverables
            <ChevronDown className="h-5 w-5 ml-1 transition-transform duration-200 group-hover:rotate-180" />
          </button>
          <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-secondary text-text font-bold rounded-lg shadow-lg p-1 min-w-full whitespace-nowrap z-50">
            <Link
              href="/specifications"
              className="hover:bg-secondary-400 p-2 rounded"
            >
              D1. Specifications
            </Link>
            <hr />
            <Link
              href="/Prototype"
              className="hover:bg-secondary-400 p-2 rounded"
            >
              D2. Prototype
            </Link>
          </div>
        </div>

        {/* Team dropdown */}
        <div className="relative group">
          <button className="flex flex-row items-center">
            Team
            <ChevronDown className="h-5 w-5 ml-1 transition-transform duration-200 group-hover:rotate-180" />
          </button>
          <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-secondary text-text font-bold rounded-lg shadow-lg p-1 min-w-full whitespace-nowrap z-50">
            <Link href="/team" className="hover:bg-secondary-400 p-2 rounded">
              Meet the Team
            </Link>
            <Link href="/rules" className="hover:bg-secondary-400 p-2 rounded">
              Team Rules
            </Link>
          </div>
        </div>

        {/* Assignments */}
        <div className="relative group">
          <button className="flex flex-row items-center">
            Assignments
            <ChevronDown className="h-5 w-5 ml-1 transition-transform duration-200 group-hover:rotate-180" />
          </button>
          <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-secondary text-text font-bold rounded-lg shadow-lg p-1 min-w-full whitespace-nowrap z-50">
            <Link href="/A1" className="hover:bg-secondary-400 p-2 rounded">
              Assignment 1
            </Link>
          </div>
        </div>

        <Link href="/journal" className="hover:text-text-200 font-bold">
          MEETING JOURNAL
        </Link>

        <div className="relative group">
          <button className="flex flex-row items-center">
            Final Deliverables
            <ChevronDown className="h-5 w-5 ml-1 transition-transform duration-200 group-hover:rotate-180" />
          </button>
          <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-secondary text-text font-bold rounded-lg shadow-lg p-1 min-w-full whitespace-nowrap z-50">
            <Link href="/D1" className="hover:bg-secondary-400 p-2 rounded">
              Deliverable 1
            </Link>
          </div>
        </div>

        <Link href="mailto:lcbean@ad.unc.edu;ebonsall@unc.edu;archgoli@ad.unc.edu;apandey@ad.unc.edu" className="hover:text-text-200 font-bold">
          CONTACT US
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex items-center"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Fullscreen Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-primary text-text flex flex-col p-8 z-50">
          <button
            className="self-end mb-6"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-8 w-8" />
          </button>

          {/* Mobile nav items with click expand */}
          <div className="flex flex-col gap-6 text-2xl">
            {/* Deliverables */}
            <div>
              <button
                onClick={() => toggleMenu("deliverables")}
                className="flex justify-between items-center w-full"
              >
                Deliverables
                {openMenu === "deliverables" ? <ChevronUp /> : <ChevronDown />}
              </button>
              {openMenu === "deliverables" && (
                <div className="ml-4 mt-2 flex flex-col gap-2">
                  <Link href="/specifications">D1. Specifications</Link>
                  <Link href="/Prototype">D2. Prototype</Link>
                </div>
              )}
            </div>

            {/* Team */}
            <div>
              <button
                onClick={() => toggleMenu("team")}
                className="flex justify-between items-center w-full"
              >
                Team
                {openMenu === "team" ? <ChevronUp /> : <ChevronDown />}
              </button>
              {openMenu === "team" && (
                <div className="ml-4 mt-2 flex flex-col gap-2">
                  <Link href="/Team">Meet the Team</Link>
                  <Link href="/rules">Team Rules</Link>
                </div>
              )}
            </div>

            {/* Assignments */}
            <div>
              <button
                onClick={() => toggleMenu("assignments")}
                className="flex justify-between items-center w-full"
              >
                Assignments
                {openMenu === "assignments" ? <ChevronUp /> : <ChevronDown />}
              </button>
              {openMenu === "assignments" && (
                <div className="ml-4 mt-2 flex flex-col gap-2">
                  <Link href="/A1">Assignment 1</Link>
                </div>
              )}
            </div>

            <Link className="font-bold" href="/journal">
              MEETING JOURNAL
            </Link>

            {/* Final Deliverables */}
            <div>
              <button
                onClick={() => toggleMenu("final")}
                className="flex justify-between items-center w-full"
              >
                Final Deliverables
                {openMenu === "final" ? <ChevronUp /> : <ChevronDown />}
              </button>
              {openMenu === "final" && (
                <div className="ml-4 mt-2 flex flex-col gap-2">
                  <Link href="/D1">Deliverable 1</Link>
                </div>
              )}
            </div>

            <Link className="font-bold" href="mailto:lcbean@ad.unc.edu;ebonsall@unc.edu;archgoli@ad.unc.edu;apandey@ad.unc.edu">
              CONTACT US
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
