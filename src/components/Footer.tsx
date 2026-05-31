import React from "react";
import { Scale, Lock, Landmark, FileCheck } from "lucide-react";

interface Props {
  setActivePage: (page: string) => void;
}

export default function Footer({ setActivePage }: Props) {
  const handlePageClick = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 pt-16 pb-12 mt-16 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-900 pb-12">
          
          {/* Brand Intro Column */}
          <div className="flex flex-col gap-4 md:col-span-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-slate-950 font-black">
                M
              </div>
              <span className="font-sans font-black text-lg tracking-wider text-white">
                MADECC <span className="text-amber-500">GROUP</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 tracking-normal leading-relaxed">
              Maison de Construction et de Civil S.A. is Cameroon’s premier building contractor, delivering heavy logistics buildings, earthquake-resistant complexes, coastal enforcements, and standard civil masterpieces.
            </p>
            <p className="text-[10px] text-slate-500">
              Registration No: RC/YAO/2026/B/882103<br />
              N.I.U: M05261899201A | ONAC Registered
            </p>
          </div>

          {/* Quick Nav links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold font-mono uppercase text-amber-500 tracking-wider">
              Corporate Directory
            </h4>
            <div className="flex flex-col gap-1 text-xs text-slate-300 font-medium">
              <button onClick={() => handlePageClick("home")} className="text-left hover:text-white transition py-2 md:py-1 px-1 block w-full focus:outline-none focus:ring-1 focus:ring-amber-500 rounded">Home Dashboard</button>
              <button onClick={() => handlePageClick("about")} className="text-left hover:text-white transition py-2 md:py-1 px-1 block w-full focus:outline-none focus:ring-1 focus:ring-amber-500 rounded">Corporate Profile</button>
              <button onClick={() => handlePageClick("services")} className="text-left hover:text-white transition py-2 md:py-1 px-1 block w-full focus:outline-none focus:ring-1 focus:ring-amber-500 rounded">Engineering Services</button>
              <button onClick={() => handlePageClick("portfolio")} className="text-left hover:text-white transition py-2 md:py-1 px-1 block w-full focus:outline-none focus:ring-1 focus:ring-amber-500 rounded">Completed Portfolios</button>
              <button onClick={() => handlePageClick("projects")} className="text-left hover:text-white transition py-2 md:py-1 px-1 block w-full focus:outline-none focus:ring-1 focus:ring-amber-500 rounded">Active Yards & Checklists</button>
              <button onClick={() => handlePageClick("blogs")} className="text-left hover:text-white transition py-2 md:py-1 px-1 block w-full focus:outline-none focus:ring-1 focus:ring-amber-500 rounded">Insights & Press Releases</button>
            </div>
          </div>

          {/* Legal Compliance columns */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold font-mono uppercase text-amber-500 tracking-wider">
              Legal & Compliance
            </h4>
            <div className="flex flex-col gap-1 text-xs text-slate-300 font-medium">
              <button 
                onClick={() => handlePageClick("privacy")} 
                className="hover:text-white transition text-left flex items-center gap-2 py-2 md:py-1 px-1 block w-full focus:outline-none focus:ring-1 focus:ring-amber-500 rounded"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" /> Privacy Policy
              </button>
              <button 
                onClick={() => handlePageClick("terms")} 
                className="hover:text-white transition text-left flex items-center gap-2 py-2 md:py-1 px-1 block w-full focus:outline-none focus:ring-1 focus:ring-amber-500 rounded"
              >
                <Scale className="w-3.5 h-3.5 text-slate-500 shrink-0" /> Terms of Service
              </button>
              <button 
                onClick={() => handlePageClick("compliance")} 
                className="hover:text-white transition text-left flex items-center gap-2 py-2 md:py-1 px-1 block w-full focus:outline-none focus:ring-1 focus:ring-amber-500 rounded"
              >
                <FileCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" /> AdSense & State compliance
              </button>
            </div>
          </div>

          {/* Contact coordinates */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold font-mono uppercase text-amber-500 tracking-wider">
              Headquarters Coordinates
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              <strong className="text-slate-200">Yaoundé (Main Office):</strong> Rue de Mbankolo, Centre Region, Cameroon.<br />
              <strong className="text-slate-200">Douala (Yards Desk):</strong> Boulevard de la Bessecke, Bonabéri, Littoral, Cameroon.<br />
              <strong className="text-slate-200">Phone:</strong> +237 671063511 / +237683316486 / +237640194505<br />
              <strong className="text-slate-200">Direct Email:</strong> madecccons@gmail.com
            </p>
          </div>

        </div>

        {/* AdSense Required Licensing Frame */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-500 gap-4">
          <p className="font-mono text-center md:text-left">
            © 2026 MADECC Group. All rights reserved. Registered in Cameroon No. RC/YAO/2026/B/882103.
          </p>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <span className="border border-slate-800 px-2 py-1 rounded bg-slate-900/50 text-[10px] uppercase font-bold tracking-wider text-emerald-500">
              ANOR Standard Certified
            </span>
            <span className="border border-slate-800 px-2 py-1 rounded bg-slate-900/50 text-[10px] uppercase font-bold tracking-wider text-amber-500">
              ONAC Registered S.A.
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
