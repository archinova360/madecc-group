import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, MessageCircle, Phone, Sparkles, Send, X, 
  ExternalLink, FileText, ArrowRight, CornerDownLeft, Loader2
} from "lucide-react";

interface FloatingReceptionWidgetProps {
  setActivePage: (page: string) => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
}

export default function FloatingReceptionWidget({ setActivePage }: FloatingReceptionWidgetProps) {
  // Chat drawer states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Bienvenue! Warm welcome to MADECC Group Cameroon! 🇨🇲 I am your Digital Receptionist, powered by Gemini AI.\n\nI can assist you with structural cost estimates, permit regulations, ONAC architectural layouts, or instantly direct you to our expert divisions.\n\nWhat are we building together today? Ask me any questions, or use the quick redials below."
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Phone drop-up states
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);

  // Ref to automatically scroll chat to bottom
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll bottom hook
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen, isAiLoading]);

  // Handle send message to Gemini backend
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isAiLoading) return;

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      text: inputText.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsAiLoading(true);

    try {
      // Structure chat messages for the server
      const chatHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));
      // Append the new user message
      chatHistory.push({
        role: "user",
        text: userMsg.text
      });

      const response = await fetch("/api/reception/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          userMessage: userMsg.text
        })
      });

      const data = await response.json();
      
      const modelMsg: ChatMessage = {
        id: "msg-" + Date.now() + "-ai",
        role: "model",
        text: data.text || "Hello! How can I assist you with your civil projects across Yaoundé and Douala today?"
      };
      
      setMessages(prev => [...prev, modelMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      // Fallback
      setMessages(prev => [
        ...prev,
        {
          id: "msg-" + Date.now() + "-err",
          role: "model",
          text: "I apologies, but the network route is currently congested. I recommend you connect directly with our managers via WhatsApp (+237 683316486) or dial +237 671063511!"
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Redirection utilities
  const handleRedirectToWhatsApp = () => {
    window.open("https://wa.me/237683316486", "_blank");
  };

  const handleRedirectToBaseline = () => {
    setActivePage("baseline-form");
    setIsChatOpen(false);
    // Smooth scroll to top to see widget
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRedirectToContactForm = () => {
    setActivePage("home");
    setIsChatOpen(false);
    // Give state transitions 150ms then resolve DOM lookups
    setTimeout(() => {
      const contactEl = document.getElementById("contact");
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: "smooth" });
      } else {
        // Fallback smooth scroll to bottom coordinates
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }
    }, 150);
  };

  const phoneNumbers = [
    { label: "Hotline Main (Orange)", num: "+237 671 063 511", raw: "671063511" },
    { label: "WhatsApp & Call (MTN)", num: "+237 683 316 486", raw: "683316486" },
    { label: "Technical Desk (Camil)", num: "+237 640 194 505", raw: "640194505" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans" id="floating-connect-suite">
      
      {/* 1. CHATBOX popover */}
      {isChatOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in relative transition-all duration-300">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 font-black tracking-tight text-sm">
                  MD
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-500 flex items-center gap-1">
                  Digital Receptionist <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
                </h4>
                <p className="text-[10px] text-slate-300">MADECC S.A. AI reception desk</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-800 rounded-lg cursor-pointer"
              title="Minimize panel"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Quick Shortcuts horizontal bar */}
          <div className="bg-slate-50 border-b border-slate-200 p-2 text-[11px] grid grid-cols-4 gap-1 text-center font-mono font-bold uppercase tracking-tight text-slate-600">
            <button 
              onClick={handleRedirectToWhatsApp}
              className="hover:text-emerald-700 hover:bg-emerald-50/50 p-1.5 rounded transition cursor-pointer border border-transparent hover:border-emerald-100 flex flex-col items-center gap-0.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
            <button 
              onClick={() => {
                setIsPhoneOpen(!isPhoneOpen);
              }}
              className="hover:text-amber-700 hover:bg-amber-50/50 p-1.5 rounded transition cursor-pointer border border-transparent hover:border-amber-100 flex flex-col items-center gap-0.5"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>Call Dial</span>
            </button>
            <button 
              onClick={handleRedirectToBaseline}
              className="hover:text-blue-700 hover:bg-blue-50/50 p-1.5 rounded transition cursor-pointer border border-transparent hover:border-blue-100 flex flex-col items-center gap-0.5"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Estimates</span>
            </button>
            <button 
              onClick={handleRedirectToContactForm}
              className="hover:text-rose-700 hover:bg-rose-50/50 p-1.5 rounded transition cursor-pointer border border-transparent hover:border-rose-100 flex flex-col items-center gap-0.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
              <span>Contact</span>
            </button>
          </div>

          {/* Message Arena */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-100/60 space-y-3 Scrollbar-custom">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex flex-col max-w-[85%] ${
                  m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div 
                  className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-3xs ${
                    m.role === "user" 
                      ? "bg-slate-900 text-white rounded-tr-none font-medium" 
                      : "bg-white text-slate-800 border border-slate-150 rounded-tl-none font-normal"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-gray-500 font-mono mt-1 px-1">
                  {m.role === "user" ? "Client Guest" : "Digital Desk"}
                </span>
              </div>
            ))}

            {isAiLoading && (
              <div className="mr-auto items-start flex flex-col max-w-[80%]">
                <div className="bg-white text-slate-500 p-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-2 border border-dashed border-slate-300 shadow-3xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  <span>Consulting engineering database...</span>
                </div>
              </div>
            )}
            
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Reception Action Box */}
          <div className="p-3 bg-amber-50/75 border-t border-amber-100 flex flex-col gap-1.5">
            <p className="text-[10px] text-slate-600 leading-tight">
              ⚡ Can&apos;t wait? Click to instantly complete estimations, write corporate requests, or call:
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button 
                onClick={handleRedirectToBaseline}
                className="bg-slate-950 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
              >
                📋 Baseline Estimate Form <ArrowRight className="w-2.5 h-2.5" />
              </button>
              <button 
                onClick={handleRedirectToContactForm}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
              >
                ✉️ Open Contact Form <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Footer Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input 
              type="text"
              required
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isAiLoading}
              placeholder="Ask about materials price, permit guide..." 
              className="flex-1 border border-slate-200 p-2.5 text-xs rounded-xl focus:outline-none focus:border-slate-400 placeholder:text-gray-400"
            />
            <button 
              type="submit"
              disabled={isAiLoading || !inputText.trim()}
              className="bg-slate-900 hover:bg-black text-white p-2.5 rounded-xl cursor-pointer transition disabled:opacity-45"
              title="Submit message"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>

        </div>
      )}

      {/* 2. POP-UP CONTACT CHANNEL DIALER PANEL */}
      {isPhoneOpen && (
        <div className="w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 flex flex-col gap-2.5 animate-fade-in mb-1">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <span className="font-bold uppercase font-mono text-[10px] text-slate-500 tracking-wider">
              Select Hotline Destination
            </span>
            <button onClick={() => setIsPhoneOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {phoneNumbers.map((phone, idx) => (
              <a 
                key={idx}
                href={`tel:${phone.raw}`}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 hover:bg-amber-50 hover:border-amber-200 transition flex justify-between items-center text-xs group"
              >
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-slate-800 text-[11px] font-sans group-hover:text-slate-950">{phone.label}</span>
                  <span className="font-mono text-[10px] text-slate-500 mt-0.5 group-hover:text-amber-700">{phone.num}</span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/80 group-hover:bg-amber-500 text-slate-700 group-hover:text-slate-950 flex items-center justify-center transition border border-transparent group-hover:shadow-3xs">
                  <Phone className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
          <div className="text-[10px] text-slate-500 leading-snug bg-slate-100/50 p-2 rounded-lg text-center font-sans">
            Direct Office hours: Monday - Saturday (8AM to 6PM). Routing is live across Cameroon.
          </div>
        </div>
      )}

      {/* 3. STACKED CORNER BUTTON LABELS */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-center">
        
        {/* Calling hotlines selector trigger */}
        <button 
          onClick={() => {
            setIsPhoneOpen(!isPhoneOpen);
            setIsChatOpen(false);
          }}
          className={`flex items-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-full text-xs shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider ${isPhoneOpen ? "ring-2 ring-slate-950" : ""}`}
          title="Direct dialing coordinates"
          id="floating-call-selector-button"
        >
          <Phone className="w-4 h-4 fill-slate-950" />
          <span className="hidden sm:inline">Call Hotline Desk</span>
        </button>

        {/* WhatsApp Button */}
        <button 
          onClick={handleRedirectToWhatsApp}
          className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full text-xs shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider"
          title="Start Chat on WhatsApp"
          id="floating-whatsapp-direct-button"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span className="hidden sm:inline">WhatsApp Direct</span>
        </button>

        {/* AI Assistant Chat button */}
        <button 
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            setIsPhoneOpen(false);
          }}
          className={`flex items-center gap-2 px-5 py-3.5 bg-slate-900 hover:bg-black text-white font-extrabold rounded-full text-xs shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-widest relative group ${isChatOpen ? "ring-3 ring-amber-400" : ""}`}
          title="Chat with Customer Receptionist AI"
          id="floating-ai-reception-button"
        >
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border border-slate-900 flex items-center justify-center animate-ping" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border border-slate-900 flex items-center justify-center" />
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Reception AI Chat</span>
        </button>

      </div>

    </div>
  );
}
