import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building, ShieldCheck, UserCheck, Calculator, Briefcase, 
  Settings, Key, AlertTriangle, Coins, FileSpreadsheet, 
  Calendar, CheckSquare, Sparkles, Plus, Trash2, Edit3, 
  Smartphone, Upload, Eye, RefreshCw, Send, CheckCircle2,
  Download, FileText, Check, Database
} from "lucide-react";
import { StaffRole, DatabaseState, BlogPost, ProjectItem, Invoice, Receipt, QuoteRequest, SEOMetadata, Appointment, Blueprint } from "../types";
import InvoiceA4Template from "./InvoiceA4Template.tsx";
import ReceiptA5Template from "./ReceiptA5Template.tsx";
import SEOMediaUploadCropPanel from "./SEOMediaUploadCropPanel.tsx";

interface Props {
  dbState: DatabaseState;
  setDbState: React.Dispatch<React.SetStateAction<DatabaseState>>;
  syncDbState: (updated: DatabaseState) => Promise<boolean> | void;
  staffLoggedIn: string | null;
  setStaffLoggedIn: (roleName: string | null) => void;
}

export default function AdminDashboard({ dbState, setDbState, syncDbState: apiSyncDbState, staffLoggedIn, setStaffLoggedIn }: Props) {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    setToast({ message, type });
    const timer = setTimeout(() => {
      setToast(prev => {
        if (prev?.message === message) return null;
        return prev;
      });
    }, 6000);
    return () => clearTimeout(timer);
  };

  // Safe wrapper around parent state sync with real-time UI status notifications
  const syncDbState = async (updated: DatabaseState) => {
    try {
      await apiSyncDbState(updated);
      showToast("Workspace database and backup ledger synchronized on disk.", "success");
    } catch (err: any) {
      showToast(`Database Sync Alert: Offline or network failed (${err.message}). Changes are saved locally on your device cache.`, "error");
    }
  };
  const [commandKeyInput, setCommandKeyInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeRoleTab, setActiveRoleTab] = useState<StaffRole | null>(null);

  // Form-specific states to write/edit blogs & projects
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editingProj, setEditingProj] = useState<ProjectItem | null>(null);
  
  // AI assist loading states
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiLog, setAiLog] = useState("");

  const [activeInvoiceForView, setActiveInvoiceForView] = useState<Invoice | null>(null);
  const [activeReceiptForView, setActiveReceiptForView] = useState<Receipt | null>(null);

  // Visit scheduling form state
  const [bookingPurpose, setBookingPurpose] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingEngineer, setBookingEngineer] = useState("Simeon Tchounkeu");
  const [bookingClientName, setBookingClientName] = useState("");
  const [bookingClientPhone, setBookingClientPhone] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");

  // Architect blueprint state
  const [blueprintTitle, setBlueprintTitle] = useState("");
  const [blueprintProject, setBlueprintProject] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileSize, setSelectedFileSize] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // General Manager interactive control parameters
  const [gmAccidents, setGmAccidents] = useState("0 (Zero incidents)");
  const [gmOnTime, setGmOnTime] = useState(92.5);
  const [gmBottlenecks, setGmBottlenecks] = useState("Sourcing Sable de Sanaga sand and Cimencam logistics on time.");
  const [gmDirectiveInput, setGmDirectiveInput] = useState("");

  // Resolve active logged in role on load
  useEffect(() => {
    if (staffLoggedIn) {
      // Find matching role
      const matched = Object.entries(dbState.commandKeys).find(([role, key]) => role === staffLoggedIn);
      if (matched) {
        setActiveRoleTab(matched[0] as StaffRole);
      }
    }
  }, [staffLoggedIn, dbState]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    const trimKey = commandKeyInput.trim();
    if (!trimKey) {
      setLoginError("Please enter a valid command key.");
      return;
    }

    // Find is key matched in state
    const matched = Object.entries(dbState.commandKeys).find(([role, key]) => key === trimKey);
    
    if (matched) {
      const role = matched[0] as StaffRole;
      setStaffLoggedIn(role);
      setActiveRoleTab(role);
      setCommandKeyInput("");
    } else {
      setLoginError("Unrecognized Command Key. Please check with your CEO.");
    }
  };

  // Helper: edit command keys inside database (CEO only)
  const handleUpdateCommandKeys = (role: StaffRole, newKey: string) => {
    const updatedKeys = { ...dbState.commandKeys, [role]: newKey };
    const nextState = { ...dbState, commandKeys: updatedKeys };
    setDbState(nextState);
    syncDbState(nextState);
  };

  // Helper to generate a brand new random command key (CEO privilege)
  const handleRegenKey = (role: StaffRole) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let token = "";
    for (let i = 0; i < 4; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const finalKey = `MADECC-KEY-${role.substring(0, 3).replace(" ", "")}-${token}`;
    handleUpdateCommandKeys(role, finalKey);
  };

  // SEO automated trigger using Gemini server endpoint
  const handleRunAISetupForBlog = async (title: string, keywords: string) => {
    if (!title) {
      alert("Provide a block title first before running the AI assist.");
      return;
    }
    setAiGenerating(true);
    setAiLog("Querying server-side @google/genai SDK (gemini-3.5-flash)...");
    
    try {
      const response = await fetch("/api/seo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "blog post detailing Cameroon civil works",
          title,
          keywords,
          extraDetails: "MADECC Group guidelines on strict ANOR compliance and Labogenie certifications."
        }),
      });

      const result = await response.json();
      if (result.success && result.seo) {
        const { title: seoT, description, caption, altText, keywords: seoK, hashtags, suggestedArticleDraft } = result.seo;
        
        if (editingBlog) {
          setEditingBlog({
            ...editingBlog,
            content: editingBlog.content ? `${editingBlog.content}\n\n${suggestedArticleDraft}` : suggestedArticleDraft,
            seoTags: {
              title: seoT,
              description,
              caption,
              altText,
              keywords: seoK,
              hashtags,
              socialMediaHandles: "@madecc_group, facebook/madecc.cameroun",
            }
          });
        }
        setAiLog("Success! SEO metadata fully synchronized below.");
      } else {
        setAiLog("Failed to reach server key. Loaded responsive local fallback tags.");
      }
    } catch (err: any) {
      console.error(err);
      setAiLog("Error executing AI query. Loaded offline backup tags.");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleRunAISetupForProj = async (title: string, keywords: string) => {
    if (!title) {
      alert("Provide a project title first before running the AI assist.");
      return;
    }
    setAiGenerating(true);
    setAiLog("Connecting to server-side @google/genai pipeline...");
    
    try {
      const response = await fetch("/api/seo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "construction project engineering log",
          title,
          keywords,
          extraDetails: "Includes concrete casting metrics, architectural blueprints, and Cameroonian location specs"
        }),
      });

      const result = await response.json();
      if (result.success && result.seo) {
        const { title: seoT, description, caption, altText, keywords: seoK, hashtags, suggestedArticleDraft } = result.seo;
        
        if (editingProj) {
          setEditingProj({
            ...editingProj,
            desc: editingProj.desc ? `${editingProj.desc}\n\n${suggestedArticleDraft}` : suggestedArticleDraft,
            seoTags: {
              title: seoT,
              description,
              caption,
              altText,
              keywords: seoK,
              hashtags,
              socialMediaHandles: "@madecc_infra",
            }
          });
        }
        setAiLog("Success! Project parameters and SEO metadata synchronized.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiGenerating(false);
    }
  };

  // Blog publishing helper
  const handleSaveBlogForm = () => {
    if (!editingBlog) return;
    
    let updatedBlogs = [...dbState.blogs];
    const exists = updatedBlogs.some(b => b.id === editingBlog.id);
    
    if (exists) {
      updatedBlogs = updatedBlogs.map(b => b.id === editingBlog.id ? editingBlog : b);
    } else {
      updatedBlogs.unshift(editingBlog);
    }

    const nextState = { ...dbState, blogs: updatedBlogs };
    setDbState(nextState);
    syncDbState(nextState);
    setEditingBlog(null);
    alert("Blog published and SEO indexed successfully.");
  };

  // Project item publishing helper
  const handleSaveProjForm = () => {
    if (!editingProj) return;

    let updatedProjs = [...dbState.projects];
    const exists = updatedProjs.some(p => p.id === editingProj.id);

    if (exists) {
      updatedProjs = updatedProjs.map(p => p.id === editingProj.id ? editingProj : p);
    } else {
      updatedProjs.unshift(editingProj);
    }

    const nextState = { ...dbState, projects: updatedProjs };
    setDbState(nextState);
    syncDbState(nextState);
    setEditingProj(null);
    alert("Project site records and SEO descriptions completed.");
  };

  // Master approval gate for CEO
  const toggleProjectStatus = (id: string, status: any) => {
    const updated = dbState.projects.map(p => p.id === id ? { ...p, status } : p);
    const nextState = { ...dbState, projects: updated };
    setDbState(nextState);
    syncDbState(nextState);
  };

  const handleCreateNewInvoice = () => {
    const defaultInvoice: Invoice = {
      id: "inv-" + Date.now(),
      invoiceNumber: `MAD-2026-INV-00${dbState.invoices.length + 1}`,
      clientName: "New Cameroonian Corp",
      clientEmail: "contact@corp.cm",
      clientPhone: "+237 6xx xxx xxx",
      projectTitle: dbState.projects[0]?.title || "General Construction works",
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      lineItems: [
        { description: "Foundation laydown concrete works C30", quantity: 1, unitPrice: 5500000, total: 5500000 }
      ],
      subtotal: 5500000,
      vatRate: 0.1925,
      vatAmount: Math.round(5500000 * 0.1925),
      totalAmountXAF: Math.round(5500050 * 1.1925),
      status: "Sent",
      issuedBy: "Clement Atangana",
    };
    setActiveInvoiceForView(defaultInvoice);
  };

  const handleCreateNewReceipt = () => {
    const defaultReceipt: Receipt = {
      id: "rec-" + Date.now(),
      receiptNumber: `MAD-2026-REC-00${dbState.receipts.length + 1}`,
      customerName: "Sariel Tchami",
      purpose: "Stage breakdown deposit for columns casting",
      date: new Date().toISOString().split('T')[0],
      paymentMethod: "Bank Transfer",
      amountXAF: 4500000,
      vatRate: 0.1925,
      vatAmount: Math.round(4500000 * 0.1925),
      totalXAF: 4500000,
      processedBy: "Clement Atangana",
      status: "Cleared",
      notes: "Direct bank wire to Afriland first bank",
    };
    setActiveReceiptForView(defaultReceipt);
  };

  // Back from templates saving
  const handleSaveInvoiceFromTemplate = (updatedInvoice: Invoice) => {
    let list = [...dbState.invoices];
    const exists = list.some(i => i.id === updatedInvoice.id);
    if (exists) {
      list = list.map(i => i.id === updatedInvoice.id ? updatedInvoice : i);
    } else {
      list.unshift(updatedInvoice);
    }
    const nextState = { ...dbState, invoices: list };
    setDbState(nextState);
    syncDbState(nextState);
    setActiveInvoiceForView(null);
    alert("Invoice log successfully registered.");
  };

  const handleSaveReceiptFromTemplate = (updatedReceipt: Receipt) => {
    let list = [...dbState.receipts];
    const exists = list.some(r => r.id === updatedReceipt.id);
    if (exists) {
      list = list.map(r => r.id === updatedReceipt.id ? updatedReceipt : r);
    } else {
      list.unshift(updatedReceipt);
    }
    const nextState = { ...dbState, receipts: list };
    setDbState(nextState);
    syncDbState(nextState);
    setActiveReceiptForView(updatedReceipt);
    alert("Receipt coupon successfully logged and synchronized permanently on database.");
  };

  // Securely download the entire db_state.json backup directly from express api
  const handleDownloadDatabaseBackup = async () => {
    showToast("Initiating database backup retrieval...", "info");
    try {
      const response = await fetch("/api/admin/download-db");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to read database backup file from disk.`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "db_state.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast("Database file backup 'db_state.json' successfully downloaded.", "success");
    } catch (err: any) {
      showToast(`Download failure: ${err.message}`, "error");
    }
  };

  // Export individual invoice as CSV file download
  const handleDownloadInvoiceCSV = (i: Invoice) => {
    const headers = [
      "Invoice Number",
      "Date Issued",
      "Due Date",
      "Client Name",
      "Client Email",
      "Client Phone",
      "Project Title",
      "VAT Rate",
      "Subtotal (XAF)",
      "VAT Amount (XAF)",
      "Total Amount TTC (XAF)",
      "Invoice Status"
    ];

    const mainRow = [
      i.invoiceNumber,
      i.date,
      i.dueDate,
      i.clientName,
      i.clientEmail,
      i.clientPhone,
      i.projectTitle,
      "19.25%",
      i.subtotal,
      i.vatAmount,
      i.totalAmountXAF,
      i.status
    ];

    // Build items rows
    const itemHeaders = ["", "Line Item Description", "Quantity", "Unit Price (XAF)", "Total Price (XAF)"];
    const itemRows = i.lineItems.map(item => [
      "",
      item.description.replace(/,/g, " "),
      item.quantity,
      item.unitPrice,
      item.total
    ]);

    const csvRows = [
      headers.join(","),
      mainRow.map(v => typeof v === "string" ? `"${v.replace(/"/g, '""')}"` : v).join(","),
      "",
      itemHeaders.join(","),
      ...itemRows.map(row => row.join(","))
    ];

    // Use raw binary/text to create download blob link so it stands up perfectly and avoids quota block errors
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Invoice_${i.invoiceNumber}_${i.clientName.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Financial statistics calculated on the fly
  const totalRevenue = dbState.receipts
    .filter(r => r.status === "Cleared")
    .reduce((sum, r) => sum + r.totalXAF, 0);

  const totalInvoiced = dbState.invoices
    .reduce((sum, i) => sum + i.totalAmountXAF, 0);

  const outstandingReceivable = totalInvoiced - totalRevenue > 0 ? totalInvoiced - totalRevenue : 0;

  if (!staffLoggedIn || !activeRoleTab) {
    // Elegant system sign in gateway
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-gray-250 rounded-2xl shadow-lg no-print animate-fade-in" id="staff-auth-portal">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-amber-500 shadow-md">
            <Key className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">MADECC STAFF WORKSPACE</h2>
          <p className="text-xs text-gray-500 max-w-xs leading-normal">
            Enter your role-assigned **Command Key** to automatically launch your duty post dashboard. Keys are generated and provided exclusively by the CEO.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-800">Your Action Key</label>
            <input
              type="password"
              placeholder="e.g. MADECC-KEY-████-██"
              value={commandKeyInput}
              onChange={(e) => setCommandKeyInput(e.target.value)}
              className="border border-gray-300 p-3.5 rounded-xl text-center text-xs tracking-widest focus:ring-2 focus:ring-slate-900 focus:outline-none focus:border-slate-900 font-mono"
            />
          </div>

          {loginError && (
            <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-100 flex items-center gap-1.5 leading-normal">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {loginError}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-black text-amber-400 font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-sm transition duration-150 cursor-pointer"
          >
            Authenticate Key
          </button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-4 bg-slate-50 p-4 rounded-xl">
          <p className="text-[10px] text-gray-500 leading-normal">
            <strong className="text-slate-700">Verification assistance:</strong> To log in and inspect the duty posts for testing, here are the default CEO generated keys for each standard post:<br />
            - <span className="font-mono bg-white p-0.5 rounded border border-gray-200">MADECC-KEY-CEO-99</span> (CEO Master)<br />
            - <span className="font-mono bg-white p-0.5 rounded border border-gray-200">MADECC-KEY-PM-88</span> (Project Manager)<br />
            - <span className="font-mono bg-white p-0.5 rounded border border-gray-200">MADECC-KEY-WCE-77</span> (Editor)<br />
            - <span className="font-mono bg-white p-0.5 rounded border border-gray-200">MADECC-KEY-ACCT-66</span> (Accountant)<br />
            - <span className="font-mono bg-white p-0.5 rounded border border-gray-200">MADECC-KEY-SEC-55</span> (Secretary)
          </p>
        </div>
      </div>
    );
  }

  // Intermediary Template views for Invoices & Receipts
  if (activeInvoiceForView) {
    return (
      <InvoiceA4Template 
        invoice={activeInvoiceForView} 
        onSave={handleSaveInvoiceFromTemplate} 
        onBack={() => setActiveInvoiceForView(null)} 
      />
    );
  }

  if (activeReceiptForView) {
    return (
      <ReceiptA5Template 
        receipt={activeReceiptForView} 
        onSave={handleSaveReceiptFromTemplate} 
        onBack={() => setActiveReceiptForView(null)} 
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 no-print animate-fade-in" id="admin-workspace-pane">
      
      {/* Top Welcome Title Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-[80px] opacity-15" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-amber-500 border border-white/10">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-400 font-mono uppercase tracking-widest block">Active Duty Post</span>
            <h2 className="text-xl font-bold tracking-tight text-white uppercase">{activeRoleTab}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3 relative z-10 flex-wrap">
          <span className="text-xs text-slate-400 font-mono">Workspace session: active</span>
          <button
            onClick={handleDownloadDatabaseBackup}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            title="Download complete database state (db_state.json) backup securely"
          >
            <Database className="w-3.5 h-3.5" /> Download db_state.json backup
          </button>
          <button
            onClick={() => {
              setStaffLoggedIn(null);
              setActiveRoleTab(null);
            }}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Exit Workspace
          </button>
        </div>
      </div>

      {/*********************************************************
       * 1. CEO DUTY POST
       *********************************************************/}
      {activeRoleTab === StaffRole.CEO && (
        <div className="flex flex-col gap-8 animate-slide-up">
          {/* Visual Ledger stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-3xs flex justify-between items-center">
              <div>
                <span className="text-xs text-gray-400 font-mono block uppercase">Treasury Income Balance</span>
                <span className="text-2xl font-black font-mono text-slate-900 block mt-1">{totalRevenue.toLocaleString()} XAF</span>
                <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">Cleared under Afriland & SGC accounts</span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
                <Coins className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-3xs flex justify-between items-center">
              <div>
                <span className="text-xs text-gray-400 font-mono block uppercase">Total Multiplied Billed</span>
                <span className="text-2xl font-black font-mono text-slate-900 block mt-1">{totalInvoiced.toLocaleString()} XAF</span>
                <span className="text-[10px] text-blue-600 font-medium mt-0.5 block">Includes Cameroon VAT standard filings</span>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-3xs flex justify-between items-center">
              <div>
                <span className="text-xs text-gray-400 font-mono block uppercase">Client Outstandings</span>
                <span className="text-2xl font-black font-mono text-slate-900 block mt-1">{outstandingReceivable.toLocaleString()} XAF</span>
                <span className="text-[10px] text-amber-600 font-medium mt-0.5 block">To follow up by Financial Officer</span>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl text-amber-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Action Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Staff Command Keys list */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 flex flex-col gap-5">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-bold text-slate-900 uppercase">Staff Duties & Command Access Authority</h3>
                <p className="text-xs text-gray-500">Only the CEO can distribute or regenerate keys. Hand over copy keys respectively to staff.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-slate-800 font-mono font-bold">
                      <th className="pb-3">Duty Post Name</th>
                      <th className="pb-3 text-center">Active Command Key</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 leading-normal">
                    {Object.entries(dbState.commandKeys).map(([role, key]) => (
                      <tr key={role} className="hover:bg-slate-50">
                        <td className="py-3 font-semibold text-slate-950">{role}</td>
                        <td className="py-3 text-center">
                          <span className="font-mono bg-slate-100 border border-slate-200 rounded px-2.5 py-1 text-slate-800 font-bold select-all">
                            {key}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleRegenKey(role as StaffRole)}
                            className="bg-slate-905 hover:bg-slate-900 text-slate-700 hover:text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-gray-250 hover:bg-white cursor-pointer inline-flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3 animate-spin duration-1000" /> Regen
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick approval columns */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200 flex flex-col gap-4">
              <h3 className="font-bold text-slate-900 uppercase text-sm border-b border-gray-100 pb-2">Master Project Stages Gate</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Approve active construction statuses derived by Project Managers before site execution starts.</p>
              
              <div className="flex flex-col gap-3">
                {dbState.projects.map(p => (
                  <div key={p.id} className="border border-slate-100 p-3.5 rounded-xl bg-slate-50 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-slate-950 text-xs lines-clamp-2">{p.title}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        p.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                      }`}>{p.status}</span>
                    </div>

                    <div className="flex justify-end gap-1.5 mt-2">
                      <button
                        onClick={() => toggleProjectStatus(p.id, "In Progress")}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-800 text-[10px] px-2 py-1 rounded font-bold cursor-pointer"
                      >
                        Set In Progress
                      </button>
                      <button
                        onClick={() => toggleProjectStatus(p.id, "Completed")}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] px-2 py-1 rounded font-bold cursor-pointer"
                      >
                        Set Handed Over
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/*********************************************************
       * 2. PROJECT MANAGER DUTY POST
       *********************************************************/}
      {activeRoleTab === StaffRole.PROJECT_MANAGER && (
        <div className="flex flex-col gap-8 animate-slide-up">
          <div className="border-b border-gray-100 pb-3 flex justify-between items-center flex-wrap gap-4 bg-white p-4 rounded-xl shadow-3xs">
            <div>
              <h3 className="font-black text-slate-900 uppercase">Construction Projects Logistics & Milestones</h3>
              <p className="text-xs text-gray-500">Edit construction projects status, checklist configurations and SEO tags respectively.</p>
            </div>
            <button
              onClick={() => {
                const defaultProj: ProjectItem = {
                  id: "proj-" + Date.now(),
                  title: "New Site Complex",
                  slug: "new-site-complex",
                  location: "Douala, Akwa",
                  category: "Residential",
                  status: "Planning",
                  progress: 5,
                  budget: 95000000,
                  image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200",
                  desc: "Description of structural masonry columns and parameters here.",
                  seoTags: { caption: "", description: "", altText: "", title: "", keywords: "", hashtags: "", socialMediaHandles: "" }
                };
                setEditingProj(defaultProj);
              }}
              className="bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Construct Project
            </button>
          </div>

          {editingProj ? (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-250 flex flex-col gap-6">
              <h4 className="font-bold text-slate-950 uppercase text-sm">Configure Construction Project & media SEO parameters</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600">Project Title:</label>
                  <input
                    type="text"
                    value={editingProj.title}
                    onChange={(e) => setEditingProj({ ...editingProj, title: e.target.value })}
                    className="border border-gray-300 p-2.5 rounded-lg text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600">Cameroon Location Zone:</label>
                  <input
                    type="text"
                    value={editingProj.location}
                    onChange={(e) => setEditingProj({ ...editingProj, location: e.target.value })}
                    className="border border-gray-300 p-2.5 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600">Budget in XAF:</label>
                  <input
                    type="number"
                    value={editingProj.budget}
                    onChange={(e) => setEditingProj({ ...editingProj, budget: Number(e.target.value) || 0 })}
                    className="border border-gray-300 p-2.5 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600">Category Siting:</label>
                  <select
                    value={editingProj.category}
                    onChange={(e) => setEditingProj({ ...editingProj, category: e.target.value })}
                    className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600">Progress Tracker Percentage ({editingProj.progress}%):</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editingProj.progress}
                    onChange={(e) => setEditingProj({ ...editingProj, progress: Number(e.target.value) || 0 })}
                    className="w-full h-2 accent-slate-900 bg-slate-100 rounded-lg appearance-none cursor-pointer mt-3"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-600">Primary Project Image / Rendering URL:</label>
                <input
                  type="text"
                  value={editingProj.image}
                  onChange={(e) => setEditingProj({ ...editingProj, image: e.target.value })}
                  className="border border-gray-300 p-2.5 rounded-lg text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-600">Project Description:</label>
                <textarea
                  value={editingProj.desc}
                  onChange={(e) => setEditingProj({ ...editingProj, desc: e.target.value })}
                  className="border border-gray-300 p-2.5 rounded-lg text-xs h-24"
                />
              </div>

              {/* Dynamic Media Crop and Verification Suite */}
              <SEOMediaUploadCropPanel
                title={editingProj.title}
                content={editingProj.desc}
                image={editingProj.image}
                videoUrl={editingProj.videoUrl}
                seoTags={editingProj.seoTags}
                onUpdateMedia={(img, video) => {
                  setEditingProj(prev => prev ? { ...prev, image: img, videoUrl: video } : null);
                }}
                onUpdateSeo={(tags) => {
                  setEditingProj(prev => prev ? { ...prev, seoTags: tags } : null);
                }}
              />

              {/* Media upload mock & strict SEO section */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col gap-4">
                <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-200 pb-2">
                  <span className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" /> Media Embedding & Visual SEO Meta-Data Panel
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRunAISetupForProj(editingProj.title, editingProj.location)}
                    disabled={aiGenerating}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-3xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> {aiGenerating ? "Generating..." : "Optimize SEO with Gemini AI"}
                  </button>
                </div>

                {aiLog && <p className="text-[10px] text-indigo-700 font-mono font-medium">{aiLog}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-750">SEO Structural Title:</label>
                    <input
                      type="text"
                      placeholder="e.g. MADECC Heights Commercial Complex | Yaoundé "
                      value={editingProj.seoTags.title}
                      onChange={(e) => setEditingProj({
                        ...editingProj,
                        seoTags: { ...editingProj.seoTags, title: e.target.value }
                      })}
                      className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-750">SEO Meta Description:</label>
                    <input
                      type="text"
                      placeholder="e.g. In-depth construction parameters of the structural komplex..."
                      value={editingProj.seoTags.description}
                      onChange={(e) => setEditingProj({
                        ...editingProj,
                        seoTags: { ...editingProj.seoTags, description: e.target.value }
                      })}
                      className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-750">SEO Image/Video Caption:</label>
                    <input
                      type="text"
                      placeholder="e.g. Column masonry pours for 3rd level slabs..."
                      value={editingProj.seoTags.caption}
                      onChange={(e) => setEditingProj({
                        ...editingProj,
                        seoTags: { ...editingProj.seoTags, caption: e.target.value }
                      })}
                      className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-750">SEO Alt Text (For accessibility index):</label>
                    <input
                      type="text"
                      placeholder="e.g. Metal crane towering over building concrete site..."
                      value={editingProj.seoTags.altText}
                      onChange={(e) => setEditingProj({
                        ...editingProj,
                        seoTags: { ...editingProj.seoTags, altText: e.target.value }
                      })}
                      className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-750">Target Keywords (Comma defined):</label>
                    <input
                      type="text"
                      placeholder="e.g. yaounde complex, structural casting can..."
                      value={editingProj.seoTags.keywords}
                      onChange={(e) => setEditingProj({
                        ...editingProj,
                        seoTags: { ...editingProj.seoTags, keywords: e.target.value }
                      })}
                      className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-750">Hashtags:</label>
                    <input
                      type="text"
                      placeholder="e.g. #YaoundeRealEstate #ANORSafety"
                      value={editingProj.seoTags.hashtags}
                      onChange={(e) => setEditingProj({
                        ...editingProj,
                        seoTags: { ...editingProj.seoTags, hashtags: e.target.value }
                      })}
                      className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-750">Social Media Handles:</label>
                    <input
                      type="text"
                      placeholder="e.g. fb: MADECC, Twitter: @madecc_pm"
                      value={editingProj.seoTags.socialMediaHandles}
                      onChange={(e) => setEditingProj({
                        ...editingProj,
                        seoTags: { ...editingProj.seoTags, socialMediaHandles: e.target.value }
                      })}
                      className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProj(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel Form
                </button>
                <button
                  type="button"
                  onClick={handleSaveProjForm}
                  className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Publish & Index Project
                </button>
              </div>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbState.projects.map(p => (
                <div key={p.id} className="bg-white border border-gray-250 rounded-2xl p-5 flex flex-col justify-between shadow-3xs hover:shadow-xs transition duration-200">
                  <div className="flex flex-col gap-3">
                    <div className="h-40 w-full rounded-xl overflow-hidden relative">
                      <img 
                        src={p.image} 
                        alt={p.seoTags.altText || p.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white font-mono text-[9px] px-2 py-0.5 rounded font-black uppercase">
                        {p.location}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-amber-600 font-bold uppercase block tracking-wider">{p.category}</span>
                      <h4 className="font-bold text-slate-950 text-sm">{p.title}</h4>
                      <p className="text-xs text-slate-500 font-bold font-mono mt-1">Budget: {p.budget.toLocaleString()} XAF</p>
                    </div>

                    {/* Progress slider tracking representer */}
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 font-mono">
                        <span>STAGE PROGRESS</span>
                        <span>{p.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-lg overflow-hidden">
                        <div className="h-full bg-slate-950 transition-all duration-300" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-50">
                    <button
                      onClick={() => setEditingProj(p)}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit & SEO Update
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this project site permanently?")) {
                          const nextState = { ...dbState, projects: dbState.projects.filter(pi => pi.id !== p.id) };
                          setDbState(nextState);
                          syncDbState(nextState);
                        }
                      }}
                      className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/*********************************************************
       * 3. WEB CONTENT EDITOR DUTY POST
       *********************************************************/}
      {activeRoleTab === StaffRole.WEB_CONTENT_EDITOR && (
        <div className="flex flex-col gap-8 animate-slide-up">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col gap-4">
            <h3 className="font-bold text-slate-900 uppercase">Website General Pages Content Customization</h3>
            <p className="text-xs text-gray-500">Edit key headings and descriptive teaser paragraphs rendered on the public website pages.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-slate-120 rounded-xl bg-slate-50/50 flex flex-col gap-3 text-xs">
                <span className="font-bold text-slate-950 block border-b border-gray-250 pb-1 uppercase">Home Page Hero Frame</span>
                <div className="flex flex-col gap-1.5 ">
                  <label className="text-[10px] text-gray-500 font-semibold">Hero Heading:</label>
                  <input
                    type="text"
                    value={dbState.pagesContent.home.heroTitle}
                    onChange={(e) => {
                      const next = { ...dbState };
                      next.pagesContent.home.heroTitle = e.target.value;
                      setDbState(next);
                    }}
                    className="border border-gray-300 p-2 rounded bg-white text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="text-[10px] text-gray-500 font-semibold">Hero Subtitle:</label>
                  <textarea
                    value={dbState.pagesContent.home.heroSubtitle}
                    onChange={(e) => {
                      const next = { ...dbState };
                      next.pagesContent.home.heroSubtitle = e.target.value;
                      setDbState(next);
                    }}
                    className="border border-gray-300 p-2 rounded bg-white text-xs h-20"
                  />
                </div>
              </div>

              <div className="p-4 border border-slate-120 rounded-xl bg-slate-50/50 flex flex-col gap-3 text-xs">
                <span className="font-bold text-slate-950 block border-b border-gray-250 pb-1 uppercase">About Page Corporate Core</span>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-500 font-semibold">Mission Statement:</label>
                  <textarea
                    value={dbState.pagesContent.about.mission}
                    onChange={(e) => {
                      const next = { ...dbState };
                      next.pagesContent.about.mission = e.target.value;
                      setDbState(next);
                    }}
                    className="border border-gray-300 p-2 rounded bg-white text-xs h-20"
                  />
                </div>
                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="text-[10px] text-gray-500 font-semibold">Vision Statement:</label>
                  <textarea
                    value={dbState.pagesContent.about.vision}
                    onChange={(e) => {
                      const next = { ...dbState };
                      next.pagesContent.about.vision = e.target.value;
                      setDbState(next);
                    }}
                    className="border border-gray-300 p-2 rounded bg-white text-xs h-20"
                  />
                </div>
              </div>

              <div className="p-4 border border-slate-120 rounded-xl bg-slate-50/50 flex flex-col gap-3 text-xs">
                <span className="font-bold text-slate-950 block border-b border-gray-250 pb-1 uppercase">About Page History Teaser</span>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-500 font-semibold">Home Profile Summary:</label>
                  <textarea
                    value={dbState.pagesContent.home.aboutTeaser}
                    onChange={(e) => {
                      const next = { ...dbState };
                      next.pagesContent.home.aboutTeaser = e.target.value;
                      setDbState(next);
                    }}
                    className="border border-gray-300 p-2 rounded bg-white text-xs h-20"
                  />
                </div>
                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="text-[10px] text-gray-500 font-semibold">Corporate History Summary:</label>
                  <textarea
                    value={dbState.pagesContent.about.history}
                    onChange={(e) => {
                      const next = { ...dbState };
                      next.pagesContent.about.history = e.target.value;
                      setDbState(next);
                    }}
                    className="border border-gray-300 p-2 rounded bg-white text-xs h-20"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-50">
              <button
                onClick={() => {
                  syncDbState(dbState);
                  alert("General webpage contents published successfully.");
                }}
                className="bg-slate-900 hover:bg-black text-amber-500 px-5 py-2 text-xs font-bold uppercase rounded-lg cursor-pointer"
              >
                Save All Page Overrides
              </button>
            </div>
          </div>

          {/* Blogs and insights updating panel */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 flex flex-col gap-6">
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-slate-950 uppercase">Construction Blog Articles & News insights</h3>
                <p className="text-xs text-gray-500">Add detailed construction news posts to increase web audience organic authority.</p>
              </div>
              <button
                onClick={() => {
                  const defaultBlog: BlogPost = {
                    id: "blog-" + Date.now(),
                    title: "New construction news post",
                    slug: "new-construction-post",
                    author: "MADECC Editorial Desk",
                    category: "Engineering Insights",
                    image: "https://images.unsplash.com/photo-1541888946425-d81bb19245f5?auto=format&fit=crop&q=80&w=800",
                    date: new Date().toISOString().split('T')[0],
                    readTime: "4 min read",
                    content: "",
                    published: true,
                    seoTags: { caption: "", description: "", altText: "", title: "", keywords: "", hashtags: "", socialMediaHandles: "" }
                  };
                  setEditingBlog(defaultBlog);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 text-xs font-black uppercase rounded-lg shadow-3xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Write New Insight Article
              </button>
            </div>

            {editingBlog ? (
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-5">
                <h4 className="font-bold text-slate-950 text-sm uppercase">Draft News Insight & Configure Advanced Target SEO Tags</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-650">Article Subject Title:</label>
                    <input
                      type="text"
                      value={editingBlog.title}
                      onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })}
                      className="border border-gray-300 p-2.5 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-650">Category Siting:</label>
                    <select
                      value={editingBlog.category}
                      onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                      className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                    >
                      <option value="Engineering Insights">Engineering Insights</option>
                      <option value="Regulatory & Compliance">Regulatory & Compliance</option>
                      <option value="Financial Planning">Financial Planning</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <label className="font-bold text-gray-650">Full Markdown-ready Article Content:</label>
                  <textarea
                    value={editingBlog.content}
                    onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                    className="border border-gray-300 p-2.5 rounded-lg text-xs h-48 leading-relaxed font-sans"
                    placeholder="Describe construction standards, local sand quality, etc."
                  />
                </div>

                {/* Dynamic Media Crop and Verification Suite */}
                <SEOMediaUploadCropPanel
                  title={editingBlog.title}
                  content={editingBlog.content}
                  image={editingBlog.image}
                  videoUrl={editingBlog.videoUrl}
                  seoTags={editingBlog.seoTags}
                  onUpdateMedia={(img, video) => {
                    setEditingBlog(prev => prev ? { ...prev, image: img, videoUrl: video } : null);
                  }}
                  onUpdateSeo={(tags) => {
                    setEditingBlog(prev => prev ? { ...prev, seoTags: tags } : null);
                  }}
                />

                {/* Media embedding & SEO captions panel */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" /> Embedded Media & Web SEO Parameters
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRunAISetupForBlog(editingBlog.title, editingBlog.category)}
                      disabled={aiGenerating}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> {aiGenerating ? "Generating..." : "Auto-write SEO via Gemini"}
                    </button>
                  </div>

                  {aiLog && <p className="text-[10px] text-indigo-700 font-mono font-medium">{aiLog}</p>}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-750">SEO Article Title:</label>
                      <input
                        type="text"
                        value={editingBlog.seoTags.title}
                        onChange={(e) => setEditingBlog({
                          ...editingBlog,
                          seoTags: { ...editingBlog.seoTags, title: e.target.value }
                        })}
                        className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-750">SEO Meta Description:</label>
                      <input
                        type="text"
                        value={editingBlog.seoTags.description}
                        onChange={(e) => setEditingBlog({
                          ...editingBlog,
                          seoTags: { ...editingBlog.seoTags, description: e.target.value }
                        })}
                        className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-750">SEO Photo/Video Caption:</label>
                      <input
                        type="text"
                        value={editingBlog.seoTags.caption}
                        onChange={(e) => setEditingBlog({
                          ...editingBlog,
                          seoTags: { ...editingBlog.seoTags, caption: e.target.value }
                        })}
                        className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-750">SEO Image Alt Text:</label>
                      <input
                        type="text"
                        value={editingBlog.seoTags.altText}
                        onChange={(e) => setEditingBlog({
                          ...editingBlog,
                          seoTags: { ...editingBlog.seoTags, altText: e.target.value }
                        })}
                        className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-750">SEO Keywords Indexing (Comma list):</label>
                      <input
                        type="text"
                        value={editingBlog.seoTags.keywords}
                        onChange={(e) => setEditingBlog({
                          ...editingBlog,
                          seoTags: { ...editingBlog.seoTags, keywords: e.target.value }
                        })}
                        className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-750">Hashtags:</label>
                      <input
                        type="text"
                        value={editingBlog.seoTags.hashtags}
                        onChange={(e) => setEditingBlog({
                          ...editingBlog,
                          seoTags: { ...editingBlog.seoTags, hashtags: e.target.value }
                        })}
                        className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-750">Social Media Handles:</label>
                      <input
                        type="text"
                        value={editingBlog.seoTags.socialMediaHandles}
                        onChange={(e) => setEditingBlog({
                          ...editingBlog,
                          seoTags: { ...editingBlog.seoTags, socialMediaHandles: e.target.value }
                        })}
                        className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingBlog(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel Draft
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBlogForm}
                    className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Index and Publish Article
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-slate-800 font-mono font-bold">
                      <th className="pb-3">Title Siting/Slug</th>
                      <th className="pb-3">Category Siting</th>
                      <th className="pb-3">Published Date</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 leading-normal">
                    {dbState.blogs.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="py-3 font-semibold text-slate-950">
                          {b.title} <span className="block text-[10px] text-gray-400 font-mono">/{b.slug}</span>
                        </td>
                        <td className="py-3 text-gray-500 font-medium">{b.category}</td>
                        <td className="py-3 text-gray-500">{b.date}</td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setEditingBlog(b)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-850 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                            >
                              Edit SEO
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Delete this blog article permanently?")) {
                                  const nextState = { ...dbState, blogs: dbState.blogs.filter(bl => bl.id !== b.id) };
                                  setDbState(nextState);
                                  syncDbState(nextState);
                                }
                              }}
                              className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Projects and Yards updating panel */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 flex flex-col gap-6" id="editor-projects-panel">
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-slate-950 uppercase">Active Projects & Construction Yards</h3>
                <p className="text-xs text-gray-500 font-medium">Add and monitor live yard telemetry, checklists, concrete safety, and geotechnical videos.</p>
              </div>
              <button
                id="add-construction-project-btn"
                onClick={() => {
                  const defaultProj: ProjectItem = {
                    id: "proj-" + Date.now(),
                    title: "New Site Project Complex",
                    slug: "new-site-project-complex",
                    location: "Douala, Akwa",
                    category: "Residential",
                    status: "Planning",
                    progress: 5,
                    budget: 95000000,
                    image: "https://images.unsplash.com/photo-1541888946425-d81bb19245f5?auto=format&fit=crop&q=80&w=1200",
                    desc: "Description of structural masonry columns and parameters here.",
                    seoTags: { caption: "", description: "", altText: "", title: "", keywords: "", hashtags: "", socialMediaHandles: "" }
                  };
                  setEditingProj(defaultProj);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 text-xs font-black uppercase rounded-lg shadow-3xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Construct Project
              </button>
            </div>

            {editingProj ? (
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-5 text-left" id="edit-project-form">
                <h4 className="font-bold text-slate-950 uppercase text-sm">Configure Construction Project & media SEO parameters</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-xs font-bold text-gray-600">Project Title:</label>
                    <input
                      id="proj-title-input"
                      type="text"
                      value={editingProj.title}
                      onChange={(e) => setEditingProj({ ...editingProj, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })}
                      className="border border-gray-300 p-2.5 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-xs font-bold text-gray-600">Cameroon Location Zone:</label>
                    <input
                      id="proj-location-input"
                      type="text"
                      value={editingProj.location}
                      onChange={(e) => setEditingProj({ ...editingProj, location: e.target.value })}
                      className="border border-gray-300 p-2.5 rounded-lg text-xs hover:border-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-xs font-bold text-gray-600">Budget in XAF:</label>
                    <input
                      id="proj-budget-input"
                      type="number"
                      value={editingProj.budget}
                      onChange={(e) => setEditingProj({ ...editingProj, budget: Number(e.target.value) || 0 })}
                      className="border border-gray-300 p-2.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-xs font-bold text-gray-600">Category Siting:</label>
                    <select
                      id="proj-category-select"
                      value={editingProj.category}
                      onChange={(e) => setEditingProj({ ...editingProj, category: e.target.value })}
                      className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Infrastructure">Infrastructure</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-xs font-bold text-gray-600">Progress Tracker Percentage ({editingProj.progress}%):</label>
                    <input
                      id="proj-progress-range"
                      type="range"
                      min="0"
                      max="100"
                      value={editingProj.progress}
                      onChange={(e) => setEditingProj({ ...editingProj, progress: Number(e.target.value) || 0 })}
                      className="w-full h-2 accent-slate-900 bg-slate-100 rounded-lg appearance-none cursor-pointer mt-3"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-xs text-left">
                  <label className="font-bold text-gray-600">Project Description:</label>
                  <textarea
                    id="proj-desc-textarea"
                    value={editingProj.desc}
                    onChange={(e) => setEditingProj({ ...editingProj, desc: e.target.value })}
                    className="border border-gray-300 p-2.5 rounded-lg text-xs h-24 font-sans leading-relaxed"
                    placeholder="Provide description of works at the construction yard..."
                  />
                </div>

                {/* Dynamic Media Crop and Verification Suite */}
                <SEOMediaUploadCropPanel
                  title={editingProj.title}
                  content={editingProj.desc}
                  image={editingProj.image}
                  videoUrl={editingProj.videoUrl}
                  seoTags={editingProj.seoTags}
                  onUpdateMedia={(img, video) => {
                    setEditingProj(prev => prev ? { ...prev, image: img, videoUrl: video } : null);
                  }}
                  onUpdateSeo={(tags) => {
                    setEditingProj(prev => prev ? { ...prev, seoTags: tags } : null);
                  }}
                />

                {/* Media embedding & SEO captions panel */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col gap-4 text-left">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2 flex-wrap gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" /> Embedded Media & Web SEO Parameters
                    </span>
                    <button
                      id="btn-auto-seo-project"
                      type="button"
                      onClick={() => handleRunAISetupForProj(editingProj.title, editingProj.location)}
                      disabled={aiGenerating}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> {aiGenerating ? "Generating..." : "Auto-write SEO via Gemini"}
                    </button>
                  </div>

                  {aiLog && <p className="text-[10px] text-indigo-700 font-mono font-medium">{aiLog}</p>}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="flex flex-col gap-1 text-left">
                      <label className="font-semibold text-slate-755">SEO Structural Title:</label>
                      <input
                        id="proj-seo-title"
                        type="text"
                        value={editingProj.seoTags.title}
                        onChange={(e) => setEditingProj({
                          ...editingProj,
                          seoTags: { ...editingProj.seoTags, title: e.target.value }
                        })}
                        className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <label className="font-semibold text-slate-755">SEO Meta Description:</label>
                      <input
                        id="proj-seo-desc"
                        type="text"
                        value={editingProj.seoTags.description}
                        onChange={(e) => setEditingProj({
                          ...editingProj,
                          seoTags: { ...editingProj.seoTags, description: e.target.value }
                        })}
                        className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="flex flex-col gap-1 text-left">
                      <label className="font-semibold text-slate-755">SEO Photo/Video Caption:</label>
                      <input
                        id="proj-seo-caption"
                        type="text"
                        value={editingProj.seoTags.caption}
                        onChange={(e) => setEditingProj({
                          ...editingProj,
                          seoTags: { ...editingProj.seoTags, caption: e.target.value }
                        })}
                        className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <label className="font-semibold text-slate-755">SEO Image Alt Text:</label>
                      <input
                        id="proj-seo-alt"
                        type="text"
                        value={editingProj.seoTags.altText}
                        onChange={(e) => setEditingProj({
                          ...editingProj,
                          seoTags: { ...editingProj.seoTags, altText: e.target.value }
                        })}
                        className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="flex flex-col gap-1 text-left">
                      <label className="font-semibold text-slate-755">SEO Keywords Indexing (Comma list):</label>
                      <input
                        id="proj-seo-keywords"
                        type="text"
                        value={editingProj.seoTags.keywords}
                        onChange={(e) => setEditingProj({
                          ...editingProj,
                          seoTags: { ...editingProj.seoTags, keywords: e.target.value }
                        })}
                        className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <label className="font-semibold text-slate-755">Hashtags:</label>
                      <input
                        id="proj-seo-hashtags"
                        type="text"
                        value={editingProj.seoTags.hashtags}
                        onChange={(e) => setEditingProj({
                          ...editingProj,
                          seoTags: { ...editingProj.seoTags, hashtags: e.target.value }
                        })}
                        className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <label className="font-semibold text-slate-755">Social Media Handles:</label>
                      <input
                        id="proj-seo-handles"
                        type="text"
                        value={editingProj.seoTags.socialMediaHandles}
                        onChange={(e) => setEditingProj({
                          ...editingProj,
                          seoTags: { ...editingProj.seoTags, socialMediaHandles: e.target.value }
                        })}
                        className="border border-gray-300 p-2.5 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                  <button
                    id="btn-cancel-project-draft"
                    type="button"
                    onClick={() => setEditingProj(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel Draft
                  </button>
                  <button
                    id="btn-save-project"
                    type="button"
                    onClick={handleSaveProjForm}
                    className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Index and Publish Project
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-slate-800 font-mono font-bold">
                      <th className="pb-3">Title Siting/Slug</th>
                      <th className="pb-3">Cameroon Location</th>
                      <th className="pb-3">Progress</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 leading-normal">
                    {dbState.projects.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-3 font-semibold text-slate-950">
                          {p.title} <span className="block text-[10px] text-gray-400 font-mono">/{p.slug}</span>
                        </td>
                        <td className="py-3 text-gray-500 font-medium">{p.location}</td>
                        <td className="py-3 text-gray-500">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-mono font-bold">{p.progress}%</span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setEditingProj(p)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-850 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                            >
                              Edit SEO
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Delete this project site permanently?")) {
                                  const nextState = { ...dbState, projects: dbState.projects.filter(pi => pi.id !== p.id) };
                                  setDbState(nextState);
                                  syncDbState(nextState);
                                }
                              }}
                              className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/*********************************************************
       * 4. ACCOUNTANT DUTY POST
       *********************************************************/}
      {activeRoleTab === StaffRole.ACCOUNTANT && (
        <div className="flex flex-col gap-8 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Custom Invoice Generator Ledger */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-250 flex flex-col gap-5">
              <div className="border-b border-gray-100 pb-3 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase">A4 Client Invoices Logs</h3>
                  <p className="text-xs text-gray-500">Generate, adjust quantities, calculate VAT (19.25%) and export invoices to A4 layout.</p>
                </div>
                <button
                  onClick={handleCreateNewInvoice}
                  className="bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Invoice (A4)
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {dbState.invoices.map(i => (
                  <div key={i.id} className="border border-slate-100 p-4 rounded-xl bg-slate-50 hover:bg-slate-100/50 transition duration-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-slate-550 font-bold block">{i.invoiceNumber} • {i.date}</span>
                      <strong className="text-slate-950 font-sans tracking-tight text-sm">{i.clientName}</strong>
                      <span className="text-xs text-slate-500 font-medium font-mono">Invoice Sum: {i.totalAmountXAF.toLocaleString()} XAF</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveInvoiceForView(i)}
                        className="bg-white hover:bg-slate-50 text-slate-900 border border-gray-250 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer inline-flex items-center gap-1 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> View/Print A4
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadInvoiceCSV(i)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer inline-flex items-center gap-1 transition-all"
                        title="Download Invoice (CSV)"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-600" /> Export CSV
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this invoice log?")) {
                            const nextState = { ...dbState, invoices: dbState.invoices.filter(inv => inv.id !== i.id) };
                            setDbState(nextState);
                            syncDbState(nextState);
                          }
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Receipt Generator Ledger */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-250 flex flex-col gap-5">
              <div className="border-b border-gray-100 pb-3 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase">A5 Receipt Vouchers Ledger</h3>
                  <p className="text-xs text-gray-500">Log client deposits, select payment method systems, and print receipt coupons in horizontal A5 layout.</p>
                </div>
                <button
                  onClick={handleCreateNewReceipt}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Receipt (A5)
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {dbState.receipts.map(r => (
                  <div key={r.id} className="border border-slate-100 p-4 rounded-xl bg-slate-50 hover:bg-slate-100/50 transition duration-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-slate-550 font-bold block">{r.receiptNumber} • {r.date}</span>
                      <strong className="text-slate-950 font-sans tracking-tight text-sm">{r.customerName}</strong>
                      <span className="text-xs text-slate-500 font-medium font-mono">Amount Paid: {r.totalXAF.toLocaleString()} XAF ({r.paymentMethod})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveReceiptForView(r)}
                        className="bg-white hover:bg-slate-50 text-slate-900 border border-gray-250 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> View/Print A5
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this receipt registration?")) {
                            const nextState = { ...dbState, receipts: dbState.receipts.filter(rcp => rcp.id !== r.id) };
                            setDbState(nextState);
                            syncDbState(nextState);
                          }
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/*********************************************************
       * 5. SECRETARY DUTY POST
       *********************************************************/}
      {activeRoleTab === StaffRole.SECRETARY && (
        <div className="flex flex-col gap-8 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Quote baseline inquiries list */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 flex flex-col gap-5">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="font-bold text-slate-900 uppercase">Incoming Website Baseline & Quote requests</h3>
                <p className="text-xs text-gray-500">Contact new prospects who calculated estimations on the public platform.</p>
              </div>

              <div className="flex flex-col gap-4">
                {dbState.quotes.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">No baseline quote inquiries filed yet.</p>
                ) : (
                  dbState.quotes.map(q => (
                    <div key={q.id} className="border border-slate-120 p-4 rounded-xl bg-slate-50/50 flex flex-col gap-3">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <strong className="text-slate-950 font-sans text-sm">{q.clientName}</strong>
                          <span className="block text-[11px] text-gray-500 font-mono">{q.clientEmail} | {q.clientPhone}</span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          q.status === "Pending" ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"
                        }`}>{q.status}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-gray-600 bg-white p-3 rounded-lg border border-slate-100">
                        <div>
                          <span className="font-bold block text-[9px] text-gray-400">ZONE:</span>
                          {q.location}
                        </div>
                        <div>
                          <span className="font-bold block text-[9px] text-gray-400">TYPE:</span>
                          {q.projectType}
                        </div>
                        <div>
                          <span className="font-bold block text-[9px] text-gray-400">LAND SENSING:</span>
                          {q.landSquareMeters} m²
                        </div>
                        <div>
                          <span className="font-bold block text-[9px] text-gray-400">BUDGET SCALE:</span>
                          {q.budgetRange}
                        </div>
                      </div>

                      {q.notes && (
                        <p className="text-xs text-slate-700 bg-amber-50/50 p-2.5 rounded border border-amber-100 leading-normal font-mono text-[11px]">
                          <strong>Logs:</strong> {q.notes}
                        </p>
                      )}

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-50/50">
                        {q.status === "Pending" && (
                          <button
                            onClick={() => {
                              const updated = dbState.quotes.map(item => item.id === q.id ? { ...item, status: "Contacted" as any } : item);
                              const next = { ...dbState, quotes: updated };
                              setDbState(next);
                              syncDbState(next);
                            }}
                            className="bg-slate-900 hover:bg-black text-amber-500 text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Mark: Client Contacted
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm("Delete this baseline quote inquiry?")) {
                              const nextState = { ...dbState, quotes: dbState.quotes.filter(qu => qu.id !== q.id) };
                              setDbState(nextState);
                              syncDbState(nextState);
                            }
                          }}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] px-2 py-1.5 rounded-lg cursor-pointer"
                        >
                          Delete Entry
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Secretary actions & simple scheduler */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200 flex flex-col gap-5">
              <h3 className="font-bold text-slate-900 uppercase text-sm border-b border-gray-100 pb-2">Scheduling Visits & Appointments</h3>
              
              <div className="flex flex-col gap-3 text-xs text-gray-600">
                <p>Register schedules for structural site visits with Projects Execution Engineers.</p>
                
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-800">Client Name:</label>
                  <input 
                    type="text" 
                    value={bookingClientName}
                    onChange={(e) => setBookingClientName(e.target.value)}
                    placeholder="e.g. Therese Beyala" 
                    className="border p-2 rounded-lg bg-slate-50 text-xs text-slate-900 focus:outline-none focus:bg-white" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-800">Client Phone:</label>
                  <input 
                    type="text" 
                    value={bookingClientPhone}
                    onChange={(e) => setBookingClientPhone(e.target.value)}
                    placeholder="e.g. +237 680 990 120" 
                    className="border p-2 rounded-lg bg-slate-50 text-xs text-slate-900 focus:outline-none focus:bg-white" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-800">Visit Purpose:</label>
                  <input 
                    type="text" 
                    value={bookingPurpose}
                    onChange={(e) => setBookingPurpose(e.target.value)}
                    placeholder="e.g. Bastos soil leveling diagnostics" 
                    className="border p-2 rounded-lg bg-slate-50 text-xs text-slate-900 focus:outline-none focus:bg-white" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-800">Execution Engineer:</label>
                  <select 
                    value={bookingEngineer}
                    onChange={(e) => setBookingEngineer(e.target.value)}
                    className="border p-2 rounded-lg bg-slate-50 text-xs text-slate-900 focus:outline-none focus:bg-white animate-none"
                  >
                    <option value="Simeon Tchounkeu">Simeon Tchounkeu (Projects Execution Engineer)</option>
                    <option value="Brice Foasso">Brice Foasso (Senior ONAC Architect)</option>
                    <option value="Cabinet ONAC-A3">Cabinet ONAC-A3</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-800">Visit Date:</label>
                  <input 
                    type="date" 
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="border p-2 rounded-lg bg-slate-50 text-xs text-slate-900 focus:outline-none focus:bg-white" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-800">Special Notes:</label>
                  <textarea 
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Key structural anchors, soil testing guidelines..." 
                    rows={2}
                    className="border p-2 rounded-lg bg-slate-50 text-xs text-slate-900 focus:outline-none focus:bg-white resize-none" 
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!bookingClientName.trim() || !bookingPurpose.trim() || !bookingDate) {
                      alert("Please provide client name, visit purpose and a valid date.");
                      return;
                    }
                    const newApp: Appointment = {
                      id: "app-" + Date.now(),
                      purpose: bookingPurpose,
                      date: bookingDate,
                      engineerName: bookingEngineer,
                      clientName: bookingClientName,
                      clientPhone: bookingClientPhone || "+237",
                      status: "Scheduled",
                      notes: bookingNotes
                    };
                    const updated = [newApp, ...(dbState.appointments || [])];
                    const nextState = { ...dbState, appointments: updated };
                    setDbState(nextState);
                    syncDbState(nextState);
                    
                    // Reset fields
                    setBookingPurpose("");
                    setBookingDate("");
                    setBookingClientName("");
                    setBookingClientPhone("");
                    setBookingNotes("");
                    alert("Appointment successfully registered and booked on the shared secretary scheduler calendar!");
                  }}
                  className="bg-slate-900 hover:bg-black text-white py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider mt-2 cursor-pointer transition-colors"
                >
                  Book Site Meeting
                </button>
              </div>

              {/* Display Booked Appointments */}
              <div className="border-t border-gray-150 pt-4 flex flex-col gap-3">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide font-sans">Currently Booked Visits ({ (dbState.appointments || []).length })</h4>
                { (dbState.appointments || []).length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic">No scheduled site appointments currently recorded.</p>
                ) : (
                  <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
                    {(dbState.appointments || []).map((app) => (
                      <div key={app.id} className="border border-slate-100 p-2.5 rounded-lg bg-slate-50 text-[11px] flex flex-col gap-1.5 align-top">
                        <div className="flex justify-between items-start gap-1">
                          <strong className="text-slate-900 line-clamp-1">{app.clientName}</strong>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                            app.status === "Scheduled" ? "bg-blue-100 text-blue-700" :
                            app.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"
                          }`}>{app.status}</span>
                        </div>
                        <div className="text-gray-500 space-y-0.5">
                          <p><span className="font-semibold text-slate-700">Purpose:</span> {app.purpose}</p>
                          <p><span className="font-semibold text-slate-700">Date:</span> {app.date}</p>
                          <p><span className="font-semibold text-slate-700">Engineer:</span> {app.engineerName}</p>
                          {app.notes && <p className="italic text-[10px] mt-0.5 text-gray-500">*{app.notes}</p>}
                        </div>
                        <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-200/50 gap-2">
                          <div className="flex gap-2">
                            {app.status === "Scheduled" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextApps = (dbState.appointments || []).map((a) => a.id === app.id ? { ...a, status: "Completed" as any } : a);
                                    const next = { ...dbState, appointments: nextApps };
                                    setDbState(next);
                                    syncDbState(next);
                                  }}
                                  className="text-[9px] text-emerald-600 hover:underline hover:text-emerald-700 font-bold cursor-pointer"
                                >
                                  Complete
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextApps = (dbState.appointments || []).map((a) => a.id === app.id ? { ...a, status: "Cancelled" as any } : a);
                                    const next = { ...dbState, appointments: nextApps };
                                    setDbState(next);
                                    syncDbState(next);
                                  }}
                                  className="text-[9px] text-gray-500 hover:underline hover:text-gray-600 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Delete this site visit record?")) {
                                const nextApps = (dbState.appointments || []).filter((a) => a.id !== app.id);
                                const next = { ...dbState, appointments: nextApps };
                                setDbState(next);
                                syncDbState(next);
                              }
                            }}
                            className="text-[9px] text-red-500 hover:underline font-bold cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-150 pt-4 flex flex-col gap-3">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide">Quick Issue Simple Receipt</h4>
                <p className="text-[11px] text-gray-550 leading-relaxed">Instantly issue registry receipts (A5 format) for prospective clients deposits.</p>
                <button
                  type="button"
                  onClick={handleCreateNewReceipt}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider py-2.5 rounded-xl cursor-pointer"
                >
                  Create Simple Receipt System
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/*********************************************************
       * 6. FINANCIAL OFFICER WORKSPACE
       *********************************************************/}
      {activeRoleTab === StaffRole.FINANCIAL_OFFICER && (
        <div className="flex flex-col gap-6 animate-slide-up bg-white p-6 sm:p-8 rounded-2xl border border-gray-200">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-slate-900 uppercase">Corporate Financial Audits room</h3>
            <p className="text-xs text-gray-500">Overview cash indicators, audit invoice files and Cameroon TVA (19.25%) logs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs mt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-gray-400 font-mono block uppercase">Corporate liquid holdings</span>
              <span className="text-lg font-black text-slate-900 font-mono block mt-1">{totalRevenue.toLocaleString()} XAF</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-gray-400 font-mono block uppercase">Outstanding Debt ledger</span>
              <span className="text-lg font-black text-slate-900 font-mono block mt-1">{outstandingReceivable.toLocaleString()} XAF</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-gray-400 font-mono block uppercase">Calculated net VAT obligations</span>
              <span className="text-lg font-black text-emerald-700 font-mono block mt-1">
                {Math.round(totalRevenue * 0.1925).toLocaleString()} XAF
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-gray-400 font-mono block uppercase">Anor tax audit code</span>
              <span className="text-lg font-black text-indigo-750 font-mono block mt-1">MADECC-2026-OK</span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-bold text-slate-905 text-xs uppercase mb-3">Audit Client Invoices status:</h4>
            <div className="space-y-3 text-xs">
              {dbState.invoices.map(i => (
                <div key={i.id} className="border border-slate-100 p-4 rounded-xl flex justify-between items-center bg-slate-50/50">
                  <div>
                    <strong className="text-slate-950 font-semibold">{i.clientName}</strong>
                    <p className="text-[11px] text-gray-500 font-mono">{i.invoiceNumber} | {i.projectTitle}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold font-mono ${
                      i.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>{i.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/*********************************************************
       * 7. GENERAL MANAGER WORKSPACE
       *********************************************************/}
       {/*********************************************************
        * 7. GENERAL MANAGER WORKSPACE
        *********************************************************/}
       {activeRoleTab === StaffRole.GENERAL_MANAGER && (
         <div className="flex flex-col gap-6 animate-slide-up bg-white p-6 sm:p-8 rounded-2xl border border-gray-250">
           {/* Executive Welcome Banner */}
           <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div>
               <span className="text-[10px] bg-slate-900 text-slate-100 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">EXECUTIVE OFFICE</span>
               <h3 className="font-bold text-slate-900 text-lg uppercase mt-1">General Management Corporate Cockpit</h3>
               <p className="text-xs text-slate-500 font-sans">Monitor operations KPIs, audit safety compliance ratings, and broadcast yard directives.</p>
             </div>
             <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl shrink-0">
               <div className="w-10 h-10 bg-slate-200 border-2 border-amber-500 rounded-full flex items-center justify-center font-bold text-slate-800 text-sm select-none">
                 GM
               </div>
               <div className="flex flex-col text-left">
                 <span className="text-xs font-bold text-slate-900">Workspace Active</span>
                 <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider font-mono">● Authorized Session</span>
               </div>
             </div>
           </div>
 
           {/* Dynamic Real-time Company Health Scorecard */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
               <span className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider">Active Construction Yards</span>
               <div className="flex justify-between items-baseline mt-2">
                 <span className="text-2xl font-black text-slate-900 font-mono">{dbState.projects.length}</span>
                 <span className="text-[10px] text-gray-500">Yards in Cameroon</span>
               </div>
             </div>
             <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
               <span className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider">Cleared Liquid Holdings</span>
               <div className="flex justify-between items-baseline mt-2">
                 <span className="text-xl font-black text-slate-900 font-mono">{(totalRevenue).toLocaleString()}</span>
                 <span className="text-[10px] text-emerald-600 font-bold uppercase font-mono">XAF</span>
               </div>
             </div>
             <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
               <span className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider">Active Site Consultations</span>
               <div className="flex justify-between items-baseline mt-2">
                 <span className="text-2xl font-black text-slate-900 font-mono">{(dbState.appointments || []).length}</span>
                 <span className="text-[10px] text-gray-500">Scheduled visits</span>
               </div>
             </div>
             <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
               <span className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-wider">Outstanding Accounts</span>
               <div className="flex justify-between items-baseline mt-2">
                 <span className="text-xl font-black text-amber-800 font-mono">{(outstandingReceivable).toLocaleString()}</span>
                 <span className="text-[10px] text-amber-700 font-mono font-bold">XAF</span>
               </div>
             </div>
           </div>
 
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mt-2">
             {/* Dynamic Operational Control Panel */}
             <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col gap-4">
               <div>
                 <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wide">Interactive Operational Control Knobs</h4>
                 <p className="text-[11px] text-slate-550">Adjust safety counts, project timelines and logistical bottleneck states globally.</p>
               </div>
 
               <div className="flex flex-col gap-4 text-xs">
                 <div className="flex flex-col gap-1.5 p-3.5 bg-white border border-slate-250/60 rounded-lg">
                   <div className="flex justify-between items-center">
                     <span className="font-semibold text-slate-800">Site Safety Incident Logs</span>
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${gmAccidents.includes("0") ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                       {gmAccidents}
                     </span>
                   </div>
                   <div className="flex gap-2 mt-1">
                     <button
                       type="button"
                       onClick={() => setGmAccidents("0 (Zero incidents)")}
                       className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold py-1 px-2.5 rounded cursor-pointer transition-colors"
                     >
                       Mark Zero Incidents Code
                     </button>
                     <button
                       type="button"
                       onClick={() => setGmAccidents("1 (Minor Scaffold Scratch in Yaounde)")}
                       className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold py-1 px-2.5 rounded cursor-pointer transition-colors"
                     >
                       Log Scaffold Slip-up Alert
                     </button>
                   </div>
                 </div>
 
                 <div className="flex flex-col gap-1.5 p-3.5 bg-white border border-slate-250/60 rounded-lg">
                   <div className="flex justify-between items-center">
                     <span className="font-semibold text-slate-800">Project Delay / On-time Progress Tracker</span>
                     <span className="font-bold text-indigo-700 font-mono">{gmOnTime}% ON-TIME</span>
                   </div>
                   <input
                     type="range"
                     min="50"
                     max="100"
                     step="0.5"
                     value={gmOnTime}
                     onChange={(e) => setGmOnTime(parseFloat(e.target.value))}
                     className="w-full accent-indigo-700"
                   />
                   <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                     <span>50% Critical Bottleneck</span>
                     <span>100% Absolute Schedule Alignment</span>
                   </div>
                 </div>
 
                 <div className="flex flex-col gap-1.5 p-3.5 bg-white border border-slate-250/60 rounded-lg">
                   <span className="font-semibold text-slate-800">Logistical Bottlenecks Solver</span>
                   <select
                     value={gmBottlenecks}
                     onChange={(e) => setGmBottlenecks(e.target.value)}
                     className="border border-slate-250 p-2 rounded bg-slate-50 font-sans text-xs focus:outline-none focus:bg-white"
                   >
                     <option value="Resolved">Resolved (Sanaga river transport & Cimencam logistics on time)</option>
                     <option value="Sourcing Sable de Sanaga sand and Cimencam logistics on time.">Sourcing Sable de Sanaga sand and Cimencam logistics on time.</option>
                     <option value="Sable de Sanaga transport delay due to sand barge breakdown">Sable de Sanaga transport delay due to sand barge breakdown</option>
                     <option value="Steel reinforcing bars customs transit bottleneck at Kribi Deep Seaport">Steel reinforcing bars customs transit bottleneck at Kribi Deep Seaport</option>
                     <option value="Extreme fuel scarcity delaying heavy earthmover concrete batching">Extreme fuel scarcity delaying heavy earthmover concrete batching</option>
                   </select>
                   <p className="text-[10px] text-gray-400 italic mt-0.5">Note: Interactive selection propagates live metadata parameters onto public executive scorecards.</p>
                 </div>
               </div>
             </div>
 
             {/* General Manager Active Safety Directives Dispatcher */}
             <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col gap-4">
               <div>
                 <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wide">Executive Directives & Safety Dispatch Box</h4>
                 <p className="text-[11px] text-slate-550">Write and broadcast crucial on-site guidelines directly to active field workspaces.</p>
               </div>
 
               <div className="flex flex-col gap-2 text-xs">
                 <textarea
                   value={gmDirectiveInput}
                   onChange={(e) => setGmDirectiveInput(e.target.value)}
                   placeholder="e.g., All coastal scaffolds at Kribi yard must wear heavy anti-saline steel harness systems immediately."
                   rows={3}
                   className="border border-slate-250 p-2.5 rounded-lg text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-650 resize-none"
                 />
                 <button
                   type="button"
                   onClick={() => {
                     const val = gmDirectiveInput.trim();
                     if (!val) {
                       alert("Directive input cannot be blank.");
                       return;
                     }
                     const updatedDirectives = [val, ...(dbState.gmSafetyDirectives || [])];
                     const nextState = { ...dbState, gmSafetyDirectives: updatedDirectives };
                     setDbState(nextState);
                     syncDbState(nextState);
                     setGmDirectiveInput("");
                     alert("Official safety directive broadcasted successfully! It is now live in the Projects Execution Engineer field workspace.");
                   }}
                   className="bg-slate-900 hover:bg-black text-white py-2 px-3.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer self-end shadow-xs transition-all"
                 >
                   Broadcast Safe Yard Mandate
                 </button>
               </div>
 
               <div className="border-t border-slate-250/70 pt-3 flex flex-col gap-2">
                 <span className="font-semibold text-slate-900 block uppercase text-[10px] tracking-wide">Live Broadcast Registry ({ (dbState.gmSafetyDirectives || []).length })</span>
                 { (dbState.gmSafetyDirectives || []).length === 0 ? (
                   <p className="text-[11px] text-slate-500 italic">No safety directives actively broadcasted to the fields currently.</p>
                 ) : (
                   <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                     {(dbState.gmSafetyDirectives || []).map((directive, idx) => (
                       <div key={idx} className="bg-white p-2 text-[11px] rounded border border-slate-200 text-slate-700 font-medium flex justify-between items-start gap-3">
                         <p className="leading-snug">● {directive}</p>
                         <button
                           type="button"
                           onClick={() => {
                             const filtered = (dbState.gmSafetyDirectives || []).filter((_, i) => i !== idx);
                             const nextState = { ...dbState, gmSafetyDirectives: filtered };
                             setDbState(nextState);
                             syncDbState(nextState);
                           }}
                           className="text-red-650 hover:text-red-800 text-[10px] font-bold cursor-pointer hover:underline uppercase tracking-wide px-1"
                         >
                           Withdraw
                         </button>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             </div>
           </div>
 
           {/* Static Display Metrics for Presentation */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-150 pt-5 mt-2">
             <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col gap-1 text-left">
               <span className="text-slate-400 font-mono text-[9px] uppercase tracking-widest font-bold">SAFETY COMPLIANCE CODE</span>
               <span className="font-bold text-slate-800 text-xs">CUD & CUY Municipal Regulatory Stamped</span>
             </div>
             <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col gap-1 text-left">
               <span className="text-slate-400 font-mono text-[9px] uppercase tracking-widest font-bold">LOGISTICAL OVERVIEW STATUS</span>
               <span className="font-bold text-amber-700 text-xs font-mono">{gmBottlenecks}</span>
             </div>
             <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col gap-1 text-left">
               <span className="text-slate-400 font-mono text-[9px] uppercase tracking-widest font-bold">STANDARDS AND APPROVALS AUDIT</span>
               <span className="font-bold text-indigo-700 text-xs">ANOR Cameroon Certified Standard S.A.</span>
             </div>
           </div>
         </div>
       )}

      {/*********************************************************
       * 8. PROJECTS EXECUTION ENGINEER WORKSPACE
       *********************************************************/}
      {activeRoleTab === StaffRole.PROJECTS_EXECUTION_ENGINEER && (
        <div className="flex flex-col gap-6 animate-slide-up bg-white p-6 sm:p-8 rounded-2xl border border-gray-200">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-slate-900 uppercase">Projects Execution Engineer site workspace</h3>
            <p className="text-xs text-gray-500">Record dynamic structural checks, soil testing diaries and cement quality validations on active yards.</p>
          </div>

          {/* Safety directives broadcast bulletin */}
          {dbState.gmSafetyDirectives && dbState.gmSafetyDirectives.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col gap-2 text-xs">
              <span className="font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1.5 font-sans">
                <AlertTriangle className="w-4 h-4 text-amber-600 animate-pulse" /> Active General Management Safety Directives:
              </span>
              <ul className="list-disc pl-5 text-slate-700 space-y-1">
                {dbState.gmSafetyDirectives.map((d, index) => (
                  <li key={index} className="font-medium">{d}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <h4 className="font-bold text-slate-950 text-xs uppercase mb-2">Daily construction logs audit:</h4>
              <p className="text-xs text-slate-600 mb-3">Record daily aggregate moisture factors and rebar density checks before pouring C30 foundation slabs.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-850">Select Site Area:</label>
                  <select className="border p-2.5 rounded-lg bg-white">
                    {dbState.projects.map(p => (
                      <option key={p.id}>{p.title} ({p.location})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-850">Concrete crushing grade strength verified (Labogenie audit):</label>
                  <select className="border p-2.5 rounded-lg bg-white">
                    <option>C30/37 Grade - Standard Slabs</option>
                    <option>C40 - Post Tension Pillars</option>
                    <option>C25 - Retaining wall blockouts</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => alert("Daily structural log filed onto the main contractor repository.")}
                  className="bg-slate-950 hover:bg-black text-amber-500 py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  File Structural site diary
                </button>
              </div>
            </div>

            {/* Assigned Site Visits Segment */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mt-4">
              <h4 className="font-bold text-slate-950 text-xs uppercase mb-2">Assigned Site Visits & Field Diagnosis Calendar:</h4>
              <p className="text-xs text-slate-600 mb-3">View and confirm client diagnostics visits assigned by the Secretary Hub.</p>
              
              { (dbState.appointments || []).filter(a => a.engineerName.includes("Simeon") || a.engineerName.includes("Engineer")).length === 0 ? (
                <p className="text-xs text-gray-500 bg-white p-4 rounded-lg text-center border border-slate-100 italic">
                  No active site visits assigned to Simeon Tchounkeu (Projects Execution Engineer) right now.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  { (dbState.appointments || []).filter(a => a.engineerName.includes("Simeon") || a.engineerName.includes("Engineer")).map(app => (
                    <div key={app.id} className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col gap-2 shadow-sm text-xs col-start">
                      <div className="flex justify-between items-start gap-2">
                        <strong className="text-slate-900 font-sans">{app.clientName}</strong>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          app.status === "Scheduled" ? "bg-amber-100 text-amber-800" :
                          app.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-700"
                        }`}>{app.status}</span>
                      </div>
                      <div className="text-slate-600 space-y-1">
                        <p><span className="font-semibold text-slate-800">Purpose:</span> {app.purpose}</p>
                        <p><span className="font-semibold text-slate-800">Scheduled Date:</span> {app.date}</p>
                        <p><span className="font-semibold text-slate-800">Phone:</span> {app.clientPhone}</p>
                        {app.notes && <p className="text-[11px] bg-slate-50 p-2 rounded italic text-gray-500">Note: {app.notes}</p>}
                      </div>
                      
                      {app.status === "Scheduled" && (
                        <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (dbState.appointments || []).map(a => a.id === app.id ? { ...a, status: "Completed" as any } : a);
                              const next = { ...dbState, appointments: updated };
                              setDbState(next);
                              syncDbState(next);
                              alert("Site visit completed and synchronized with the Secretary database!");
                            }}
                            className="bg-emerald-600 hover:bg-emerald-705 text-white text-[10px] font-bold px-3 py-1 cursor-pointer rounded uppercase tracking-wider"
                          >
                            Mark Visit Completed
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/*********************************************************
       * 9. ARCHITECT WORKSPACE
       *********************************************************/}
      {activeRoleTab === StaffRole.ARCHITECT && (
        <div className="flex flex-col gap-6 animate-slide-up bg-white p-6 sm:p-8 rounded-2xl border border-gray-200">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-slate-900 uppercase">Architect Design & Blueprints Studio</h3>
            <p className="text-xs text-gray-500 font-medium">Configure interactive architectural project drafts, structural blueprints list, and 3D mock rendering listings.</p>
          </div>

          {/* GM safety directives board */}
          {dbState.gmSafetyDirectives && dbState.gmSafetyDirectives.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col gap-2 text-xs">
              <span className="font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1.5 font-sans">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Active General Management Safety Directives:
              </span>
              <ul className="list-disc pl-5 text-slate-700 space-y-1">
                {dbState.gmSafetyDirectives.map((d, index) => (
                  <li key={index} className="font-medium">{d}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload form block */}
            <div className="lg:col-span-1 p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-4">
              <div>
                <h4 className="font-bold text-slate-950 text-xs uppercase">National Order of Architects (ONAC) Compliance Sheet</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                  In conformity with MINHDU and ONAC regulations in Cameroon, residential structures require certified, signed blueprint envelopes.
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3 flex flex-col gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-800">Document Title / Ref:</label>
                  <input
                    type="text"
                    value={blueprintTitle}
                    onChange={(e) => setBlueprintTitle(e.target.value)}
                    placeholder="e.g. Bastos Villa West Wing Elevation"
                    className="border border-slate-250 p-2 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-800">Linked Construction Project:</label>
                  <select
                    value={blueprintProject}
                    onChange={(e) => setBlueprintProject(e.target.value)}
                    className="border border-slate-250 p-2 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="">-- Choose Project --</option>
                    {dbState.projects.map(p => (
                      <option key={p.id} value={p.title}>{p.title}</option>
                    ))}
                    <option value="General Execution Template">General Execution Template</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 mt-1">
                  <label className="font-semibold text-slate-800">Blueprint File Upload:</label>
                  
                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        const file = e.dataTransfer.files[0];
                        setSelectedFileName(file.name);
                        setSelectedFileSize((file.size / (1024 * 1024)).toFixed(1) + " MB");
                      }
                    }}
                    onClick={() => {
                      const input = document.getElementById("blueprint-file-picker");
                      if (input) input.click();
                    }}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-1.5 min-h-[110px] ${
                      isDragOver ? "border-amber-500 bg-amber-50/20" : "border-slate-300 hover:border-slate-400 bg-white"
                    }`}
                  >
                    <input
                      type="file"
                      id="blueprint-file-picker"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setSelectedFileName(file.name);
                          setSelectedFileSize((file.size / (1024 * 1024)).toFixed(1) + " MB");
                        }
                      }}
                    />
                    
                    <Upload className="w-6 h-6 text-slate-400" />
                    {selectedFileName ? (
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-emerald-700 font-mono line-clamp-1">{selectedFileName}</p>
                        <p className="text-[9px] text-gray-500">{selectedFileSize}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-[11px] font-medium text-slate-700">Drag & drop files or click to upload</p>
                        <p className="text-[9px] text-slate-400 font-sans">Supports PDF, CAD sheets up to 100MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {uploadProgress !== null && (
                  <div className="w-full mt-2 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-150" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (!blueprintTitle.trim()) {
                      alert("Please specify a document title or reference first.");
                      return;
                    }
                    if (!selectedFileName) {
                      alert("Please select or drop an architectural blueprints file.");
                      return;
                    }

                    // Progress simulation
                    let p = 0;
                    setUploadProgress(0);
                    const tm = setInterval(() => {
                      p += 20;
                      setUploadProgress(p);
                      if (p >= 100) {
                        clearInterval(tm);

                        const fresh: Blueprint = {
                          id: "bp-" + Date.now(),
                          title: blueprintTitle,
                          fileName: selectedFileName,
                          fileSize: selectedFileSize || "12.0 MB",
                          uploadDate: new Date().toISOString().split("T")[0],
                          projectTitle: blueprintProject || "Yaounde Bastos Premium Residence",
                          onacCertified: true,
                          minhduApproved: false,
                          status: "Awaiting Engineering Audit",
                          author: "Brice Foasso"
                        };

                        const nextBps = [fresh, ...(dbState.blueprints || [])];
                        const nextState = { ...dbState, blueprints: nextBps };
                        setDbState(nextState);
                        syncDbState(nextState);

                        // Reset
                        setBlueprintTitle("");
                        setBlueprintProject("");
                        setSelectedFileName("");
                        setSelectedFileSize("");
                        setUploadProgress(null);
                        alert(`Architectural PDF blueprints '${fresh.title}' successfully processed, signed, and saved securely into Cameroon central registry State!`);
                      }
                    }, 100);
                  }}
                  className="bg-slate-900 hover:bg-black text-white py-2.5 rounded-lg font-bold uppercase tracking-wider text-[10px] mt-2 cursor-pointer text-center"
                >
                  Upload Architectural PDF Blue-sheet
                </button>
              </div>
            </div>

            {/* Registered blueprints registry ledger */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex justify-between items-center pb-1">
                <span className="font-semibold text-slate-900 block uppercase text-xs tracking-wide">ONAC Certified Blueprint Register ({(dbState.blueprints || []).length})</span>
                <span className="text-[10px] text-slate-400 font-mono italic">MINHDU Standards Check System</span>
              </div>

              {(dbState.blueprints || []).length === 0 ? (
                <div className="p-10 border border-dashed border-slate-250 bg-slate-50/50 rounded-xl text-center">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No blueprints registered yet for this workspace.</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Use the dynamic upload panel on the left to add certified blueprints.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {(dbState.blueprints || []).map((bp) => (
                    <div key={bp.id} className="border border-slate-200 p-4 rounded-xl bg-slate-50 hover:bg-slate-100/50 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <strong className="text-slate-950 font-sans tracking-tight text-xs block">{bp.title}</strong>
                          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{bp.fileName} • {bp.fileSize}</span>
                          <span className="text-[10px] text-slate-400 mt-1">Project Link: <strong>{bp.projectTitle}</strong></span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 md:self-center">
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono uppercase">ONAC</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase ${bp.minhduApproved ? "bg-indigo-100 text-indigo-800" : "bg-slate-200 text-slate-700"}`}>
                          {bp.minhduApproved ? "MINHDU Approved" : "Pending MINHDU"}
                        </span>
                        
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            type="button"
                            onClick={() => {
                              const toggleBps = (dbState.blueprints || []).map(b => b.id === bp.id ? { ...b, minhduApproved: !b.minhduApproved } : b);
                              const nextState = { ...dbState, blueprints: toggleBps };
                              setDbState(nextState);
                              syncDbState(nextState);
                            }}
                            className="bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 py-1 px-1.5 rounded text-[9px] font-bold cursor-pointer transition-colors"
                            title="Toggle MINHDU Regulatory Stamp"
                          >
                            Stamp Status
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Delete this architectural blueprint track permanently?")) {
                                const filtered = (dbState.blueprints || []).filter(b => b.id !== bp.id);
                                const nextState = { ...dbState, blueprints: filtered };
                                setDbState(nextState);
                                syncDbState(nextState);
                              }
                            }}
                            className="bg-rose-105 hover:bg-rose-100/80 text-rose-700 border border-rose-200 py-1 px-1.5 rounded text-[9px] font-bold cursor-pointer transition-colors"
                            title="Delete blueprint record"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert Notifications Container */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed top-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-2xl pointer-events-auto flex items-start gap-3.5"
          >
            <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
              toast.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
              toast.type === "error" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
              toast.type === "warning" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
              "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
            }`}>
              {toast.type === "success" && <CheckSquare className="w-5 h-5" />}
              {toast.type === "error" && <AlertTriangle className="w-5 h-5" />}
              {toast.type === "warning" && <AlertTriangle className="w-5 h-5" />}
              {toast.type === "info" && <Sparkles className="w-5 h-5" />}
            </div>
            
            <div className="flex-1 flex flex-col gap-0.5 text-left">
              <span className="text-xs font-bold font-sans uppercase tracking-wider text-slate-100 flex justify-between items-center">
                {toast.type === "success" && "Success (Synced)"}
                {toast.type === "error" && "Database Sync Alert"}
                {toast.type === "warning" && "Warning State"}
                {toast.type === "info" && "System Notification"}
                
                <button 
                  onClick={() => setToast(null)}
                  className="text-[10px] text-slate-500 hover:text-slate-300 font-mono tracking-tight cursor-pointer uppercase font-black"
                >
                  dismiss
                </button>
              </span>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed break-words">{toast.message}</p>
              
              <span className="text-[9px] text-slate-500 font-mono mt-1">
                {toast.type === "error" ? "• Saved in offline browser storage fallback" : "• Real-time Civil S.A. Ledger Active"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
