import React, { useState } from "react";
import { 
  Printer, 
  Save, 
  ArrowLeft, 
  Download, 
  FileDown, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Coins, 
  User, 
  Bookmark, 
  FileText,
  Calendar
} from "lucide-react";
import { Receipt } from "../types";

interface Props {
  receipt: Receipt;
  onSave?: (updated: Receipt) => void;
  onBack?: () => void;
}

// Custom Premium CFA Franc automatic converter to support enterprise-grade lookups
function amountToWords(num: number): string {
  if (num === 0) return "Zero Francs CFA";
  
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", 
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", 
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];
  
  function convertLessThanThousand(n: number): string {
    if (n === 0) return "";
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20 || n >= 10) {
      if (n >= 20) {
        str += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      } else {
        str += ones[n] + " ";
        n = 0;
      }
    }
    if (n > 0) {
      str += ones[n] + " ";
    }
    return str.trim();
  }
  
  let result = "";
  let temp = num;
  
  const billion = Math.floor(temp / 1000000000);
  temp %= 1000000000;
  if (billion > 0) {
    result += convertLessThanThousand(billion) + " Billion ";
  }
  
  const million = Math.floor(temp / 1000000);
  temp %= 1000000;
  if (million > 0) {
    result += convertLessThanThousand(million) + " Million ";
  }
  
  const thousand = Math.floor(temp / 1000);
  temp %= 1000;
  if (thousand > 0) {
    result += convertLessThanThousand(thousand) + " Thousand ";
  }
  
  if (temp > 0) {
    result += convertLessThanThousand(temp);
  }
  
  return result.trim() + " Francs CFA";
}

