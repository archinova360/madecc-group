import React, { useState } from "react";
import { Calculator, MapPin, Building, ChevronRight, CheckCircle2, FileText, ArrowUpRight } from "lucide-react";

interface Props {
  onQuoteSubmitted?: () => void;
}

export default function QuoteWidget({ onQuoteSubmitted }: Props) {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    location: "Yaoundé, Bastos",
    landSquareMeters: 400,
    projectType: "Residential Villa",
    budgetRange: "50,000,000 XAF - 100,000,000 XAF",
    preferredStartDate: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeCase, setActiveCase] = useState<number | null>(null);

  // Approximate pricing model in XAF per square meter for Cameroon construction
  const getPricingFactors = () => {
    switch (formData.projectType) {
      case "Commercial Complex":
        return { minRate: 260000, maxRate: 350000, label: "Commercial Multi-Storey" };
      case "Industrial Warehouse":
        return { minRate: 14000, maxRate: 210000, label: "Heavy Portal Framework" };
      case "Public Infrastructure":
        return { minRate: 300000, maxRate: 450000, label: "Civil Concrete Castings" };
      default:
        return { minRate: 180000, maxRate: 240000, label: "Premium Residential Work" };
    }
  };

  const { minRate, maxRate, label } = getPricingFactors();
  const estimatedMin = minRate * formData.landSquareMeters;
  const estimatedMax = maxRate * formData.landSquareMeters;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.clientEmail || !formData.clientPhone) {
      alert("Please fill out all mandatory contact fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/quotes/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          notes: `${formData.notes}\n[System Estimation Factor: ${label} | Dynamic range: ${estimatedMin.toLocaleString("fr-FR")} - ${estimatedMax.toLocaleString("fr-FR")} XAF]`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        if (onQuoteSubmitted) {
          onQuoteSubmitted();
        }
      } else {
        throw new Error(data.error || "Submission rejected");
      }
    } catch (err: any) {
      console.warn("API quote submit failed, executing local offline injection:", err.message);
      const localQuote = {
        id: "quote-" + Date.now(),
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        location: formData.location || "Cameroon Local",
        landSquareMeters: Number(formData.landSquareMeters) || 200,
        projectType: formData.projectType || "Residential",
        budgetRange: formData.budgetRange || "Under 50M XAF",
        preferredStartDate: formData.preferredStartDate || "Directly",
        requestDate: new Date().toISOString().split('T')[0],
        status: "Pending",
        notes: `${formData.notes}\n[LOCAL System Estimation: ${label} | Dynamic range: ${estimatedMin.toLocaleString("fr-FR")} - ${estimatedMax.toLocaleString("fr-FR")} XAF]`
      };
      
      const cached = localStorage.getItem("madecc_db_state");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          parsed.quotes = [localQuote, ...(parsed.quotes || [])];
          localStorage.setItem("madecc_db_state", JSON.stringify(parsed));
        } catch (e) {
          console.error("Local storage sync error:", e);
        }
      }
      setSuccess(true);
      if (onQuoteSubmitted) {
        onQuoteSubmitted();
      }
    } finally {
      setLoading(false);
    }
  };

  const caseStudies = [
    {
      id: 1,
      title: "Extending the Douala Port Logistics Dry Terminal",
      location: "Douala, Bonabéri Zone",
      scope: "2,500 m² heavy steel portal frame spanning 40m without central columns. Embedded under chloride-resistant pozzolanic C30/37 concrete.",
      duration: "11 Months | Delivered on Time",
      achievements: [
        "Negated maritime water penetration via low-pores micro-silica concrete additives.",
        "Staged portal welding panels using certified high durability double-primer primer coats.",
        "Passed local Communauté Urbaine de Douala (CUD) and Labogenie stress tests on first audit.",
      ],
      impact: "Boosted clearing capability of the cargo handler by 45% under local climate seasons.",
    },
    {
      id: 2,
      title: "Earthquake Resilient columns at MADECC Heights",
      location: "Yaoundé, Nlongkak",
      scope: "5-storey commercial complex featuring subterranean heavy retaining walls, shear plates, and modern cantilever balcony structures.",
      duration: "Ongoing | Phase 3 Structural Beam Slab Completed",
      achievements: [
        "Successfully excavated sub-level foundations near steep clay terrain using robust structural anchors.",
        "Obtained first-attempt ONAC order validation and municipality permit clearance papers.",
        "Consistently auditable local cement sourcing (Dangote/Cimencam Grade 42.5R) locking in material budgets.",
      ],
      impact: "Creating premium commercial offices for Yaounde startups with absolute safety benchmarks.",
    },
    {
      id: 3,
      title: "Coastal Breeze Luxury Estate Foundations",
      location: "Limbe, Down Beach Coast",
      scope: "Coastal residential estate incorporating deep hydraulic sand anchoring and salt-proof moisture shielding systems.",
      duration: "7 Months in execution | Under budget",
      achievements: [
        "Implemented deep steel reinforcement coils with thick double-coat polyurethane covers.",
        "Created custom moisture-shedding coarse external plaster models to shield seaside moisture creep.",
        "Integrated high performance local volcanic sand components to maximize cement-to-aggregate density bonds.",
      ],
      impact: "Establishing prime residential benchmarks along Cameroon's Atlantic coastlines.",
    }
  ];

  return (
    <div className="flex flex-col gap-12" id="quote-and-case-studies-block animate-fade-in">
      {/* Dynamic Header Frame */}
      <div className="text-center bg-slate-900 text-white rounded-2xl p-8 md:p-12 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500 rounded-full blur-[100px] opacity-20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[100px] opacity-20" />
        
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">
          Ready to baseline your construction site?
        </span>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-2 text-white max-w-2xl mx-auto uppercase">
          Generate an Instant Cost Estimate & Request Quote
        </h2>
        <p className="text-sm text-slate-400 mt-4 max-w-lg mx-auto">
          Our automated cost estimation matrix computes Cameroon local construction budgets based on land square meters, structural category, and general municipal standard parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cost calculation & submission form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Calculator className="w-6 h-6 text-amber-500" />
            <div>
              <h3 className="font-bold text-slate-950 text-lg uppercase">Quote Estimator</h3>
              <p className="text-xs text-gray-500">Provide land details to calculate dynamic XAF benchmarks.</p>
            </div>
          </div>

          {success ? (
            <div className="text-center py-12 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-xl text-slate-900">Request Sent Successfully!</h4>
              <p className="text-sm text-gray-500 max-w-sm">
                Thank you, your baseline request has been cataloged. Our administrative desk is routing your parameters to the Projects Execution Engineer and Architect.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg text-xs font-medium cursor-pointer"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-800">Your Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marc-Arthur Noah"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="border border-gray-300 p-3 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-800">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. client@domain.cm"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="border border-gray-300 p-3 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-800">Cameroon Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +237 6xx xxx xxx"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="border border-gray-300 p-3 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-800">Project Location Site</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="border border-gray-300 p-3 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="Yaoundé, Bastos">Yaoundé, Bastos</option>
                    <option value="Yaoundé, Nlongkak">Yaoundé, Nlongkak</option>
                    <option value="Douala, Bonabéri">Douala, Bonabéri</option>
                    <option value="Douala, Bonapriso">Douala, Bonapriso</option>
                    <option value="Limbe, Coastal Area">Limbe, Coastal Area</option>
                    <option value="Kribi, Port Surroundings">Kribi, Port Surroundings</option>
                    <option value="Bafoussam, West Region">Bafoussam, West Region</option>
                    <option value="Garoua, North Region">Garoua, North Region</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-800">Construction Category</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="border border-gray-300 p-3 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="Residential Villa">Luxury Residential Villa</option>
                    <option value="Commercial Complex">Multi-Storey Commercial Office</option>
                    <option value="Industrial Warehouse">Dry Logistics Port Warehouse</option>
                    <option value="Public Infrastructure">Civil Concrete Infrastructure</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-800">Estimated Project Start Date</label>
                  <input
                    type="date"
                    value={formData.preferredStartDate}
                    onChange={(e) => setFormData({ ...formData, preferredStartDate: e.target.value })}
                    className="border border-gray-300 p-3 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-850">
                  <span>Land Spec / Floor Sizing:</span>
                  <span className="text-amber-600 font-mono">{formData.landSquareMeters} m²</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={formData.landSquareMeters}
                  onChange={(e) => setFormData({ ...formData, landSquareMeters: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                />
                <span className="text-[10px] text-gray-400">Drag to change. Standard custom construction ranges from 100m² up to heavy logistics warehouses spanning 5,000m².</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-800">Outline Custom Structural Demands / Directives</label>
                <textarea
                  placeholder="e.g. Requiring specialized retaining pile walls, custom infinity pool, metal truss framing, high grade C30 concrete, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="border border-gray-300 p-3 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none h-20 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider shadow-xs transition duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? "Cataloging Baseline Details..." : "Submit Baseline & Request Official Quote"} <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Estimation parameters box */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col gap-4">
            <h4 className="font-bold text-slate-900 border-b border-gray-250 pb-2 text-sm uppercase tracking-wide">Dynamic Budget Calculator</h4>
            
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase uppercase">Selected Baseline Type</span>
              <p className="font-semibold text-slate-900 text-sm leading-none">{label}</p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Multiplied Area Sizing</span>
              <p className="font-mono text-slate-800 text-sm leading-none">{formData.landSquareMeters} m²</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-[9px] text-gray-400 font-mono block">MIN RATE ESTIMATE</span>
                <span className="font-mono font-bold text-sm text-slate-700">{minRate.toLocaleString()} XAF/m²</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-[9px] text-gray-400 font-mono block">MAX RATE ESTIMATE</span>
                <span className="font-mono font-bold text-sm text-slate-700">{maxRate.toLocaleString()} XAF/m²</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl mt-2 flex flex-col gap-1 relative overflow-hidden">
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wide">Estimated Cost Range (HT)</span>
              <span className="font-mono font-black text-lg text-white">
                {estimatedMin.toLocaleString("fr-FR")} - {estimatedMax.toLocaleString("fr-FR")} XAF
              </span>
              <p className="text-[9px] text-gray-400 mt-2">
                *Final rates are fully validated by the head structural execution engineer following physically audited soil mechanical tests in Cameroon.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 hover:bg-slate-100/50 border border-slate-250 p-6 rounded-2xl flex items-start gap-4 transition duration-300">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Cameroon-Wide Operations</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                MADECC Group deploys complete construction facilities, mixers, dynamic bulldozers and logistics channels anywhere across Yaoundé, Douala, Limbe, Kribi, Garoua, and West regions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Case Studies Segment */}
      <div className="mt-8 border-t border-gray-250 pt-12" id="case-studies">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">Proof of Execution</span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1 uppercase">MADECC Active Case Studies</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-2">
            Click any active project study to view concrete safety parameters and technical benchmarks achieved in Cameroon municipal areas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.map((cs, idx) => (
            <div 
              key={cs.id}
              onClick={() => setActiveCase(activeCase === idx ? null : idx)}
              className={`bg-white border rounded-2xl p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-300 ${
                activeCase === idx ? "border-amber-500 ring-2 ring-amber-500/10" : "border-gray-250"
              }`}
            >
              <div className="flex justify-between items-start mb-3 gap-4">
                <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" /> {cs.location}
                </span>
                <span className="bg-slate-900/5 hover:bg-slate-900/10 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono font-medium">
                  CASE #{cs.id}
                </span>
              </div>
              
              <h3 className="font-bold text-slate-950 text-sm hover:text-amber-500 transition duration-150 leading-tight">
                {cs.title}
              </h3>
              
              <p className="text-xs text-slate-600 text-ellipsis line-clamp-3 mt-3 leading-relaxed">
                {cs.scope}
              </p>

              {activeCase === idx && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3 animate-fade-in text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Duration Metric</span>
                    <p className="font-semibold text-slate-900">{cs.duration}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Key Feats</span>
                    <ul className="list-disc pl-4 mt-1 text-slate-600 space-y-1 leading-relaxed">
                      {cs.achievements.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Local Impact</span>
                    <p className="text-slate-600 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-normal">
                      {cs.impact}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-4 pt-3 border-t border-slate-50">
                <span>{activeCase === idx ? "Collapse Study" : "View Case Logistics Details"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
