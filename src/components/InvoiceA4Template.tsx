import React, { useState } from "react";
import { Printer, Save, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Invoice, InvoiceItem } from "../types";

interface Props {
  invoice: Invoice;
  onSave?: (updated: Invoice) => void;
  onBack?: () => void;
}

export default function InvoiceA4Template({ invoice, onSave, onBack }: Props) {
  const [edited, setEdited] = useState<Invoice>({ ...invoice });
  const [isEditing, setIsEditing] = useState(false);

  const calculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);
    const vatRate = 0.1925; // Cameroon TVA (19.25%)
    const vatAmount = Math.round(subtotal * vatRate);
    const totalAmountXAF = subtotal + vatAmount;
    return { subtotal, vatAmount, totalAmountXAF };
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...edited.lineItems];
    const prevItem = newItems[index];
    
    let processedValue = value;
    if (field === "quantity" || field === "unitPrice") {
      processedValue = Number(value) || 0;
    }
    
    newItems[index] = {
      ...prevItem,
      [field]: processedValue,
    };
    
    newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    
    const { subtotal, vatAmount, totalAmountXAF } = calculateTotals(newItems);
    
    setEdited({
      ...edited,
      lineItems: newItems,
      subtotal,
      vatAmount,
      totalAmountXAF,
    });
  };

  const handleAddItem = () => {
    const newItems = [...edited.lineItems, { description: "New construction work item", quantity: 1, unitPrice: 50000, total: 50000 }];
    const { subtotal, vatAmount, totalAmountXAF } = calculateTotals(newItems);
    setEdited({
      ...edited,
      lineItems: newItems,
      subtotal,
      vatAmount,
      totalAmountXAF,
    });
  };

  const handleRemoveItem = (index: number) => {
    if (edited.lineItems.length <= 1) return;
    const newItems = edited.lineItems.filter((_, idx) => idx !== index);
    const { subtotal, vatAmount, totalAmountXAF } = calculateTotals(newItems);
    setEdited({
      ...edited,
      lineItems: newItems,
      subtotal,
      vatAmount,
      totalAmountXAF,
    });
  };

  const handleMetaChange = (field: keyof Invoice, value: string) => {
    setEdited({
      ...edited,
      [field]: value,
    });
  };

  const saveChanges = () => {
    if (onSave) {
      onSave(edited);
    }
    setIsEditing(false);
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6" id="invoice-component">
      {/* Action panel hiding on native print */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 no-print">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-gray-250 shadow-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to List
            </button>
          )}
          <span className="font-mono text-sm text-gray-500 font-medium">Invoice ID: {edited.invoiceNumber}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 text-sm font-medium rounded-lg shadow-xs cursor-pointer ${
              isEditing
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-gray-800 hover:bg-gray-950 text-white"
            }`}
          >
            {isEditing ? "View Invoice Template" : "Edit Invoice Fields"}
          </button>
          {isEditing && (
            <button
              onClick={saveChanges}
              className="flex items-center gap-2 bg-emerald-650 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-medium rounded-lg shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Logs
            </button>
          )}
          <button
            onClick={printInvoice}
            className="flex items-center gap-2 bg-blue-650 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-lg shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print A4 PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Quick Edit Sidebar - visible only during edit mode */}
        {isEditing && (
          <div className="w-full lg:w-80 bg-white p-5 rounded-xl border border-gray-250 flex flex-col gap-4 no-print shrink-0 shadow-xs">
            <h3 className="font-semibold text-gray-950 border-b border-gray-100 pb-2">Client Details</h3>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Invoice No:</label>
              <input
                type="text"
                value={edited.invoiceNumber}
                onChange={(e) => handleMetaChange("invoiceNumber", e.target.value)}
                className="text-xs border border-gray-300 p-2 rounded-md focus:outline-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Client Name:</label>
              <input
                type="text"
                value={edited.clientName}
                onChange={(e) => handleMetaChange("clientName", e.target.value)}
                className="text-xs border border-gray-300 p-2 rounded-md focus:outline-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Client Email:</label>
              <input
                type="text"
                value={edited.clientEmail}
                onChange={(e) => handleMetaChange("clientEmail", e.target.value)}
                className="text-xs border border-gray-300 p-2 rounded-md focus:outline-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Client Phone:</label>
              <input
                type="text"
                value={edited.clientPhone}
                onChange={(e) => handleMetaChange("clientPhone", e.target.value)}
                className="text-xs border border-gray-300 p-2 rounded-md focus:outline-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Project Site Title:</label>
              <input
                type="text"
                value={edited.projectTitle}
                onChange={(e) => handleMetaChange("projectTitle", e.target.value)}
                className="text-xs border border-gray-300 p-2 rounded-md focus:outline-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Issue Date:</label>
              <input
                type="date"
                value={edited.date}
                onChange={(e) => handleMetaChange("date", e.target.value)}
                className="text-xs border border-gray-300 p-2 rounded-md focus:outline-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Due Date:</label>
              <input
                type="date"
                value={edited.dueDate}
                onChange={(e) => handleMetaChange("dueDate", e.target.value)}
                className="text-xs border border-gray-300 p-2 rounded-md focus:outline-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium">Comments/Notes:</label>
              <textarea
                value={edited.notes || ""}
                onChange={(e) => handleMetaChange("notes", e.target.value)}
                className="text-xs border border-gray-300 p-2 rounded-md focus:outline-blue-500 h-20"
              />
            </div>
          </div>
        )}

        {/* Invoice Container - Styled exactly as A4 page */}
        <div className="flex-1 w-full bg-white border border-gray-300 shadow-md p-8 sm:p-12 font-sans text-gray-800 leading-relaxed max-w-4xl mx-auto rounded-md relative overflow-hidden" id="print-area">
          {/* A4 watermarks and corporate styling */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-50 to-amber-50 pointer-events-none rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-50 to-amber-50 pointer-events-none rounded-full blur-3xl opacity-50" />

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-gray-900 pb-8 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-display font-black tracking-wider text-2xl text-slate-900">
                  MADECC <span className="text-amber-500 text-3xl font-medium">GROUP</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 font-mono font-medium max-w-sm">
                Maison de Construction et de Civil S.A.<br />
                General Building & Infrastructure Engineering Contractors<br />
                Yaoundé: Rue de Mbankolo, Centre Region, Cameroon<br />
                Douala: Bonabéri Ind. Park, Cameroon<br />
                R.C. Cameroun: RC/YAO/2026/B/882103<br />
                N.I.U. Number: M05261899201A
              </p>
            </div>
            <div className="text-right md:w-auto w-full">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">INVOICE/FACTURE</h2>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-1 text-xs text-gray-600">
                <div><span className="font-semibold text-slate-900">No:</span> {isEditing ? edited.invoiceNumber : invoice.invoiceNumber}</div>
                <div><span className="font-semibold text-slate-900">Date:</span> {isEditing ? edited.date : invoice.date}</div>
                <div><span className="font-semibold text-slate-900">Due:</span> {isEditing ? edited.dueDate : invoice.dueDate}</div>
                <div><span className="font-semibold text-slate-900">Status:</span> 
                  <span className={`ml-1 font-mono uppercase px-2 py-0.5 rounded text-[10px] inline-block ${
                    edited.status === "Paid" 
                      ? "bg-emerald-100 text-emerald-800" 
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {edited.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Client & Project Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 text-xs border-b border-gray-100 pb-8">
            <div>
              <h3 className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Billed To (Facturé À):</h3>
              <p className="font-bold text-gray-900 text-sm">{isEditing ? edited.clientName : invoice.clientName}</p>
              <p className="text-gray-500">{isEditing ? edited.clientEmail : invoice.clientEmail}</p>
              <p className="text-gray-500">{isEditing ? edited.clientPhone : invoice.clientPhone}</p>
            </div>
            <div>
              <h3 className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Project Site Alignment (Chantier):</h3>
              <p className="font-bold text-gray-900 text-sm">{isEditing ? edited.projectTitle : invoice.projectTitle}</p>
              <div className="mt-2 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <p className="text-[11px] text-slate-600 leading-normal">
                  Our materials, structural testing models, and construction layouts align fully with the Cameroon standards authority (ANOR) and local municipality compliance codes.
                </p>
              </div>
            </div>
          </div>

          {/* Table Items */}
          <div className="my-8">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-900 font-mono font-bold uppercase text-[10px]">
                  <th className="py-3">Nature of Construction Services</th>
                  <th className="py-3 text-center w-16">Qty</th>
                  <th className="py-3 text-right w-28">Unit Price (XAF)</th>
                  <th className="py-3 text-right w-28">Total (XAF)</th>
                  {isEditing && <th className="py-3 text-center w-12 no-print">Action</th>}
                </tr>
              </thead>
              <tbody>
                {(isEditing ? edited.lineItems : invoice.lineItems).map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-slate-50">
                    <td className="py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                          className="w-full bg-slate-50 p-2 rounded text-xs focus:outline-blue-500"
                        />
                      ) : (
                        item.description
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                          className="w-12 bg-slate-50 p-2 text-center rounded text-xs focus:outline-blue-500"
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                          className="w-24 bg-slate-50 p-2 text-right rounded text-xs focus:outline-blue-500"
                        />
                      ) : (
                        item.unitPrice.toLocaleString("fr-FR")
                      )}
                    </td>
                    <td className="py-3 text-right font-semibold text-slate-900">
                      {item.total.toLocaleString("fr-FR")}
                    </td>
                    {isEditing && (
                      <td className="py-3 text-center no-print">
                        <button
                          onClick={() => handleRemoveItem(idx)}
                          className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                          disabled={edited.lineItems.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {isEditing && (
              <button
                onClick={handleAddItem}
                className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-3 pl-2 py-1.5 rounded-lg no-print cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Structural Ledger Item
              </button>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="flex justify-end my-8">
            <div className="w-80 flex flex-col gap-2 text-xs border-t border-slate-900 pt-4">
              <div className="flex justify-between items-center text-gray-500">
                <span>Subtotal (Montant HT):</span>
                <span className="font-semibold text-slate-950 font-mono">
                  {(isEditing ? edited.subtotal : invoice.subtotal).toLocaleString("fr-FR")} XAF
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-500 border-b border-gray-100 pb-2">
                <span>Cameroon VAT / TVA (19.25%):</span>
                <span className="font-semibold text-slate-950 font-mono">
                  {(isEditing ? edited.vatAmount : invoice.vatAmount).toLocaleString("fr-FR")} XAF
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-900 font-bold bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-sm">Total Payable (TTC):</span>
                <span className="text-sm font-mono text-blue-900">
                  {(isEditing ? edited.totalAmountXAF : invoice.totalAmountXAF).toLocaleString("fr-FR")} XAF
                </span>
              </div>
            </div>
          </div>

          {/* Footnotes & Stamping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-100 text-xs text-gray-500">
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Standard Payment Directives:</h4>
              <p className="leading-relaxed font-sans text-[11px]">
                Corporate payouts should execute directly to MADECC Group Afriland First Bank account, Yaoundé.<br />
                Branch: Mimboman | Code: 10005-00234<br />
                Swift code: AFRI-CM-Y6A.<br />
                Delayed stage payments attract building delays and re-schedule assessments on material delivery workflows.
              </p>
            </div>
            <div className="flex flex-col items-end text-center">
              <p className="font-bold text-slate-905 uppercase text-[10px] tracking-wide mb-2">Authorised Stamp & Signature (MADECC)</p>
              
              <div className="relative w-44 h-24 my-1 flex items-center justify-center border border-dashed border-gray-200 rounded">
                {/* Decorative Cameroon Stamp Graphic */}
                <div className="absolute w-20 h-20 rounded-full border-4 border-emerald-600/30 flex flex-col items-center justify-center rotate-12 select-none pointer-events-none scale-90">
                  <span className="text-[7px] text-emerald-700/60 font-black tracking-widest uppercase">MADECC GROUP</span>
                  <span className="text-[6px] text-emerald-700/60 font-mono">APPROVED</span>
                  <span className="text-[5px] text-emerald-700/60 font-mono">2026-05-30</span>
                </div>
                {/* Stylised Scribble signature mock */}
                <div className="absolute w-24 h-12 opacity-80 rotate-3 font-mono font-bold text-blue-700 text-xs pointer-events-none select-none">
                  /s/ Atangana C.
                </div>
              </div>
              <p className="text-[10px] text-gray-400">Validated electronically by Secretariat S.A.</p>
            </div>
          </div>

          <div className="text-center text-[10px] text-gray-400 mt-16 border-t border-gray-100 pt-4">
            "We construct sustainable Cameroon foundations with absolute structural integrity."
          </div>
        </div>
      </div>
    </div>
  );
}
