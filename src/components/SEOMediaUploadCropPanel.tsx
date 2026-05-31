import React, { useState, useEffect } from "react";
import { Upload, Crop, Sparkles, AlertCircle, CheckCircle, Smartphone, Monitor } from "lucide-react";
import { SEOMetadata } from "../types";

interface SEOMediaUploadCropPanelProps {
  title: string;
  content: string;
  image: string;
  videoUrl?: string;
  seoTags: SEOMetadata;
  onUpdateMedia: (img: string, video?: string) => void;
  onUpdateSeo: (tags: SEOMetadata) => void;
}

export default function SEOMediaUploadCropPanel({
  title,
  content,
  image,
  videoUrl,
  seoTags,
  onUpdateMedia,
  onUpdateSeo,
}: SEOMediaUploadCropPanelProps) {
  // Base media states
  const [currentImg, setCurrentImg] = useState(image || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800");
  const [currentVideo, setCurrentVideo] = useState(videoUrl || "");
  const [cropRatio, setCropRatio] = useState<"1.91:1" | "16:9" | "4:3">("1.91:1");
  const [cropBox, setCropBox] = useState({ x: 10, y: 15, w: 80, h: 70 });
  const [cropApplied, setCropApplied] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Auto crop action simulation
  const triggerAutoCropForSEO = () => {
    setCropApplied(true);
    // Simulate auto-cropping calculation based on chosen ratio
    let croppedImg = currentImg;
    if (!currentImg.includes("crop=entropy")) {
      const glue = currentImg.includes("?") ? "&" : "?";
      // Adjust standard Unsplash parameters to simulate a formal cropped dimension
      const [w, h] = cropRatio === "1.91:1" ? [1200, 630] : cropRatio === "16:9" ? [1280, 720] : [1024, 768];
      croppedImg = `${currentImg}${glue}crop=entropy&cs=tinysrgb&fit=crop&w=${w}&h=${h}&q=80`;
    }
    onUpdateMedia(croppedImg, currentVideo);
  };

  // Handle local simulation file upload for images or videos
  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadProgress(null), 1200);
          return 100;
        }
        return prev + 30;
      });
    }, 150);

    // Render local preview URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        if (type === "image") {
          setCurrentImg(reader.result);
          onUpdateMedia(reader.result, currentVideo);
          setCropApplied(false);
        } else {
          setCurrentVideo(reader.result);
          onUpdateMedia(currentImg, reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // SEO Real-time score calculator logic
  const [scoreMetrics, setScoreMetrics] = useState({
    titleOk: false,
    contentOk: false,
    keywordsOk: false,
    descriptionOk: false,
    altOk: false,
    hashtagsOk: false,
    totalScore: 0
  });

  useEffect(() => {
    const titleOk = title.trim().length > 12;
    const contentOk = content.trim().length > 150;
    
    // Check keywords (needs at least 3 comma separated segments)
    const keywordsCount = seoTags.keywords.split(",").filter(k => k.trim().length > 0).length;
    const keywordsOk = keywordsCount >= 3;

    // Meta description needs to be dense (>100 characters for indexers)
    const descriptionOk = seoTags.description.trim().length > 90;

    // Alt text is essential for image screenreaders and google image indexer
    const altOk = seoTags.altText.trim().length > 10;

    // Social hashtags are helpful
    const hashtagsOk = seoTags.hashtags.includes("#") && seoTags.hashtags.trim().length > 4;

    // Calculate score out of 100
    let tempScore = 15; // baseline rating
    if (titleOk) tempScore += 15;
    if (contentOk) tempScore += 20;
    if (keywordsOk) tempScore += 15;
    if (descriptionOk) tempScore += 15;
    if (altOk) tempScore += 10;
    if (hashtagsOk) tempScore += 10;

    setScoreMetrics({
      titleOk,
      contentOk,
      keywordsOk,
      descriptionOk,
      altOk,
      hashtagsOk,
      totalScore: tempScore
    });
  }, [title, content, seoTags]);

  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col gap-6 w-full text-xs text-left" id="seo-ad-verify-portal">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-250 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse fill-amber-500" />
          <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wide">
            AdSense Compliance & Media Crop Suite
          </h4>
        </div>
        <div className="flex items-center gap-1.5 py-1 px-2.5 bg-slate-900 text-white rounded-lg font-mono text-[10px] font-bold">
          <span>REAL-TIME SEO INTEGRITY:</span>
          <span className={`px-1.5 py-0.5 rounded font-black ${
            scoreMetrics.totalScore >= 80 ? "text-emerald-400 bg-emerald-950" : "text-amber-400 bg-amber-950"
          }`}>
            {scoreMetrics.totalScore}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Visual Crop simulator & upload */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-[10px] text-slate-500 uppercase tracking-widest font-mono">1. Local Media Ingestion</span>
            <span className="text-gray-600 block leading-tight">Pick a local image or MP4 file to parse for SEO alignment:</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="border border-dashed border-slate-300 hover:border-slate-500 rounded-xl p-3 bg-white text-center flex flex-col items-center justify-center gap-1.5 transition cursor-pointer">
              <Upload className="w-5 h-5 text-slate-500" />
              <span className="font-bold text-[10px] text-slate-700 uppercase">Load Image</span>
              <span className="text-[9px] text-gray-400 font-mono">PNG, Jpeg, WebP</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => handleLocalFileUpload(e, "image")} 
              />
            </label>

            <label className="border border-dashed border-slate-300 hover:border-slate-500 rounded-xl p-3 bg-white text-center flex flex-col items-center justify-center gap-1.5 transition cursor-pointer">
              <Upload className="w-5 h-5 text-slate-500" />
              <span className="font-bold text-[10px] text-slate-700 uppercase">Load Video</span>
              <span className="text-[9px] text-gray-400 font-mono">MP4, WebM (SEO rank)</span>
              <input 
                type="file" 
                accept="video/*" 
                className="hidden" 
                onChange={(e) => handleLocalFileUpload(e, "video")} 
              />
            </label>
          </div>

          {uploadProgress !== null && (
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full transition-all duration-150" 
                style={{ width: `${uploadProgress}%` }} 
              />
            </div>
          )}

          {/* Web Crop Simulation Canvas */}
          <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-900 w-full max-h-[300px] flex items-center justify-center">
            
            {/* The Image under crops */}
            <img 
              src={currentImg} 
              alt="SEO pre-cropped preview" 
              className="w-full h-auto max-h-[290px] object-contain select-none"
              referrerPolicy="no-referrer"
            />

            {/* Virtual Cropped Selection Bounds overlaid */}
            {!cropApplied && (
              <div 
                className="absolute border-2 border-dashed border-amber-400 bg-amber-400/10 pointer-events-none flex flex-col justify-end p-2 transition-all duration-300"
                style={{
                  top: `${cropBox.y}%`,
                  left: `${cropBox.x}%`,
                  width: `${cropBox.w}%`,
                  height: `${cropBox.h}%`
                }}
              >
                <span className="font-mono text-[8.5px] text-amber-300 bg-slate-950/80 px-1.5 py-0.5 rounded font-black w-fit uppercase select-none tracking-widest leading-none">
                  SEO Box ({cropRatio})
                </span>
              </div>
            )}

            {cropApplied && (
              <div className="absolute top-2.5 right-2.5 bg-emerald-600 border border-emerald-400 text-white font-mono text-[9px] font-bold px-2 py-1 rounded-md shadow-3xs uppercase tracking-wide">
                ✓ Cropped Aspect {cropRatio}
              </div>
            )}
          </div>

          {/* Controls to adjust cropping bounding box */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-2.5">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="font-bold text-slate-800 text-[11px] uppercase flex items-center gap-1">
                <Crop className="w-3.5 h-3.5 text-amber-500" /> Bounding SEO Aspect ratio:
              </span>
              <div className="flex gap-1.5">
                {(["1.91:1", "16:9", "4:3"] as const).map(ratio => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => {
                      setCropRatio(ratio);
                      setCropApplied(false);
                      if (ratio === "1.91:1") {
                        setCropBox({ x: 5, y: 15, w: 90, h: 60 });
                      } else if (ratio === "16:9") {
                        setCropBox({ x: 10, y: 20, w: 80, h: 45 });
                      } else {
                        setCropBox({ x: 15, y: 15, w: 70, h: 70 });
                      }
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase transition border cursor-pointer ${
                      cropRatio === ratio 
                        ? "bg-slate-900 border-slate-900 text-amber-400 shadow-3xs" 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={triggerAutoCropForSEO}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 p-2.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition flex justify-center items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 cursor-pointer"
              >
                <Crop className="w-3.5 h-3.5" /> Auto-Crop For AdSense Norms
              </button>
              {currentVideo && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentVideo("");
                    onUpdateMedia(currentImg, "");
                  }}
                  className="bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 px-3 py-2.5 rounded-xl font-semibold transition text-[10px] uppercase cursor-pointer"
                >
                  Unbind Video
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: SEO Verification checklist */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-[10px] text-slate-500 uppercase tracking-widest font-mono">2. SEO Verification Metrics</span>
            <span className="text-gray-600 block leading-tight">These indices verify the text density conforms with Google crawler specifications:</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            
            {/* Metric 1 */}
            <div className="flex items-start justify-between gap-2.5 border-b border-gray-50 pb-2.5">
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-800 text-[11px]">Title Character Density</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Needs to exceed 12 characters to index.</span>
              </div>
              {scoreMetrics.titleOk ? (
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold font-mono text-[10px] block">✓ PASS</span>
              ) : (
                <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold font-mono text-[10px] block font-sans">⚠️ THIN</span>
              )}
            </div>

            {/* Metric 2 */}
            <div className="flex items-start justify-between gap-2.5 border-b border-gray-50 pb-2.5">
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-800 text-[11px]">Written Copy Copiousness</span>
                <span className="text-[10px] text-slate-500 mt-0.5">At least 150 characters to prevent low content error.</span>
              </div>
              {scoreMetrics.contentOk ? (
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold font-mono text-[10px] block">✓ PASS</span>
              ) : (
                <span className="text-ash-600 bg-amber-55 text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold font-mono text-[10px] block">⚠️ NEED COPY</span>
              )}
            </div>

            {/* Metric 3 */}
            <div className="flex items-start justify-between gap-2.5 border-b border-gray-50 pb-2.5">
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-800 text-[11px]">Structured Search Keywords</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Provide at least 3 comma-separated terms.</span>
              </div>
              {scoreMetrics.keywordsOk ? (
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold font-mono text-[10px] block">✓ PASS</span>
              ) : (
                <span className="text-amber-500 bg-amber-50 px-2 py-0.5 rounded font-bold font-mono text-[10.5px] block">⚠️ DEFICIENT</span>
              )}
            </div>

            {/* Metric 4 */}
            <div className="flex items-start justify-between gap-2.5 border-b border-gray-50 pb-2.5">
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-800 text-[11px]">Alt-Text Accessibility Tag</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Crawlers require image alt-text to approve AdSense.</span>
              </div>
              {scoreMetrics.altOk ? (
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold font-mono text-[10px] block">✓ PASS</span>
              ) : (
                <span className="text-amber-500 bg-amber-50 px-2 py-0.5 rounded font-bold font-mono text-[10px] block">⚠️ BLANK</span>
              )}
            </div>

            {/* Metric 5 */}
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-800 text-[11px]">Deep Meta Description</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Rich semantic summary for organic results (&gt;90 chars).</span>
              </div>
              {scoreMetrics.descriptionOk ? (
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold font-mono text-[10px] block">✓ PASS</span>
              ) : (
                <span className="text-amber-500 bg-amber-50 px-2 py-0.5 rounded font-bold font-mono text-[10px] block">⚠️ BRIEF</span>
              )}
            </div>

          </div>

          {/* Quick AI advice */}
          <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 flex gap-2.5 items-start">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed text-amber-800 font-sans">
              <strong>Gemini AI Compliance Tip:</strong> To drive natural ad matches, specify Cameroon local names (like <em>Yaoundé</em>, <em>Bastos Hills</em>, <em>Cimencam bags</em> or <em>ONAC blueprints</em>) in your Keywords and Meta descriptions. Aim for an overall SEO score of &gt;80% before indexing.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
