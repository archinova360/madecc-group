import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, FileCheck, Shield, DollarSign } from "lucide-react";

interface FAQItem {
  id: string;
  category: "permits" | "materials" | "payments";
  question: string;
  answer: string;
}

export default function FAQs() {
  const [openId, setOpenId] = useState<string | null>("perm-1");
  const [activeTab, setActiveTab] = useState<"all" | "permits" | "materials" | "payments">("all");

  const faqData: FAQItem[] = [
    {
      id: "perm-1",
      category: "permits",
      question: "What is the procedure for obtaining a Building Permit (Permis de Bâtir) in Cameroon?",
      answer: "Obtaining a Permis de Bâtir in Cameroon involves a collaborative series of statutory submissions to the local department council (such as the Communauté Urbaine de Yaoundé - CUY or Douala - CUD). First, a certified surveyor must deliver an official land boundary certificate (Certificat de Bornage). Additionally, you must secure a Certificat d'Urbanisme which outlines communal zoning bylaws. Under Cameroonian planning regulations, complete architectural plans drafted by ONAC-licensed architects (National Order of Cameroonian Architects) and structural stability dossiers are submitted for final approval. MADECC Group administers this exact regulatory pipeline for our turnkey clients to guarantee absolute clearance."
    },
    {
      id: "perm-2",
      category: "permits",
      question: "Are civil soil density test reports mandatory before starting foundation laying?",
      answer: "Yes. For multi-storey buildings or regions with complex terrain (e.g., clayey hillsides in Yaoundé or marshy maritime fields in Douala), geotechnical soil studies (investigations géotechniques) are highly critical and legally required under ANOR guidelines. These tests measure load-bearing density parameters and decide whether the site calls for flat slab foundations, shallow footings, or reinforced concrete piles (pieux). Skipping soil profiling introduces massive slab cracking risks and violates Cameroon's modern building safety codes."
    },
    {
      id: "mat-1",
      category: "materials",
      question: "Which high-grade cement and iron steel standards does MADECC Group deploy?",
      answer: "We strictly standardise our layouts with premium CEM II/A-L 42.5R Portland cement derived directly from certified local manufacturers like Cimencam, Mira, or Dangote. For structural concrete frames, columns, and cantilever beams, we deploy high-adhesion high-tensile hot-rolled steel bar rods (fer à béton de 8mm, 10mm, 12mm, up to 16mm conforming strictly to ANOR NC 100 Standards). All reinforcement bars undergo physical bend tests at our logistics yards before dispatch."
    },
    {
      id: "mat-2",
      category: "materials",
      question: "How do you control concrete moisture levels and combat humidity in regions like Douala?",
      answer: "Cameroon's coastal zones (Littoral) exhibit massive atmospheric moisture and high saline density, making structural steel extremely prone to corrosion. MADECC Group deploys advanced multi-layer thermal waterproofing coatings (étanchéité liquide ou bitumineuse), concrete additives (superplasticizers that reduce water usage while boosting density), and anti-corrosive primer wraps on all baseline column foundations. Our structural pours utilize screened Sanaga sand and graded volcanic aggregates for maximum durability."
    },
    {
      id: "pay-1",
      category: "payments",
      question: "What are the typical project execution steps and contract payment stages?",
      answer: "We utilize flat, progress-transparent escrow stages to make sure budget frameworks line up perfectly with physical proof on-site. The standard baseline stage outline has 4 phases:\n\n1. Phase 1 (Mobilisation & Foundation): 30% to handle topological grading, excavation, structural steel pile assembly, and initial concrete casting.\n2. Phase 2 (Superstructure Framework): 30% for column pouring, elevated brick walls, beams, and upper block ceiling slabs.\n3. Phase 3 (Roofing & Moisture wrap Cover): 25% for roof timbers, anti-corrosive sheets, external plastering, plumbing pipes, and electrical conduit laying.\n4. Phase 4 (Finishing & Key Delivery): 15% covering tiles, compound security gates, paint layers, final municipal inspection, and delivery."
    },
    {
      id: "pay-2",
      category: "payments",
      question: "Can Cameroonian diaspora clients monitor their construction progress and coordinate funds?",
      answer: "Absolutely! Over 45% of our portfolio clients represent Cameroonian expatriates in Europe, North America, and other locations. We have integrated a secure digital interface where diaspora clients can view updated daily log reports, read engineering audit coordinates, review receipts, and track dynamic project checklists in real-time. Payments are securely managed via bank transfers to our local corporate bank accounts (e.g. Afriland First Bank or SG Cameroun), removing any risk of informal family diversion."
    }
  ];

  const filteredFaqs = activeTab === "all" ? faqData : faqData.filter(item => item.category === activeTab);

  return (
    <div className="w-full bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 mt-12 flex flex-col gap-8 font-sans" id="faqs-reception-section">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest font-mono">
          AdSense Compliant Knowledge Center
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center justify-center gap-2">
          <HelpCircle className="w-6 sm:w-7 h-6 sm:h-7 text-amber-500" /> Administrative & Civil FAQ
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed font-sans mt-1">
          Explore legal permitting structures, civil engineering aggregates standards, and flexible step-by-step payment terms established for corporate builders and residential investors in Cameroon.
        </p>
      </div>

      {/* Accordion Tabs selectors */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition uppercase tracking-wider cursor-pointer ${
            activeTab === "all" ? "bg-slate-900 text-white shadow-3xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          All Topics
        </button>
        <button
          onClick={() => setActiveTab("permits")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 uppercase tracking-wider cursor-pointer ${
            activeTab === "permits" ? "bg-slate-900 text-amber-400 shadow-3xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" /> Permits
        </button>
        <button
          onClick={() => setActiveTab("materials")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 uppercase tracking-wider cursor-pointer ${
            activeTab === "materials" ? "bg-slate-900 text-amber-400 shadow-3xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Shield className="w-3.5 h-3.5" /> Materials
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 uppercase tracking-wider cursor-pointer ${
            activeTab === "payments" ? "bg-slate-900 text-amber-400 shadow-3xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" /> Payments
        </button>
      </div>

      {/* QA List container */}
      <div className="flex flex-col gap-3.5 max-w-3xl mx-auto w-full">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div 
              key={faq.id} 
              className={`bg-white border rounded-2xl transition-all duration-350 overflow-hidden ${
                isOpen ? "border-amber-400/80 shadow-xs ring-1 ring-amber-300/30" : "border-slate-200 hover:border-slate-350"
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <div className="flex items-start gap-3">
                  <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    faq.category === "permits" ? "bg-blue-500" : faq.category === "materials" ? "bg-emerald-500" : "bg-amber-500"
                  }`} />
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                    {faq.question}
                  </h4>
                </div>
                <span className="p-1 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 font-sans whitespace-pre-wrap animate-fade-in bg-slate-50/55">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dynamic Permit CTA */}
      <div className="mt-4 bg-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-5 max-w-4xl mx-auto w-full border border-white/5">
        <div className="text-left flex flex-col gap-1.5">
          <h4 className="font-extrabold text-amber-400 text-xs uppercase tracking-wider">
            🚨 Embarking on a commercial project?
          </h4>
          <p className="text-xs text-slate-300 max-w-xl font-sans">
            Avoid costly municipal safety shutdowns or regulatory demolition fines. Contact our certified architect desk to launch complete legal blueprint filings.
          </p>
        </div>
        <a 
          href="#floating-connect-suite"
          onClick={() => {
            const aiBtn = document.getElementById("floating-ai-reception-button");
            if (aiBtn) aiBtn.click();
          }}
          className="text-center font-black uppercase text-[11px] tracking-wider bg-amber-500 text-slate-950 px-4 py-2.5 rounded-lg hover:bg-amber-600 transition truncate cursor-pointer shrink-0"
        >
          Consult Reception AI
        </a>
      </div>
    </div>
  );
}