export default function ReceiptA5Template({ receipt, onSave, onBack }: Props) {
  const [edited, setEdited] = useState<Receipt>({ ...receipt });
  const [isEditing, setIsEditing] = useState(true);

  // Standard Cameroonian civil contracting preset purposes
  const PRESETS = [
    { label: "Phase 1: Excavation & Terracing Deposit", amount: 3500000, purpose: "Phase 1 ground leveling, excavation works, and Labogenie soil certification deposit" },
    { label: "Phase 2: Reinforced Pillars Casting", amount: 6800000, purpose: "Purchase of high-grade concrete, structural steel reinforcement rods, and framework casting structural milestones" },
    { label: "Phase 3: Masonry & External Wall Laydown", amount: 4500000, purpose: "Assembly of premium CIMENCAM hollow concrete masonry blocks and mortar laydown" },
    { label: "Phase 4: Metal Roofing Systems Outlay", amount: 5200000, purpose: "Bespoke structural roofing timber assembly, ALU-zinc cover sheets framing, and accessories" },
    { label: "Architectural Planning & ANOR Clearance", amount: 1800000, purpose: "Drafting of structural plans, 3D renderings, and administrative urban local permit application fees" }
  ];

  const handleFieldChange = (field: keyof Receipt, value: any) => {
    let val = value;
    if (field === "amountXAF" || field === "vatRate") {
      val = Number(value) || 0;
    }

    const nextEdited = {
      ...edited,
      [field]: val,
    };

    // Calculate taxes dynamically
    if (field === "amountXAF" || field === "vatRate") {
      const amt = nextEdited.amountXAF;
      const rate = nextEdited.vatRate;
      nextEdited.vatAmount = Math.round(amt * rate);
      nextEdited.totalXAF = amt + nextEdited.vatAmount;
    }

    setEdited(nextEdited);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    const nextEdited = {
      ...edited,
      purpose: preset.purpose,
      amountXAF: preset.amount,
      vatAmount: Math.round(preset.amount * edited.vatRate),
      totalXAF: preset.amount + Math.round(preset.amount * edited.vatRate)
    };
    setEdited(nextEdited);
  };

  const saveChanges = () => {
    if (onSave) {
      onSave(edited);
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const exportToCSV = () => {
    const headers = [
      "Receipt Number",
      "Date Issued",
      "Customer/Client Name",
      "Payment Purpose Description",
      "Payment Channel",
      "Subtotal Net (XAF)",
      "VAT Rate (%)",
      "VAT Tax Amount (XAF)",
      "Total Collected (XAF)",
      "Status",
      "Handled By Treasury Officier",
      "Annotations / Notes"
    ];
    
    const row = [
      edited.receiptNumber,
      edited.date,
      edited.customerName,
      edited.purpose,
      edited.paymentMethod,
      edited.amountXAF,
      `${(edited.vatRate * 100).toFixed(2)}%`,
      edited.vatAmount,
      edited.totalXAF,
      edited.status,
      edited.processedBy,
      edited.notes || ""
    ].map(val => `"${String(val).replace(/"/g, '""')}"`);

    const csvContent = "\uFEFF" + [headers.join(","), row.join(",")].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MADECC_Receipt_${edited.receiptNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6" id="receipt-component">
      {/* Dynamic Printing CSS for A5 layout landscape */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide standard non-printable surrounding panels */
          body * {
            visibility: hidden !important;
          }
          #print-area-wrapper, #print-area-wrapper * {
            visibility: visible !important;
          }
          #print-area-wrapper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 148mm !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
          }
          #print-area {
            width: 100% !important;
            height: 100% !important;
            border: 3px solid #0f172a !important;
            border-radius: 12px !important;
            margin: 0 !important;
            padding: 24px !important;
            box-sizing: border-box !important;
            background-color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Ensure backgrounds are kept on physical page */
          .print-bg-slate {
            background-color: #0f172a !important;
            color: #ffffff !important;
          }
          .print-bg-amber {
            color: #f59e0b !important;
          }
          .print-sub-border {
            border-bottom: 1px dashed #94a3b8 !important;
          }
          @page {
            size: A5 landscape !important;
            margin: 0 !important;
          }
        }
      `}} />

      {/* Top action control pane */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 no-print shadow-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-gray-200 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
            </button>
          )}
          <div>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] uppercase font-mono font-black tracking-wider">A5 Voucher Console</span>
            <p className="text-xs text-slate-500 font-medium font-mono mt-0.5">{edited.receiptNumber}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-3xs cursor-pointer ${
              isEditing
                ? "bg-slate-800 hover:bg-slate-900 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-slate-950"
            }`}
          >
            {isEditing ? "Hide Interactive Form" : "Show Receipt Editor Form"}
          </button>
          
          <button
            onClick={saveChanges}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-3xs cursor-pointer flex items-center gap-1"
          >
            <Save className="w-4 h-4" /> Save Receipt log
          </button>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold shadow-3xs cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-emerald-600" /> Save CSV Spread
          </button>

          <button
            onClick={printReceipt}
            className="flex items-center gap-1.5 bg-indigo-650 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-3xs cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Export A5 PDF / Print
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start justify-center">
        {/* Responsive Editor Sidebar */}
        {isEditing && (
          <div className="w-full xl:w-[400px] bg-white p-6 rounded-2xl border border-gray-250 flex flex-col gap-5 no-print shrink-0 shadow-sm animate-slide-up text-left">
            <div className="border-b border-gray-100 pb-2">
              <h3 className="font-bold text-slate-950 uppercase text-xs tracking-wider flex items-center gap-1.5 text-left">
                <FileText className="w-4 h-4 text-amber-500" /> Receipt Data Fields
              </h3>
              <p className="text-[11px] text-gray-550">Dynamic field entry automatically propagates updates.</p>
            </div>

            {/* Quick Presets Builder */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-indigo-500" /> Use Commercial Presets:
              </label>
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {PRESETS.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="text-[10px] text-left p-2.5 rounded-lg border border-gray-100 bg-slate-50/50 hover:bg-amber-50 hover:border-amber-250 transition cursor-pointer font-medium leading-normal"
                  >
                    <strong className="text-slate-800 block text-[10.5px]">{preset.label}</strong>
                    <span className="text-gray-500 font-mono text-[9px]">{(preset.amount).toLocaleString()} XAF</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-700 font-bold">Voucher Coupon Number:</label>
                <input
                  type="text"
                  value={edited.receiptNumber}
                  onChange={(e) => handleFieldChange("receiptNumber", e.target.value)}
                  className="text-xs border border-gray-300 p-2.5 rounded-lg bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-700 font-bold">Received From (Client/Owner):</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    value={edited.customerName}
                    onChange={(e) => handleFieldChange("customerName", e.target.value)}
                    className="text-xs border border-gray-300 pl-8.5 pr-2.5 py-2.5 rounded-lg w-full focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    placeholder="e.g. Samuel Eto'o Fils"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-700 font-bold">Purpose of payment (Libellé):</label>
                <textarea
                  value={edited.purpose}
                  onChange={(e) => handleFieldChange("purpose", e.target.value)}
                  className="text-xs border border-gray-300 p-2.5 rounded-lg h-20 leading-relaxed focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  placeholder="Detail the active milestone works or structural blueprints deposit..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-700 font-bold">Issue Date:</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-3.5 h-3.5 text-zinc-400" />
                    <input
                      type="date"
                      value={edited.date}
                      onChange={(e) => handleFieldChange("date", e.target.value)}
                      className="text-xs border border-gray-300 pl-8.5 pr-2 py-2.5 rounded-lg w-full focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-700 font-bold">Payment Method:</label>
                  <select
                    value={edited.paymentMethod}
                    onChange={(e) => handleFieldChange("paymentMethod", e.target.value as any)}
                    className="text-xs border border-gray-300 p-2.5 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none bg-white"
                  >
                    <option value="Cash">Cash / Espèces</option>
                    <option value="Bank Transfer">Bank Transfer / Virement</option>
                    <option value="Mobile Money">Mobile Money / MoMo</option>
                    <option value="Cheque">Bank Cheque / Chèque</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-700 font-bold flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-500" /> Amount (Net):
                  </label>
                  <input
                    type="number"
                    value={edited.amountXAF}
                    onChange={(e) => handleFieldChange("amountXAF", e.target.value)}
                    className="text-xs border border-gray-300 p-2.5 rounded-lg font-mono focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    placeholder="XAF amount"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-700 font-bold">VAT Bidding Tax:</label>
                  <select
                    value={edited.vatRate}
                    onChange={(e) => handleFieldChange("vatRate", e.target.value)}
                    className="text-xs border border-gray-300 p-2.5 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none bg-white"
                  >
                    <option value={0}>0% (Exempt d'impôt)</option>
                    <option value={0.1925}>19.25% (Standard VAT CM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-700 font-bold">Status Badge:</label>
                  <select
                    value={edited.status}
                    onChange={(e) => handleFieldChange("status", e.target.value as any)}
                    className="text-xs border border-gray-300 p-2.5 rounded-lg bg-white"
                  >
                    <option value="Cleared">Cleared / Validé</option>
                    <option value="Pending">Pending / En attente</option>
                    <option value="Refunded">Refunded / Remboursé</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-700 font-bold">Treasury Cashier:</label>
                  <input
                    type="text"
                    value={edited.processedBy}
                    onChange={(e) => handleFieldChange("processedBy", e.target.value)}
                    className="text-xs border border-gray-300 p-2.5 rounded-lg"
                    placeholder="Cashier Signature"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-700 font-bold">Office Memo Notes:</label>
                <input
                  type="text"
                  value={edited.notes || ""}
                  onChange={(e) => handleFieldChange("notes", e.target.value)}
                  placeholder="Internal audit mentions"
                  className="text-xs border border-gray-300 p-2.5 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Outer frame holding the high fidelity print-ready card */}
        <div className="flex-1 w-full flex justify-center max-w-4xl">
          <div id="print-area-wrapper" className="w-full">
            <div 
              className="bg-white border-[3px] border-slate-950 shadow-xl p-8 font-sans text-slate-900 leading-normal w-full max-w-3xl mx-auto rounded-3xl relative overflow-hidden flex flex-col justify-between" 
              id="print-area"
              style={{ minHeight: "148mm", boxSizing: "border-box" }}
            >
              {/* Premium Luxury Golden Corners Decors */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-amber-400 to-transparent opacity-10 select-none pointer-events-none rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-amber-500 to-transparent opacity-10 select-none pointer-events-none rounded-full blur-2xl" />

              {/* Header block containing enterprise references */}
              <div className="flex justify-between items-start border-b-2 border-slate-950 pb-5">
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 bg-slate-950 rounded flex items-center justify-center font-black text-amber-400 text-xs shadow-sm">M</span>
                    <span className="font-sans font-black tracking-widest text-lg text-slate-950 uppercase">
                      MADECC <span className="text-amber-500 font-light">GROUP</span>
                    </span>
                  </div>
                  <p className="text-[9px] text-gray-500 font-mono font-bold leading-relaxed mt-1.5">
                    Maison de Construction et de Civil S.A.<br />
                    B.P. 1255 Douala - Cameroun | Immeuble Akwa Towers<br />
                    Reg: RC/YAO/2026/B/882103 | N.I.U. M05261899201A<br />
                    Tél: +237 677 889 011 | Email: accounts@madecc.cm
                  </p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="bg-slate-950 text-white font-mono text-[9px] font-black uppercase px-3 py-1.5 rounded-lg tracking-widest inline-block mb-1 shadow-3xs print-bg-slate">
                    RECEIPT OF PAYMENT / REÇU DE PAIEMENT
                  </span>
                  <p className="font-mono text-xs text-slate-950 font-black">No: <span className="text-indigo-700">{edited.receiptNumber}</span></p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono mt-0.5">Date: {edited.date}</p>
                </div>
              </div>

              {/* Dynamic Voucher layout with dashed structured fields */}
              <div className="my-6 space-y-4 text-xs">
                <div className="flex items-baseline border-b border-dashed border-slate-300 gap-4 pb-1.5 print-sub-border">
                  <span className="text-slate-400 font-black shrink-0 uppercase tracking-wider text-[8.5px] w-40 text-left">Received From (De la part de):</span>
                  <span className="text-slate-950 font-black text-sm tracking-tight text-left flex-1">{edited.customerName || "—"}</span>
                </div>

                <div className="flex items-start border-b border-dashed border-slate-300 gap-4 pb-1.5 print-sub-border">
                  <span className="text-slate-400 font-black shrink-0 uppercase tracking-wider text-[8.5px] w-40 mt-0.5 text-left">Purpose of Payment (Objet):</span>
                  <span className="text-slate-800 font-semibold leading-relaxed text-left flex-1">{edited.purpose || "—"}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-baseline border-b border-dashed border-slate-300 gap-4 pb-1.5 print-sub-border">
                    <span className="text-slate-400 font-black shrink-0 uppercase tracking-wider text-[8.5px] w-40 sm:w-28 text-left">Payment Channel (Mode):</span>
                    <span className="font-mono text-slate-950 font-black uppercase text-[11px] text-left">{edited.paymentMethod}</span>
                  </div>
                  <div className="flex items-baseline border-b border-dashed border-slate-300 gap-4 pb-1.5 print-sub-border">
                    <span className="text-slate-400 font-black shrink-0 uppercase tracking-wider text-[8.5px] w-40 sm:w-28 text-left">Internal Status (Statut):</span>
                    <span className="text-left flex-1">
                      {edited.status === "Cleared" && (
                        <span className="text-emerald-700 font-mono font-black text-[10.5px] uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 print-bg-amber" /> CLEARED / ENCAISSÉ
                        </span>
                      )}
                      {edited.status === "Pending" && (
                        <span className="text-amber-700 font-mono font-black text-[10.5px] uppercase tracking-wider flex items-center gap-1 animate-pulse">
                          <Clock className="w-3.5 h-3.5 text-amber-500" /> PENDING / EN COURS
                        </span>
                      )}
                      {edited.status === "Refunded" && (
                        <span className="text-red-700 font-mono font-black text-[10.5px] uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-650" /> REFUNDED / REJETÉ
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Amount Rendered in Words (Montant en lettres) */}
                <div className="flex items-start border-b border-dashed border-slate-300 gap-4 pb-1.5 print-sub-border">
                  <span className="text-slate-400 font-black shrink-0 uppercase tracking-wider text-[8.5px] w-40 mt-0.5 text-left">Sum of (Montant en lettres):</span>
                  <span className="text-slate-700 italic font-medium text-left leading-relaxed flex-1 bg-amber-50/50 px-2.5 py-1 rounded-md text-[11px] border border-amber-100/50">
                    {amountToWords(edited.totalXAF)}
                  </span>
                </div>
              </div>

              {/* Dynamic Ledger Ledger Box with Gold Accents */}
              <div className="bg-slate-950 text-white rounded-2xl p-5 my-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-800 shadow-md print-bg-slate">
                <div className="text-left flex-1">
                  <span className="text-[8px] uppercase tracking-widest text-slate-400 block font-mono font-bold">TOTAL COMMITTED FUNDS (MONTANT TOTAL REÇU)</span>
                  <span className="text-3xl font-mono font-black tracking-tight text-amber-400 flex items-baseline gap-1.5 mt-0.5 print-bg-amber">
                    {edited.totalXAF.toLocaleString("fr-FR")} <span className="text-sm font-semibold text-white">XAF</span>
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-left border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-5 pr-2 shrink-0">
                  <div>
                    <span className="text-[7.5px] uppercase text-slate-400 block font-mono font-bold">NET FUNDS (NET HT):</span>
                    <span className="font-mono text-slate-300 text-xs font-bold">
                      {edited.amountXAF.toLocaleString("fr-FR")} XAF
                    </span>
                  </div>
                  <div>
                    <span className="text-[7.5px] uppercase text-slate-400 block font-mono font-bold">VAT AMOUNT (DONT TVA):</span>
                    <span className="font-mono text-amber-500 text-xs font-bold block print-bg-amber">
                      {edited.vatAmount.toLocaleString("fr-FR")} XAF <span className="text-[9px] text-slate-400 font-normal">({edited.vatRate > 0 ? "19.25%" : "Tax Exempt"})</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Cashier annotations review */}
              {edited.notes && (
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[10px] text-zinc-650 leading-relaxed mb-4 text-left font-mono font-medium relative">
                  <span className="font-black text-slate-950 text-[9px] uppercase tracking-wider block mb-0.5">Validation Memo / Observations:</span>
                  {edited.notes}
                </div>
              )}

              {/* Bottom Audit stamp seal and authorized sign-off signature */}
              <div className="grid grid-cols-2 gap-8 items-end mt-4 pt-3 border-t border-slate-950">
                <div className="text-left text-[9px] text-gray-400 leading-relaxed font-mono">
                  <p className="font-bold text-slate-700">MADECC S.A. Ledger System Authorization</p>
                  <p>Gateway Processor: <span className="text-slate-800 font-bold">{edited.paymentMethod} Register</span></p>
                  <p className="text-[8px]">Session Stamp: 2026-05-30 UTC // {edited.processedBy || "AUTO"}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-[8px] uppercase tracking-wider text-slate-450 block font-black mb-1.5">MADECC TREASURY STAMP / SEALS</span>
                  <div className="w-48 h-14 relative border border-dashed border-slate-400 rounded-xl flex items-center justify-center bg-slate-50">
                    <span className="text-[7.5px] font-mono text-blue-800/90 uppercase tracking-widest font-black rotate-1 border border-blue-900/30 px-1 py-0.5 rounded">
                      APPROVED • {edited.processedBy || "C. ATANGANA"}
                    </span>
                    <div className="absolute top-1 right-2 opacity-15">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>
                    {/* Visual Stamp Overlay */}
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-30 select-none pointer-events-none">
                      <svg className="w-12 h-12 text-blue-900 rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
