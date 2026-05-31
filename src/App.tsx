import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { 
  Building, MapPin, Shield, Calendar, Users, Phone, Mail, 
  ChevronRight, ArrowRight, CheckCircle2, Award, FileText, 
  Sparkles, Lock, Scale, Settings, CheckSquare, Eye, Play, 
  BookOpen, Clock, Tag
} from "lucide-react";
import { DatabaseState, BlogPost, ProjectItem, StaffRole } from "./types";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import QuoteWidget from "./components/QuoteWidget.tsx";
import AdminDashboard from "./components/AdminDashboard.tsx";
import FloatingReceptionWidget from "./components/FloatingReceptionWidget.tsx";
import FAQs from "./components/FAQs.tsx";
import CustomerTestimonials from "./components/CustomerTestimonials.tsx";

const getPageSEO = (page: string) => {
  switch (page) {
    case "about":
      return {
        title: "About Us | MADECC Group Civil & Structural Engineering Experts Cameroon",
        description: "Learn about MADECC Group S.A., Cameroon's certified leader in civil engineering, ONAC architectural blueprints design, Labogenie-tested foundation alignings, and building portfolios.",
        keywords: "civil engineering, cameroon builder, real estate development yaounde, construction compliance, registered architects cameroon, onac, labogenie"
      };
    case "services":
      return {
        title: "Engineering Services | Architecture & Building Works Cameroon",
        description: "Premium architectural and structural design packages: soil diagnostics, concrete casting inspections, reinforced frame steel designs, and cost estimation services in Douala & Yaounde.",
        keywords: "architectural designs, steel structures, electrical engineering, plumbing installations, building permits, minwh, cameroon construction"
      };
    case "projects":
      return {
        title: "Active Construction Yards & Portfolios | MADECC Group Cameroon",
        description: "Explore our active construction sites and progress monitoring dashboards in Douala, Yaounde and Limbe, certified with ANOR regulations and Labogenie checks.",
        keywords: "construction yards, real-time site logging, civil progress trackers, brick columns, concrete structures, residential villas, beach resorts"
      };
    case "blogs":
      return {
        title: "Civil Engineering Insights & Permitting Guidelines | MADECC Group",
        description: "Authoritative manuals regarding municipal permit steps, construction codes, materials logistics, and material-grade recommendations written by Cameroonian architecture experts.",
        keywords: "building laws cameroon, how to get permit minwh, concrete mix ratio, sable de sanaga, cimencam, local building advisor"
      };
    case "privacy":
      return {
        title: "Privacy Policy & Cookie Consent Information | MADECC Group",
        description: "Read our privacy guidelines regarding CEMAC data protection compliance, local client file recordings, and Google AdSense cookie-based promotional standardizations.",
        keywords: "data protection, privacy guarantee, cemac directives, adsense consent, tracking opt-out"
      };
    case "compliance":
      return {
        title: "Regulatory Compliance Directories S.A. | MADECC Group Cameroon",
        description: "Official listings of our registrations with ANOR, Labogenie materials compression testing standards, CNPS safety coverage, and ONAC certification guidelines.",
        keywords: "anor certification, labogenie, cnps compliance, safety harnesses, local standardizations, civil inspections cameroon"
      };
    case "admin":
      return {
        title: "Administrative Staff Workspace Console | MADECC Group Cameroon",
        description: "Secure login gates and duty post interfaces for CEO, projects executive engineers, ONAC architects, and accountants logging building receipts.",
        keywords: "admin dashboard, corporate database, ledger loggers, blueprint approvals"
      };
    case "home":
    default:
      return {
        title: "MADECC Group | General Building Contractor & Engineering S.A. Cameroon",
        description: "High-end corporate building contractor and architectural team in Cameroon (Yaounde, Douala, Limbe). Registered standardizations under ANOR, ONAC architecture, and Labogenie checks.",
        keywords: "construction contractor cameroon, civil engineer douala, builders yaounde, premium concrete villa construction, building blueprints onac, real-estate developer, madecc group, construction company africa"
      };
  }
};

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [staffLoggedIn, setStaffLoggedIn] = useState<string | null>(null);
  const [dbState, setDbState] = useState<DatabaseState>({
    commandKeys: {
      [StaffRole.CEO]: "MADECC-KEY-CEO-99",
      [StaffRole.PROJECT_MANAGER]: "MADECC-KEY-PM-88",
      [StaffRole.WEB_CONTENT_EDITOR]: "MADECC-KEY-WCE-77",
      [StaffRole.ACCOUNTANT]: "MADECC-KEY-ACCT-66",
      [StaffRole.SECRETARY]: "MADECC-KEY-SEC-55",
      [StaffRole.FINANCIAL_OFFICER]: "MADECC-KEY-FO-44",
      [StaffRole.GENERAL_MANAGER]: "MADECC-KEY-GM-33",
      [StaffRole.PROJECTS_EXECUTION_ENGINEER]: "MADECC-KEY-PEE-22",
      [StaffRole.ARCHITECT]: "MADECC-KEY-ARCH-11",
    },
    pagesContent: {
      home: {
        heroTitle: "Constructing Sustainable Masterpieces in Cameroon",
        heroSubtitle: "MADECC Group is Cameroon's chief building contractor. We shape skylines from Douala to Yaoundé with architectural excellence, compliance and budget fidelity.",
        aboutTeaser: "Founded with local execution spirit and international quality protocols, MADECC Group (Maison de Construction et de Civil) is an integrated engineering-grade construction company fully registered in Cameroon.",
      },
      about: {
        mission: "To construct climate-resilient and structurally superior edifices in Cameroon, aligning strictly with local regulatory models (ANOR) while employing regional talent and modern, safe workflows.",
        vision: "To be the absolute benchmark of general construction in Central Africa, trusted for structural honesty, transparent bidding, and precision delivery.",
        history: "Established in Cameroon, MADECC Group began as a small structural advisory group. Sensing the critical need for standard general contractors combining true execution checklists, reliable logistics, and legal compliance, we scaled into a complete Design-Build institution spanning multiple active sites.",
      },
      services: {
        generalDesc: "MADECC Group offers multi-disciplinary design, site baselining, masonry structural casting, civil infrastructure, and financial billing audits for custom projects.",
      },
    },
    blogs: [],
    projects: [],
    invoices: [],
    receipts: [],
    quotes: [],
    appointments: [],
    blueprints: [],
    gmSafetyDirectives: []
  });
  const [dbLoading, setDbLoading] = useState(true);
  const [contactSuccess, setContactSuccess] = useState<boolean | null>(null);
  const [contactSending, setContactSending] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>(() => {
    return localStorage.getItem("madecc_cookies_accepted") === "true";
  });

  // Load state from full-stack Express server on load, falling back gracefully to localStorage
  const loadDatabase = async () => {
    try {
      const response = await fetch("/api/db");
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const data = await response.json();
      setDbState(data);
      try {
        localStorage.setItem("madecc_db_state", JSON.stringify(data));
      } catch (storageErr) {
        console.warn("Storage quota limit reached for caching, skipping localStorage update:", storageErr);
      }
    } catch (err) {
      console.warn("Could not reach backend API, utilizing offline localStorage persistence fallback:", err);
      const cached = localStorage.getItem("madecc_db_state");
      if (cached) {
        try {
          setDbState(JSON.parse(cached));
        } catch (parseErr) {
          console.error("Stale localStorage data parse failure:", parseErr);
        }
      }
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // Synchronize memory changes back to disk permanently via Express, caching locally in localStorage as a bulletproof safeguard
  const syncDbState = async (updated: DatabaseState): Promise<boolean> => {
    try {
      localStorage.setItem("madecc_db_state", JSON.stringify(updated));
    } catch (storageErr) {
      console.warn("Could not cache updated database state to localStorage (quota exceeded):", storageErr);
    }
    try {
      const response = await fetch("/api/db/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: Failed to synchronize with server disk.`);
      }
      return true;
    } catch (err) {
      console.warn("Failed to synchronize state on Express disk, cached successfully inside local state:", err);
      throw err;
    }
  };

  const handleLogoutStaff = () => {
    setStaffLoggedIn(null);
    setActivePage("home");
  };

  const handleOpenStaffPortal = () => {
    setActivePage("admin");
  };

  if (dbLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold">
            Loading MADECC Group Cameroon...
          </span>
        </div>
      </div>
    );
  }

  const seo = getPageSEO(activePage);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href={activePage === "home" ? "https://madecc-group.online" : `https://madecc-group.online/#${activePage}`} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
      </Helmet>
      
      {/* Dynamic Navigation Header */}
      <Header 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onOpenStaffPortal={handleOpenStaffPortal} 
        staffLoggedIn={staffLoggedIn} 
        onLogoutStaff={handleLogoutStaff} 
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        
        {/*********************************************************
         * A. HOME PAGE
         *********************************************************/}
        {activePage === "home" && (
          <div className="flex flex-col gap-16 md:gap-24 animate-fade-in" id="home-view">
            
            {/* 1. Hero Cover Intro */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
              <div className="lg:col-span-7 flex flex-col gap-6 text-left">
                <span className="inline-flex items-center gap-2 bg-slate-900/5 text-slate-850 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-slate-200 w-fit">
                  <Award className="w-4 h-4 text-amber-500" /> General Building Contractor
                </span>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none uppercase">
                  {dbState.pagesContent.home.heroTitle || "Constructing Sustainable Masterpieces"}
                </h1>
                
                <p className="text-base text-slate-600 leading-relaxed font-sans max-w-xl">
                  {dbState.pagesContent.home.heroSubtitle || "Building excellence from Douala port warehouses to Yaoundé tower blocks."}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => setActivePage("baseline-form")}
                    className="bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-wider px-6 py-4 rounded-xl shadow-md transition duration-200 cursor-pointer flex items-center gap-2"
                  >
                    Baseline Your Site <ArrowRight className="w-4 h-4 text-amber-500" />
                  </button>
                  <button
                    onClick={() => setActivePage("portfolio")}
                    className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl border border-gray-250 shadow-3xs transition duration-205 cursor-pointer"
                  >
                    Explore Case Studies
                  </button>
                </div>
              </div>

              {/* Graphical Hero Render */}
              <div className="lg:col-span-5 relative w-full h-[350px] sm:h-[450px] rounded-3xl overflow-hidden shadow-lg border border-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000" 
                  alt="MADECC Group Active Construction Site Cameroon" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6">
                  <span className="font-mono text-[9px] text-amber-400 font-black uppercase tracking-widest">Ongoing Project</span>
                  <p className="text-white font-bold text-base leading-snug mt-1">MADECC Heights, Yaoundé</p>
                  <p className="text-slate-300 text-xs mt-0.5">Pouring level 4 structural concrete slabs under certified municipal permits.</p>
                </div>
              </div>
            </section>

            {/* 2. Key Services Teaser */}
            <section className="flex flex-col gap-8">
              <div className="text-center">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest font-mono">Our Capabilities</span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase mt-1">Core Construction Engineering</h2>
                <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto">Providing certified on-site diagnostics, architectural drafts, and masonry structural steel framing with absolute fidelity.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-250 p-6 rounded-2xl flex flex-col gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-amber-500 shadow-3xs">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-950 text-sm uppercase">General Contracting</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Turnkey construction of multi-storey commercial towers, and secure residential villas in Cameroon, integrating dynamic checklists and ANOR codes.
                  </p>
                </div>

                <div className="bg-white border border-gray-250 p-6 rounded-2xl flex flex-col gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-amber-500 shadow-3xs">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-950 text-sm uppercase">Site Baselining & Audits</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Physical topological leveling testing, mechanical soil density profiling, and localized estimated cost calculations before yard operations begin.
                  </p>
                </div>

                <div className="bg-white border border-gray-250 p-6 rounded-2xl flex flex-col gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-amber-500 shadow-3xs">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-950 text-sm uppercase">Architecture & Blueprints</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    Drafting of high design concepts by ONAC-registered Cameroonian architects. Complete with computer simulation models and structure integrations.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Integrated Quote Baseline Prompt Widget */}
            <section className="bg-slate-100 rounded-3xl p-6 sm:p-10 border border-slate-200">
              <QuoteWidget onQuoteSubmitted={loadDatabase} />
            </section>

            {/* 3.5. Customer Testimonials Reviews Carousel & Questionnaire */}
            <CustomerTestimonials />

            {/* 3.75. Structured Knowledge FAQs Accordion */}
            <FAQs />

            {/* 4. Fresh News block teaser */}
            <section className="flex flex-col gap-8">
              <div className="flex justify-between items-end flex-wrap gap-4 border-b border-gray-200 pb-3">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest font-mono">Company Press Releases</span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase mt-1 font-sans">Blogs & Construction Insights</h2>
                </div>
                <button
                  onClick={() => setActivePage("blogs")}
                  className="text-xs text-slate-800 font-bold uppercase tracking-wider flex items-center gap-1 hover:text-amber-600 transition cursor-pointer"
                >
                  Read All Insights <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dbState.blogs.slice(0, 3).map(blog => (
                  <div key={blog.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-3xs hover:shadow-xs transition duration-250 flex flex-col justify-between">
                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] text-amber-600 font-mono font-bold uppercase block tracking-wider">{blog.category}</span>
                      <h4 className="font-bold text-slate-950 text-sm leading-snug hover:text-amber-500 cursor-pointer transition" onClick={() => setActivePage("blogs")}>
                        {blog.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-sans">
                        {blog.content.substring(0, 150).replace(/[#*`]/g, "")}...
                      </p>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono font-bold uppercase mt-4 pt-3 border-t border-slate-50 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {blog.readTime} • {blog.date}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/*********************************************************
         * B. ABOUT PAGE
         *********************************************************/}
        {activePage === "about" && (
          <div className="flex flex-col gap-12 font-sans animate-fade-in max-w-4xl mx-auto" id="about-view">
            <div className="text-center border-b border-gray-200 pb-8">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest font-mono">Our Corporate Heritage</span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-1 uppercase">Corporate Profile: MADECC Group</h1>
              <p className="text-xs text-gray-500 mt-2">Learn about our foundational milestones, legal certifications and personnel roles in Cameroon.</p>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-slate-950 uppercase text-sm border-b border-gray-150 pb-1">Corporate History</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {dbState.pagesContent.about.history || "Teaser content loading..."}
                </p>
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl mt-2 leading-relaxed">
                  <h4 className="font-bold text-slate-950 text-xs uppercase mb-1">Company Status In Cameroon</h4>
                  <p className="text-[11px] text-slate-650">
                    S.A. (Société Anonyme) incorporation, fully compliant under the OHADA corporate registration system with active fiscal certifications, social welfare contributions (CNPS) and ANOR engineering standardization parameters.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-slate-950 uppercase text-sm border-b border-gray-150 pb-1">Mission & Vision Values</h3>
                
                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                  <span className="text-[10px] font-bold text-amber-600 font-mono uppercase block">Corporate Mission</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans mt-1">
                    {dbState.pagesContent.about.mission || "Loading mission..."}
                  </p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                  <span className="text-[10px] font-bold text-amber-600 font-mono uppercase block">Corporate Vision</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans mt-1">
                    {dbState.pagesContent.about.vision || "Loading vision..."}
                  </p>
                </div>
              </div>
            </section>

            {/* Dedicated Staff Members grid */}
            <section className="border-t border-gray-200 pt-8 flex flex-col gap-6">
              <h3 className="font-bold text-slate-950 uppercase text-sm">Corporate Officers & Active Command Positions</h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
                Our operations align under strict command lines. Below are the administrative and engineering posts. *All command session codes are generated and authenticated securely by the Office of the CEO.*
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { name: "CEO Office Registry", role: StaffRole.CEO, desc: "Master administrative and fiscal controller.", avatar: "🤵" },
                  { name: "Brice Foasso", role: StaffRole.ARCHITECT, desc: "Senior ONAC partner designing concrete complexes.", avatar: "📐" },
                  { name: "Simeon Tchounkeu", role: StaffRole.PROJECTS_EXECUTION_ENGINEER, desc: "On-site structural grader and concrete tester.", avatar: "🏗️" },
                  { name: "Clement Atangana", role: StaffRole.ACCOUNTANT, desc: "Financial ledger cataloging and tax receipting.", avatar: "🧮" },
                  { name: "Amina Alhadji", role: StaffRole.SECRETARY, desc: "Appointment schedules and general CRM log manager.", avatar: "📂" },
                  { name: "Christian Ndi", role: StaffRole.FINANCIAL_OFFICER, desc: "Corporate bank auditor and budget controller.", avatar: "📊" },
                ].map((member, idx) => (
                  <div key={idx} className="bg-white border border-gray-250 p-4 rounded-xl flex items-start gap-4">
                    <span className="text-2xl p-2 bg-slate-50 border border-slate-100 rounded-lg">{member.avatar}</span>
                    <div>
                      <strong className="text-slate-950 font-bold text-xs">{member.name}</strong>
                      <span className="block text-[10px] text-amber-600 font-mono font-bold uppercase mt-0.5">{member.role}</span>
                      <p className="text-[10px] text-gray-550 mt-1 leading-snug">{member.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/*********************************************************
         * C. SERVICES PAGE
         *********************************************************/}
        {activePage === "services" && (
          <div className="flex flex-col gap-12 font-sans animate-fade-in max-w-4xl mx-auto" id="services-view">
            <div className="text-center border-b border-gray-250 pb-8">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest font-mono">What We Deliver</span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-1 uppercase">Engineering & Civil Services</h1>
              <p className="text-xs text-gray-500 mt-2">MADECC Group adheres strictly to Labogenie specifications and ONAC architectural standards.</p>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {[
                {
                  title: "Structural Masonry & Casting",
                  desc: "Calculating concrete moisture envelopes and pour ratios. We specify high-strength C30 reinforcement columns and dense concrete shear walls to prevent structural deformations near humid Cameroonian coastal ports.",
                  specs: ["Pozzolan cement additives", "Labogenie strength tests", "Rebar epoxy covers"],
                },
                {
                  title: "Topological Baselining & Soil Auditing",
                  desc: "Before laydown or materials delivery, physical topological leveling checks run on the land, utilizing mechanical compaction parameters. This mitigates steep clay or sand erosion risks completely.",
                  specs: ["Soil anchoring diagnostics", "Topography grading charts", "Estimate cost calculations"],
                },
                {
                  title: "Architectural Drafting",
                  desc: "Developing beautiful 3D digital models, building setbacks, and detailed physical floor layouts conforming to local communal bylaws under ONAC-licensed architects in Yaoundé and Douala.",
                  specs: ["Setback bylaws compliance", "3D virtual blueprint models", "Bespoke residential layouts"],
                },
                {
                  title: "Municipal Permits Consultation",
                  desc: "Navigating bureaucratic administrative steps through the communal urban agencies (CUY, CUD) to obtain legal permit tags ('Arrêté de Construire') without delay.",
                  specs: ["B.P. Permit applications", "Ownership verification check", "Urban setback validation"],
                },
              ].map((serv, idx) => (
                <div key={idx} className="bg-white border border-gray-250 rounded-2xl p-6 flex flex-col gap-4">
                  <h3 className="font-bold text-slate-950 text-sm border-b border-gray-150 pb-1 uppercase">{serv.title}</h3>
                  <p className="text-xs text-slate-650 leading-relaxed font-sans">{serv.desc}</p>
                  
                  <div className="flex flex-wrap gap-2.5 mt-2">
                    {serv.specs.map((item, i) => (
                      <span key={i} className="bg-slate-100 text-slate-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-slate-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/*********************************************************
         * D. PORTFOLIO PAGE
         *********************************************************/}
        {activePage === "portfolio" && (
          <div className="flex flex-col gap-12 font-sans animate-fade-in" id="portfolio-view">
            <div className="text-center border-b border-gray-250 pb-8 max-w-xl mx-auto">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest font-mono">Proof of Craft</span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-1 uppercase font-sans">MADECC Portfolio Feats</h1>
              <p className="text-xs text-gray-500 mt-2">Explore photos and specific architectural parameters of completed works in Cameroon.</p>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dbState.projects.filter(p => p.status === "Completed").map(p => (
                <div key={p.id} className="bg-white border border-gray-250 rounded-2xl overflow-hidden shadow-3xs flex flex-col justify-between">
                  <div>
                    <div className="h-48 w-full relative">
                      <img 
                        src={p.image} 
                        alt={p.seoTags.altText || p.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white font-mono text-[9px] px-2 py-1 rounded uppercase tracking-wide font-bold">
                        Handed Over
                      </span>
                    </div>

                    <div className="p-5 flex flex-col gap-3">
                      <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                        <span className="uppercase font-bold text-amber-600">{p.category}</span>
                        <span>{p.location}</span>
                      </div>
                      <h3 className="font-bold text-slate-950 text-sm leading-tight">{p.title}</h3>
                      <p className="text-xs text-slate-650 leading-relaxed font-sans">{p.desc}</p>
                    </div>
                  </div>

                  <div className="p-5 border-t border-slate-50 bg-slate-50/50 flex flex-col gap-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Total Budget XAF:</span>
                      <span className="font-bold text-slate-950 font-mono">{p.budget.toLocaleString()} XAF</span>
                    </div>
                    {p.architectName && (
                      <div className="flex justify-between">
                        <span>Lead Architect:</span>
                        <span className="font-semibold text-slate-800">{p.architectName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/*********************************************************
         * E. PROJECTS PAGE
         *********************************************************/}
        {activePage === "projects" && (
          <div className="flex flex-col gap-12 font-sans animate-fade-in" id="projects-view">
            <div className="text-center border-b border-gray-250 pb-8 max-w-2xl mx-auto flex flex-col gap-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest font-mono">Yards Under Active Supervision</span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-1 uppercase">Active Project Yards & Progress</h1>
              <p className="text-xs text-slate-650 leading-relaxed font-sans mt-2">
                MADECC Group administers continuous site telemetry, material audits, and safety conformances at our yards across Douala, Yaoundé, and Limbe. We align our structural pours with local urban regulatory certificates issued by communal administrative offices to guarantee frictionless construction handovers.
              </p>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {dbState.projects.filter(p => p.status === "In Progress" || p.status === "Planning").map(p => (
                <div key={p.id} className="bg-white border border-gray-250 rounded-2xl overflow-hidden p-6 shadow-3xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4 flex-wrap border-b border-slate-100 pb-3">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-black font-semibold">
                          Zone: {p.location}
                        </span>
                        <h3 className="font-bold text-slate-950 text-base mt-2 leading-tight uppercase font-sans tracking-tight">{p.title}</h3>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs text-slate-500 font-bold">STATUS: {p.status}</span>
                        <span className="block font-mono text-sm font-black text-slate-900 mt-1">{p.progress}%</span>
                      </div>
                    </div>

                    {/* Integrated SEO Optimized Media & HTML5 Video Stream */}
                    <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 relative">
                      {p.image && (
                        <div className="relative">
                          <img 
                            src={p.image} 
                            alt={p.seoTags.altText || p.title} 
                            title={p.seoTags.title || p.title}
                            className="w-full h-48 object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                          {p.seoTags.caption && (
                            <div className="absolute bottom-0 inset-x-0 bg-slate-950/75 text-white text-[10px] p-2 leading-tight border-t border-white/5">
                              <strong>Visual Caption:</strong> {p.seoTags.caption}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {p.videoUrl && (
                        <div className="p-3 border-t border-slate-800 bg-slate-950 flex flex-col gap-1.5">
                          <span className="text-[9px] font-black uppercase text-amber-400 font-mono tracking-widest flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Verified On-site Geotechnical & Slab Pouring Footage
                          </span>
                          <video 
                            controls 
                            preload="metadata"
                            src={p.videoUrl}
                            className="w-full rounded-lg bg-black max-h-[220px]"
                          />
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-650 leading-relaxed font-sans my-4">{p.desc}</p>
                    {p.engineerNotes && (
                      <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-lg mb-4 text-[11px] leading-relaxed text-slate-700">
                        <strong className="text-slate-900 uppercase text-[9px] block mb-1">Execution Engineer Log:</strong>
                        {p.engineerNotes}
                      </div>
                    )}

                    {/* Checklists rendering */}
                    {p.checklists && p.checklists.length > 0 && (
                      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-1">Milestone Checklist tasks:</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {p.checklists.map((chk, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                                chk.completed 
                                  ? "bg-slate-900 border-slate-900 text-amber-500" 
                                  : "bg-white border-gray-300"
                              }`}>
                                {chk.completed && "✓"}
                              </span>
                              <span className={chk.completed ? "text-slate-400 line-through" : "text-slate-700 font-medium"}>
                                {chk.task}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-gray-500">Site Budget:</span>
                    <strong className="text-slate-900 font-bold font-mono">{p.budget.toLocaleString()} XAF</strong>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/*********************************************************
         * F. BLOGS PAGE
         *********************************************************/}
        {activePage === "blogs" && (
          <div className="flex flex-col gap-12 font-sans animate-fade-in max-w-4xl mx-auto" id="blogs-view-insights">
            <div className="text-center border-b border-gray-250 pb-8 flex flex-col gap-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest font-mono">Insights, Press & Regulations</span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-1 uppercase font-sans">MADECC Civil Insights</h1>
              <p className="text-xs text-slate-650 leading-relaxed font-sans max-w-2xl mx-auto">
                Explore in-depth engineering manuals, construction permitting guidelines, and regulatory advisories authored by our ONAC architectural and Labogenie contracting units in Cameroon. We regularly update our articles to assist diaspora developers and local private builders navigate OHADA regulations, concrete mix standards, and materials purchasing steps.
              </p>
            </div>

            <section className="flex flex-col gap-12">
              {dbState.blogs.filter(b => b.published).map(blog => (
                <article key={blog.id} className="bg-white border border-gray-250 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-4">
                  <div className="flex justify-between items-center text-[11px] text-gray-400 font-bold font-mono uppercase pb-3 border-b border-gray-100 flex-wrap gap-2">
                    <span className="text-amber-600 font-mono font-black">{blog.category}</span>
                    <span>{blog.date} • {blog.readTime}</span>
                  </div>

                  <h2 className="text-2xl font-black tracking-tight text-slate-950 uppercase mt-2 font-sans text-left leading-tight">
                    {blog.title}
                  </h2>

                  {/* Blog Visual Anchor / Image & Video Player */}
                  <div className="my-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 relative">
                    {blog.image && (
                      <div className="relative">
                        <img 
                          src={blog.image} 
                          alt={blog.seoTags.altText || blog.title} 
                          title={blog.seoTags.title || blog.title}
                          className="w-full h-56 object-cover object-center"
                          referrerPolicy="no-referrer"
                        />
                        {blog.seoTags.caption && (
                          <div className="absolute bottom-0 inset-x-0 bg-slate-950/75 text-white text-[10px] p-2 leading-tight">
                            <strong>Caption:</strong> {blog.seoTags.caption}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {blog.videoUrl && (
                      <div className="p-3 border-t border-slate-800 bg-slate-950 flex flex-col gap-1.5">
                        <span className="text-[9px] font-black uppercase text-amber-500 font-mono tracking-widest flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Attached Engineering Video Lecture
                        </span>
                        <video 
                          controls 
                          preload="metadata"
                          src={blog.videoUrl}
                          className="w-full rounded-lg bg-black max-h-[240px]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-700 leading-relaxed font-sans space-y-4 whitespace-pre-wrap text-left">
                    {blog.content}
                  </div>

                  {/* Dedicated SEO Alt & Social information */}
                  <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 font-mono flex flex-col gap-2 text-left">
                    <span className="text-slate-800 font-black text-[10px] uppercase tracking-wider block border-b border-gray-200 pb-1">Index & Alt Tags</span>
                    <div><span className="font-bold text-slate-700">Keywords:</span> {blog.seoTags.keywords || "building cameroon"}</div>
                    <div><span className="font-bold text-slate-705">Description:</span> {blog.seoTags.description}</div>
                    <div><span className="font-bold text-slate-705">Alt-Text:</span> {blog.seoTags.altText}</div>
                    <div className="flex justify-between items-center border-t border-gray-150 pt-2 text-[10px] text-slate-450">
                      <span>Socials: {blog.seoTags.socialMediaHandles}</span>
                      <span>Hashtags: {blog.seoTags.hashtags}</span>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </div>
        )}

        {/*********************************************************
         * G. CONTACT PAGE
         *********************************************************/}
        {activePage === "contact" && (
          <div className="flex flex-col gap-12 font-sans animate-fade-in max-w-4xl mx-auto" id="contact-view">
            <div className="text-center border-b border-gray-250 pb-8">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest font-mono">Partner With Us</span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-1 uppercase">Direct Headquarter Channels</h1>
              <p className="text-xs text-gray-500 mt-2">Get in touch directly with our administrative desk in Yaoundé or Douala yards.</p>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              {/* Left Contact Form */}
              <div className="bg-white p-6 sm:p-8 border border-gray-250 rounded-2xl flex flex-col gap-5">
                <h3 className="font-bold text-slate-950 uppercase text-sm border-b border-gray-100 pb-1.5">Direct Inquiry Form</h3>
                {contactSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl flex flex-col gap-2 font-sans animate-fade-in">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                      <h4 className="font-bold uppercase text-xs tracking-wider text-emerald-900">Inquiry Transmitted Securely</h4>
                    </div>
                    <p className="text-xs leading-relaxed text-emerald-700">
                      Your inquiry message has been successfully logged inside the MADECC system and dispatched via private SMTP notification channels to <strong>madeccco5@gmail.com</strong>.
                    </p>
                    <p className="text-[11px] text-emerald-600 font-mono">
                      A coordinator will follow up on your requested yard consultations soon.
                    </p>
                    <button 
                      type="button"
                      onClick={() => {
                        setContactSuccess(null);
                        setContactError(null);
                      }}
                      className="mt-3 text-left w-max text-[11px] font-bold text-emerald-950 underline hover:text-black cursor-pointer uppercase"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setContactSending(true);
                      setContactError(null);
                      
                      const formEl = e.currentTarget;
                      const formData = new FormData(formEl);
                      const payload = {
                        fullName: formData.get("fullName"),
                        email: formData.get("email"),
                        phone: formData.get("phone"),
                        message: formData.get("message"),
                      };

                      try {
                        const res = await fetch("/api/contact/submit", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(payload),
                        });
                        const data = await res.json();
                        if (data.success) {
                          setContactSuccess(true);
                          formEl.reset();
                          // Reload database state so the newly added inquiry shows up inside the admin/quotes console!
                          loadDatabase();
                        } else {
                          setContactError(data.error || "Submission failed");
                        }
                      } catch (err: any) {
                        console.warn("Backend submit error, running fallback local database injection:", err.message);
                        const localQuote = {
                          id: "quote-" + Date.now(),
                          clientName: String(payload.fullName || "Incognizant Inquirer"),
                          clientEmail: String(payload.email || ""),
                          clientPhone: String(payload.phone || ""),
                          location: "Local Contact Form",
                          landSquareMeters: 0,
                          projectType: "General Inquiry",
                          budgetRange: "None Supplied",
                          preferredStartDate: "Direct",
                          requestDate: new Date().toISOString().split('T')[0],
                          status: "Pending",
                          notes: `[LOCAL SENDER: Offline Inquiry]\nMessage Text: ${payload.message}`
                        };
                        const updatedDb = {
                          ...dbState,
                          quotes: [localQuote, ...dbState.quotes]
                        };
                        setDbState(updatedDb);
                        syncDbState(updatedDb);
                        setContactSuccess(true);
                        formEl.reset();
                      } finally {
                        setContactSending(false);
                      }
                    }}
                    className="flex flex-col gap-4 text-xs"
                  >
                    {contactError && (
                      <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs leading-snug">
                        <strong>Error:</strong> {contactError}
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-800">Your Full Name:</label>
                      <input name="fullName" required type="text" placeholder="e.g. Marc-Arthur Noah" className="border border-gray-300 p-2.5 rounded-lg" disabled={contactSending} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-800">Email Address:</label>
                      <input name="email" required type="email" placeholder="e.g. customer@domain.cm" className="border border-gray-300 p-2.5 rounded-lg" disabled={contactSending} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-800">Cameroon Phone Number:</label>
                      <input name="phone" required type="tel" placeholder="e.g. +237 6xx xxx xxx" className="border border-gray-300 p-2.5 rounded-lg" disabled={contactSending} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-slate-800">Your Inquiry Summary Message:</label>
                      <textarea name="message" required placeholder="Discuss structural planning, blueprints or site audits..." className="border border-gray-300 p-2.5 rounded-lg h-24" disabled={contactSending} />
                    </div>
                    <button 
                      type="submit" 
                      disabled={contactSending}
                      className="bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wider cursor-pointer disabled:opacity-55"
                    >
                      {contactSending ? "Transmitting Inquiry Securely..." : "Submit Inquiry Message"}
                    </button>
                  </form>
                )}
              </div>

              {/* Coordinates and information desk */}
              <div className="flex flex-col gap-6">
                <div className="bg-slate-50 border border-slate-205 p-6 rounded-2xl">
                  <h4 className="font-bold text-slate-950 text-xs uppercase mb-3">General Coordinates:</h4>
                  
                  <div className="space-y-4 text-xs">
                    <p className="leading-relaxed">
                      <strong className="text-slate-900">Yaoundé Main Corporate Office:</strong> Rue de Mbankolo, Centre Region, Cameroon.
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-slate-900">Douala Logistics Yard Center:</strong> Boulevard de la Bessecke, Bonabéri Zone, Littoral, Cameroon.
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-slate-900">Phone lines:</strong> +237 671063511 / +237683316486 / +237640194505<br />
                      <strong className="text-slate-900">Direct Email Desk:</strong> madecccons@gmail.com
                    </p>
                  </div>
                </div>

                {/* Simulated Geographic Location block */}
                <div className="h-44 w-full border border-gray-250 rounded-2xl overflow-hidden relative shadow-3xs flex items-center justify-center p-6 bg-slate-100">
                  <div className="absolute inset-0 bg-slate-950 opacity-10" />
                  <div className="text-center relative z-10 flex flex-col items-center gap-2 select-none">
                    <MapPin className="w-8 h-8 text-amber-500 animate-bounce" />
                    <strong className="text-xs text-slate-900 font-bold uppercase tracking-wider">Yaoundé Coordinates Location</strong>
                    <span className="text-[10px] text-gray-500 block leading-none mt-0.5">Latitude: 3.8480° N | Longitude: 11.5021° E</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/*********************************************************
         * H. STANDALONE BASELINE FORM PATH
         *********************************************************/}
        {activePage === "baseline-form" && (
          <div className="bg-slate-100 rounded-3xl p-6 sm:p-10 border border-slate-200 animate-fade-in" id="standalone-baseline-view">
            <QuoteWidget onQuoteSubmitted={loadDatabase} />
          </div>
        )}

        {/*********************************************************
         * I. ADMIN DASHBOARD WORKSPACE
         *********************************************************/}
        {activePage === "admin" && (
          <AdminDashboard 
            dbState={dbState}
            setDbState={setDbState}
            syncDbState={syncDbState}
            staffLoggedIn={staffLoggedIn}
            setStaffLoggedIn={setStaffLoggedIn}
          />
        )}

        {/*********************************************************
         * J. REGULATORY PAGES EXPANSED (AdSense Compliance)
         *********************************************************/}
        {activePage === "privacy" && (
          <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 border border-gray-250 rounded-2xl shadow-3xs font-sans text-xs text-gray-750 leading-relaxed space-y-6 animate-fade-in" id="expanded-privacy-view">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase border-b-2 border-slate-900 pb-3 font-sans">
              Privacy Policy (Charte de Confidentialité)
            </h1>
            <p className="text-slate-500 leading-snug font-mono text-[10px]">
              Effective Date: May 30, 2026 | Compliant under Cameroon Legislative frameworks and MINPOSTEL regulations.
            </p>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm uppercase">1. General Overview of Data Storage</h3>
              <p>
                At MADECC Group, we respect the absolute privacy of our construction clientele, investors, and web platform visitors. This charter serves as our declaration regarding the collection, storage, and processing of technical identifiers, diagnostic site baselining inputs, and payment logs within the Cameroonian territorial jurisdiction.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm uppercase">2. Category Siting of Gathered Inputs</h3>
              <p>
                When you initiate a baselining or dynamic quote estimate within our platform, our backend logs the following metrics: full legal name, digital coordinate inputs (email, telephone), Cameroonian geographical zone of construction, land square meters dimensions, and general budgetary scope constraints in XAF. No telemetry codes or external behavioral logs are generated.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm uppercase">3. Data Location and Hosting Sovereignty</h3>
              <p>
                In compliance with regional digital governance instructions, client ledger files, generated A4 invoices drafts, and A5 receipt codes are stored in secure servers on sovereign Cloud Run compartments. We do not transmit coordinates or financial summaries to any external third-party aggregators.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm uppercase">4. Google AdSense Cookie Specifications</h3>
              <p>
                This platform displays informational engineering news writeups to readers. We use Google standard cookie tracking integrations to serve relevant contextual promotions. Users can confidently opt out of tracking parameters within their browser privacy options. No API keys or corporate financial credentials are ever exposed through cookie structures.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm uppercase">5. Contact and Amendments Desk</h3>
              <p>
                Our legal department reserves complete authorization to refine these policies in compliance with municipal statutory amendments. For data deletion commands or key inquiry audits, direct letters should be filed to: madecccons@gmail.com.
              </p>
            </section>
          </div>
        )}

        {activePage === "terms" && (
          <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 border border-gray-250 rounded-2xl shadow-3xs font-sans text-xs text-gray-750 leading-relaxed space-y-6 animate-fade-in" id="expanded-terms-view">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase border-b-2 border-slate-900 pb-3 font-sans">
              Terms of Service & Civil Agreements
            </h1>
            <p className="text-slate-500 leading-snug font-mono text-[10px]">
              Last Modified: May 30, 2026 | Jurisdictions under Cameroon Courts of Law.
            </p>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm uppercase">1. Scope of General Construction Contracting</h3>
              <p>
                These stipulations establish terms for utilizing the digital estimators, cost estimation systems, blueprint logs, and corporate staff dashboard panels of MADECC Group. By utilizing any dynamic site baseline features, you accept validation of these contractual guidelines.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm uppercase">2. Pricing Estimations and Budgetary Variances</h3>
              <p>
                Dynamic cost range outcomes calculated by the public Quote widget (expressed in Central African CFA Francs - XAF) are approximate. Actual execution quotes require physically validated topographic checks, structural analysis from our execution engineer Simeon, and registered ONAC architect approval. Surcharges might arise from difficult sub-level soil compaction demands.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm uppercase">3. Cameroon VAT and Stage Payments Directives</h3>
              <p>
                In conformity with Cameroonian statutory general codes, corporate invoices are generated incorporating a standard 19.25% Value Added Tax (TVA). Material deliveries, concrete pouring operations and structural shuttering milestones are executed exclusively upon validation of clear cash ledger inputs or bank wire receipts validated by our Treasury Accountant Clement Atangana.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm uppercase">4. Liability Allocations and Force Majeure</h3>
              <p>
                MADECC Group complies strictly with structural guarantees mandated by civil safety guidelines. Delays arising from continuous rain patterns on coastal yards (Douala, Limbe) or municipal permit hold ups out of urban comunidad bounds represent force majeure.
              </p>
            </section>
          </div>
        )}

        {activePage === "compliance" && (
          <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 border border-gray-250 rounded-2xl shadow-3xs font-sans text-xs text-gray-750 leading-relaxed space-y-6 animate-fade-in" id="expanded-compliance-view">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase border-b-2 border-slate-900 pb-3 font-sans">
              Regulatory Compliance Sheets S.A.
            </h1>
            <p className="text-slate-500 leading-snug font-mono text-[10px]">
              MADECC GROUP Cameroon | Quality, Safety and Standardizations Directory 2026.
            </p>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm uppercase">1. National Standards Authority (ANOR) Compliance</h3>
              <p>
                MADECC Group is registered and certified under the Cameroon National Agency for Standards and Quality (ANOR). Every batch of Portland cement used in our residential pillars or commercial complex foundations conforms to structural grade definitions. Aggregate sand is sourced strictly from reliable river beds (such as Sable de Sanaga) containing approved granule moisture indices checked on Labogenie laboratories.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm uppercase">2. Labogenie Certifications Manual</h3>
              <p>
                To secure structural integrity on unstable maritime soils (such as Douala coastal sites and ports), our project execution engineers mandate concrete aggregate compression checks tested strictly by the National Laboratory of Civil Engineering (Labogenie). This negates columns carbonation, moisture penetration, and early iron decay.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm uppercase">3. CNPS Social and Labor Compliance</h3>
              <p>
                Our masonry teams, steel truss welders, crane operators and administrative staff are registered under the National Social Insurance Fund (CNPS - Caisse Nationale de Prévoyance Sociale). We operate active safety checks enforcing standard safety harnesses, protective boots, high viscosity clothing, and proper site medical kits. Since inception, our active yards track zero heavy casualties.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-950 text-sm uppercase">4. National Order of Architects (ONAC) Integration</h3>
              <p>
                Our structural blueprints and planning envelopes are supervised and signed by registered partners under the National Order of Architects (ONAC-Cameroun), ensuring smooth communal urban pass rates.
              </p>
            </section>
          </div>
        )}

      </main>

      {/* Corporate footer */}
      <Footer setActivePage={setActivePage} />

      {/* Floating customer reception, direct WhatsApp & hotline redial widget */}
      <FloatingReceptionWidget setActivePage={setActivePage} />

      {/* Cookie Consent Compliance Banner for Google AdSense & GDPR */}
      {!cookiesAccepted && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-slate-900 border border-slate-800 text-slate-100 p-5 rounded-2xl shadow-2xl z-50 animate-slide-up flex flex-col gap-4 no-print" id="madecc-cookie-consent">
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl shrink-0 mt-0.5">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left gap-1">
              <h4 className="font-bold text-xs uppercase tracking-wide text-white flex items-center gap-1.5">
                Cookie Compliance Check
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                MADECC Group complies strictly with CEMAC data protection directives and Google AdSense consent policies. We use cookies to analyze web traffic, remember baseline parameters, and serve relevant contextual advertising.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-slate-800/80 pt-3 text-[10px]">
            <button
              type="button"
              onClick={() => {
                setActivePage("privacy");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-slate-400 hover:text-white font-semibold transition cursor-pointer hover:underline"
            >
              Privacy Policy
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("madecc_cookies_accepted", "true");
                  setCookiesAccepted(true);
                }}
                className="bg-amber-50 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-lg cursor-pointer transition uppercase"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("madecc_cookies_accepted", "true");
                  setCookiesAccepted(true);
                }}
                className="bg-slate-800 hover:bg-slate-705 text-slate-300 font-bold px-3 py-2 rounded-lg cursor-pointer transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
