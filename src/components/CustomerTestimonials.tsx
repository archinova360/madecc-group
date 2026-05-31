import React, { useState } from "react";
import { MessageSquare, Star, Quote, CheckCircle, User, Sparkles, Building, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  projectScope: string;
  location: string;
  quoteText: string;
  rating: number;
  date: string;
  avatarUrl?: string;
  verified: boolean;
}

export default function CustomerTestimonials() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [reviews, setReviews] = useState<Testimonial[]>([
    {
      id: "testi-1",
      name: "Eng. Marc-Arthur Noah",
      projectScope: "Turnkey Reinforced Residential Villa (6 Bedrooms)",
      location: "Yaoundé, Bastos Hilltop",
      quoteText: "After examining three separate general contractors in Centre Region, we commissioned MADECC Group for soil density baselining and complete monolithic structural casting. Since I am frequently on business trips to Paris, their daily PDF logs and digitized receipt flow was completely transformative. Absolute safety adherence conformable with municipal bylaws.",
      rating: 5,
      date: "2026-02-14",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      verified: true
    },
    {
      id: "testi-2",
      name: "Jean-Pierre Tchakounté",
      projectScope: "Commercial Port Storage Hangar (1,500 sqm)",
      location: "Douala, Bonabéri Industrial Zone",
      quoteText: "MADECC Group engineers solved crucial structural shifting issues at our maritime storage facility by deploying driven deep tension concrete piles. They coordinated with the Douala Urban Council for all environment clearance validations. Prompt milestones delivery, screened materials, and high-tensile hot-rolled steel bar rods.",
      rating: 5,
      date: "2026-04-03",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
      verified: true
    },
    {
      id: "testi-3",
      name: "Dr. Sandrine Abena",
      projectScope: "Multi-Storey Private Orthodontic Clinic",
      location: "Kribi, Littoral Boulevard Block",
      quoteText: "We wanted an architecturally complex clinic combining 3D digital floor plans with a reinforced concrete framework. The ONAC-licensed design architects from MADECC Group brought an outstanding minimalist layout that maximizes daylighting and solar setback rules. Highly recommend their Cameroon office coordinates.",
      rating: 5,
      date: "2026-05-10",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
      verified: true
    }
  ]);

  // Form states to record custom review
  const [formName, setFormName] = useState("");
  const [formScope, setFormScope] = useState("");
  const [formLocation, setFormLocation] = useState("Yaoundé, Cameroon");
  const [formReview, setFormReview] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [showSubmitMsg, setShowSubmitMsg] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formReview) return;

    const newReview: Testimonial = {
      id: "user-testi-" + Date.now(),
      name: formName,
      projectScope: formScope || "Private Foundation Project",
      location: formLocation,
      quoteText: formReview,
      rating: formRating,
      date: new Date().toISOString().split("T")[0],
      verified: false, // Must undergo coordinator vetting
    };

    setReviews([newReview, ...reviews]);
    setFormName("");
    setFormScope("");
    setFormReview("");
    setShowSubmitMsg(true);
    setActiveIdx(0); // View the newest live
    setTimeout(() => setShowSubmitMsg(false), 5000);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentTesti = reviews[activeIdx];

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 mt-12 flex flex-col gap-10 font-sans" id="testimonials-reception-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left column: Feedbacks Board carousel */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left relative min-h-[300px]">
          <div className="flex flex-col gap-1.5 border-b border-slate-800 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 font-mono">
              ★ Quality Validated by Builders
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase flex items-center gap-2">
              <MessageSquare className="w-6 sm:w-7 h-6 sm:h-7 text-amber-500" /> Client Feedbacks
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">
              Read real testaments and planning reviews from verified private estate developers, commercial clinic managers, and Cameroonian diaspora investors.
            </p>
          </div>

          {currentTesti && (
            <div className="flex flex-col gap-5 animate-fade-in py-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < currentTesti.rating ? "text-amber-500 fill-amber-500" : "text-slate-700"
                    }`} 
                  />
                ))}
              </div>

              <div className="relative">
                <Quote className="absolute -top-4 -left-3 w-8 h-8 text-slate-800 shrink-0 select-none opacity-40 rotate-180" />
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans italic pl-4 pr-2 relative z-10">
                  &ldquo;{currentTesti.quoteText}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3.5 pl-4">
                {currentTesti.avatarUrl ? (
                  <img 
                    src={currentTesti.avatarUrl} 
                    alt={currentTesti.name} 
                    className="w-10 h-10 rounded-full object-cover border border-amber-500 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div className="text-left">
                  <h5 className="font-bold text-slate-100 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                    {currentTesti.name}
                    {currentTesti.verified ? (
                      <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-mono px-1.5 py-0.5 rounded-full uppercase border border-emerald-500/30">
                        ✓ Verified Client
                      </span>
                    ) : (
                      <span className="bg-amber-400/10 text-amber-400 text-[8px] font-mono px-1.5 py-0.5 rounded-full uppercase border border-amber-400/20">
                        ⚡ Vetting Review
                      </span>
                    )}
                  </h5>
                  <p className="text-[10px] text-amber-500 font-medium">{currentTesti.projectScope}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5 font-mono">{currentTesti.location} • Submitted {currentTesti.date}</p>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2 mt-4 self-start">
            <button 
              onClick={handlePrev}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition cursor-pointer text-slate-300 hover:text-white"
              title="Previous testimony"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest px-1">
              {activeIdx + 1} / {reviews.length}
            </span>
            <button 
              onClick={handleNext}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition cursor-pointer text-slate-300 hover:text-white"
              title="Next testimony"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right column: Submit a Review Form panel */}
        <div className="lg:col-span-5 bg-slate-950/80 p-5 sm:p-6 border border-slate-800 rounded-2xl flex flex-col gap-4">
          <div className="text-left flex flex-col gap-0.5">
            <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider font-mono">Feedback Desk</span>
            <h4 className="font-bold text-sm uppercase text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> Share Your Experience
            </h4>
            <p className="text-[11px] text-slate-400">Your transparent physical construction feedback helps our ONAC architects keep engineering standards. All reviews undergo strict QA checks.</p>
          </div>

          {showSubmitMsg && (
            <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-xl text-xs flex flex-col gap-1 animate-fade-in font-sans">
              <div className="font-bold flex items-center gap-1 uppercase text-[10px]">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Review Submitted Successfully!
              </div>
              <p className="text-[10px] text-emerald-400/80">Thank you! Your feedback will show instantly inside the active client carousel and remains visible during this browsing session.</p>
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="flex flex-col gap-3 text-xs text-left">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-300 text-[10px] uppercase">Corporate Name or Initials:</label>
              <input 
                required 
                type="text" 
                placeholder="e.g. Marcelle Atangana"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white rounded-lg p-2 focus:outline-none focus:border-slate-700 text-xs" 
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-300 text-[10px] uppercase">Project Type Scope:</label>
                <input 
                  type="text" 
                  placeholder="e.g. 4 Bedroom Slab"
                  value={formScope}
                  onChange={(e) => setFormScope(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white rounded-lg p-2 focus:outline-none focus:border-slate-700 text-xs" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-300 text-[10px] uppercase">Location Region:</label>
                <input 
                  type="text" 
                  placeholder="e.g. Douala, Bonapriso"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white rounded-lg p-2 focus:outline-none focus:border-slate-700 text-xs" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-300 text-[10px] uppercase">Rating stars:</label>
              <select 
                value={formRating}
                onChange={(e) => setFormRating(Number(e.target.value))}
                className="bg-slate-900 border border-slate-800 text-white rounded-lg p-2 focus:outline-none focus:border-slate-700 text-xs"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional Building Integrity)</option>
                <option value={4}>⭐⭐⭐⭐ (4 - Excellent Project Support)</option>
                <option value={3}>⭐⭐⭐ (3 - Satisfied Cost Alignment)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-300 text-[10px] uppercase">Detailed construction feedback:</label>
              <textarea 
                required
                rows={3}
                placeholder="Mention aggregate quality, blueprint coordination, masonry speed..."
                value={formReview}
                onChange={(e) => setFormReview(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white rounded-lg p-2 focus:outline-none focus:border-slate-705 text-xs h-16 w-full placeholder:text-gray-600" 
              />
            </div>

            <button 
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black tracking-wider text-[11px] py-2.5 rounded-lg transition uppercase flex items-center justify-center gap-1.5 cursor-pointer mt-1"
            >
              <Building className="w-3.5 h-3.5" /> Post My Review
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
