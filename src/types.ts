/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum StaffRole {
  CEO = "CEO",
  PROJECT_MANAGER = "PROJECT MANAGER",
  WEB_CONTENT_EDITOR = "WEB CONTENT EDITOR",
  ACCOUNTANT = "ACCOUNTANT",
  SECRETARY = "SECRETARY",
  FINANCIAL_OFFICER = "FINANCIAL OFFICER",
  GENERAL_MANAGER = "GENERAL MANAGER",
  PROJECTS_EXECUTION_ENGINEER = "PROJECTS EXECUTION_ENGINEER",
  ARCHITECT = "ARCHITECT",
}

export interface SEOMetadata {
  caption: string;
  description: string;
  altText: string;
  title: string;
  keywords: string; // Comma separated
  hashtags: string; // Space separated or comma separated
  socialMediaHandles: string; // e.g. twitter: @madecc_group, facebook: MADECC Group
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  videoUrl?: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  seoTags: SEOMetadata;
  published: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  location: string; // e.g., Yaounde, Douala, Limbe
  category: string; // Residential, Commercial, Infrastructure
  status: "Planning" | "In Progress" | "Completed" | "Suspended";
  progress: number; // percentage
  budget: number; // in XAF
  image: string;
  videoUrl?: string;
  desc: string;
  architectName?: string;
  engineerNotes?: string;
  seoTags: SEOMetadata;
  checklists?: Array<{ task: string; completed: boolean }>;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number; // in XAF
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectTitle: string;
  date: string;
  dueDate: string;
  lineItems: InvoiceItem[];
  subtotal: number;
  vatRate: number; // e.g., 0.1925 (19.25% standard VAT in Cameroon)
  vatAmount: number;
  totalAmountXAF: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue";
  notes?: string;
  issuedBy: string; // Staff member name or signature
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  customerName: string;
  purpose: string; // e.g., Phase 1 Excavation deposit, Architectural designs
  date: string;
  paymentMethod: "Cash" | "Bank Transfer" | "Mobile Money" | "Cheque";
  amountXAF: number;
  vatRate: number; // 19.25% or 0%
  vatAmount: number;
  totalXAF: number;
  processedBy: string;
  status: "Cleared" | "Pending" | "Refunded";
  notes?: string;
}

export interface QuoteRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  location: string; // e.g., Yaounde, Douala, Limbe
  landSquareMeters: number;
  projectType: string; // Residential, commercial, etc.
  budgetRange: string;
  preferredStartDate: string;
  requestDate: string;
  status: "Pending" | "Contacted" | "Approved" | "Archived";
  notes?: string;
}

export interface Appointment {
  id: string;
  purpose: string;
  date: string;
  engineerName: string; // Active Projects Execution Engineer
  clientName: string;
  clientPhone: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  notes?: string;
}

export interface Blueprint {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  projectTitle: string;
  onacCertified: boolean;
  minhduApproved: boolean;
  status: "Awaiting Engineering Audit" | "Approved" | "Revision Needed";
  author: string;
}

export interface StaffMember {
  role: StaffRole;
  name: string;
  commandKey: string;
  dutyPostName: string;
  avatar: string;
}

export interface PagesContent {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    aboutTeaser: string;
  };
  about: {
    mission: string;
    vision: string;
    history: string;
  };
  services: {
    generalDesc: string;
  };
}

export interface DatabaseState {
  blogs: BlogPost[];
  projects: ProjectItem[];
  invoices: Invoice[];
  receipts: Receipt[];
  quotes: QuoteRequest[];
  commandKeys: Record<StaffRole, string>;
  pagesContent: PagesContent;
  appointments?: Appointment[];
  blueprints?: Blueprint[];
  gmSafetyDirectives?: string[];
}
