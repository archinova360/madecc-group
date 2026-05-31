import React, { useState } from "react";
import { Hammer, Menu, X, Landmark, UserCheck } from "lucide-react";

interface Props {
  activePage: string;
  setActivePage: (page: string) => void;
  onOpenStaffPortal: () => void;
  staffLoggedIn: string | null;
  onLogoutStaff: () => void;
}

export default function Header({ activePage, setActivePage, onOpenStaffPortal, staffLoggedIn, onLogoutStaff }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Portfolio" },
    { id: "projects", label: "Projects" },
    { id: "blogs", label: "Blogs & News" },
    { id: "contact", label: "Contact Us" },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-250 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* SVG Vector Logo with brand styling */}
          <div 
            onClick={() => handleNavClick("home")} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-slate-900 border-2 border-slate-900 rounded-xl flex items-center justify-center text-amber-500 shadow-md group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 21h18" />
                <path d="M19 21v-8a2 2 0 00-2-2h-3v5" fill="none" />
                <path d="M14 16v-5a2 2 0 00-2-2H9v7" fill="none" />
                <path d="M9 16v-8a2 2 0 00-2-2H3v12" fill="none" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3 3H9l3-3z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black text-xl text-slate-900 leading-none tracking-wider uppercase">
                MADECC <span className="text-amber-500 text-2xl font-mono relative top-[1px]">C</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mt-0.5">
                Group • Cameroon
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-150 cursor-pointer ${
                  activePage === item.id
                    ? "text-slate-900 bg-slate-50 border-b-2 border-amber-500 rounded-none pb-1.5"
                    : "text-gray-500 hover:text-slate-950 hover:bg-slate-50/80"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Call to actions */}
          <div className="hidden lg:flex items-center gap-3">
            {staffLoggedIn ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavClick("admin")}
                  className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-750 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl border border-indigo-150 transition cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-indigo-650" /> {staffLoggedIn}
                </button>
                <button
                  onClick={onLogoutStaff}
                  className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition font-medium cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenStaffPortal}
                className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-950 hover:bg-slate-50 px-3 py-2 rounded-xl font-bold uppercase tracking-wider transition border border-gray-200 shadow-3xs cursor-pointer"
              >
                Staff Access
              </button>
            )}

            <button
              onClick={() => handleNavClick("baseline-form")}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider px-4 py-3 rounded-xl shadow-xs transition duration-150 cursor-pointer"
            >
              Baseline Site
            </button>
          </div>

          {/* Mobile Menu trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => handleNavClick("baseline-form")}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider cursor-pointer"
            >
              Baseline
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-650 hover:text-slate-950 hover:bg-slate-50 border border-gray-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-2 shadow-inner">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all ${
                activePage === item.id
                  ? "bg-amber-50 text-amber-950 font-black border-l-4 border-amber-500"
                  : "text-gray-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
            {staffLoggedIn ? (
              <>
                <button
                  onClick={() => handleNavClick("admin")}
                  className="w-full text-center bg-indigo-50 p-3 rounded-xl text-xs font-semibold text-indigo-800"
                >
                  Workspace: {staffLoggedIn}
                </button>
                <button
                  onClick={() => {
                    onLogoutStaff();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-xs text-red-500 font-bold p-2.5 rounded-xl border border-red-100 hover:bg-red-50"
                >
                  Logout Session
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenStaffPortal();
                }}
                className="w-full text-center text-xs text-gray-700 font-bold border border-gray-250 p-3 rounded-xl hover:bg-slate-50"
              >
                Staff Portal Sign-In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
