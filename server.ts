import express from "express";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { StaffRole, DatabaseState, BlogPost, ProjectItem, Invoice, Receipt, QuoteRequest } from "./src/types";

const app = express();
const PORT = 3000;

// Resolve DB_FILE robustly under varied process working directories or runtime modules
let currentDirname = process.cwd();
try {
  if (typeof __dirname !== "undefined") {
    currentDirname = __dirname;
  }
} catch (e) {}

const getDbFilePath = (): string => {
  const primaryPath = path.join(process.cwd(), "db_state.json");
  if (fs.existsSync(primaryPath)) {
    return primaryPath;
  }
  const siblingPath = path.join(currentDirname, "db_state.json");
  if (fs.existsSync(siblingPath)) {
    return siblingPath;
  }
  const parentOfSiblingPath = path.join(currentDirname, "..", "db_state.json");
  if (fs.existsSync(parentOfSiblingPath)) {
    return parentOfSiblingPath;
  }
  return primaryPath;
};

let DB_FILE = getDbFilePath();

app.use(express.json({ limit: "50mb" }));

// Initialize Gemini Client safely
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  console.log("Gemini API Client safely initialized server-side.");
} else {
  console.log("Warning: GEMINI_API_KEY not found in environment. SEO generation will run via fallback solver.");
}

// Default initial state
const defaultState: DatabaseState = {
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
  blogs: [
    {
      id: "blog-1",
      title: "Navigating Building Permits (Arrêté de Construire) in Cameroon: A Complete 2026 Guide",
      slug: "cameroon-building-permits-guide-2026",
      category: "Regulatory & Compliance",
      author: "MADECC Regulatory Desk",
      image: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&q=80&w=800",
      date: "2026-05-15",
      readTime: "6 min read",
      published: true,
      content: `Before lay-down or site excavation anywhere in Cameroon, acquiring the official 'Arrêté de Construire' is legally mandatory. In deep metropolitan hubs like Yaoundé and Douala, building permit approvals are processed strictly by the local Urban Councils (Communauté Urbaine de Yaoundé - CUY, and Communauté Urbaine de Douala - CUD).

Without this formal baseline document, municipal officers possess full authorization to seal construction yards, impose weighty fines of up to millions of XAF, or issue demolition orders.

### Critical Milestones in the Application Process:
1. **Land Rights Verification**: Submit the Certificate of Ownership (*Certificat de Propriété*) validating ownership not older than 3 months.
2. **Technical Layout Submissions**: Architectural blue-sheets stamped by a registered member of the National Order of Architects (ONAC), alongside foundational structural integrity blueprints approved by certified execution engineers.
3. **Urban Alignment Check**: Ensuring conformity with city master plans (such as street setbacks, green areas, and drainage routes).

At MADECC Group, we take off the bureaucratic burden off our clientele. Our administrative agents act directly alongside our Senior Engineers to prepare and audit all layouts, ensuring an average approval timeline of under 60 days.`,
      seoTags: {
        title: "Building Permits (Permis de Construire) in Cameroon Guide | MADECC Group",
        description: "An exhaustive legal manual detailing building permit acquisition processes in Douala, Yaounde and other regions of Cameroon to ensure ad approval compliance.",
        caption: "A comprehensive diagram illustrating municipal building regulatory bodies in Yaounde and Douala.",
        altText: "A municipal building regulatory manual page outlining permit acquisition steps in Cameroon.",
        keywords: "building permits cameroon, permis de construire, ONAC architects cameroon, CUY, CUD, civil regulation Cameroon, MADECC construction",
        hashtags: "#CameroonConstruction #BuildingPermits #CUD #CUY #CameroonRealEstate",
        socialMediaHandles: "@madecc_group, facebook/madecc.group",
      },
    },
    {
      id: "blog-2",
      title: "Managing Concrete Strengths under Saline & Humid Coastal Environments in Douala",
      slug: "concrete-saline-humid-douala-coasts",
      category: "Engineering Insights",
      author: "Simeon Tchounkeu (Projects Execution Engineer)",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
      date: "2026-04-28",
      readTime: "8 min read",
      published: true,
      content: `Douala presents distinct geological and climatic enforcements that demand sophisticated technological responses on site. With relative humidity hovering above 85% year-round and salty marine winds in Bonabéri and Youpwe, untreated reinforced concrete can rapidly carbonate, leading to premature rebar corrosion (concrete cancer).

### The Chemistry of Failure
Coastal structures fail when micro-pores in concrete absorb chlorides from humid maritime air. Water molecules react alongside internal steel reinforcement rods, spawning iron oxides that expand, causing tensile cracking and concrete spalling.

To combat this, the engineering division at MADECC Group adheres strictly to the following parameters:
- **Low Water-to-Cement Ratio**: Limiting water content to 0.40 to reduce capillary pores.
- **Micro-Silica Additives**: Incorporating pozzolans to react with free lime, reinforcing aggregate binding properties.
- **Minimum Strength Specifications**: Committing to no less than C30/37 structural grades for all structural columns and foundational works near Douala shipping basins.
- **Standardized Rebars Coating**: Integrating anti-rust epoxy or double-coat polyurethane shields on structural iron rods before pouring concrete.

Building right means building for generations, especially under our challenging, vital coastal climates.`,
      seoTags: {
        title: "Reinforced Concrete Corrosion Prevention in Cameroon Coastal Sites",
        description: "Professional construction guide on micro-silica masonry additives, low water cements, and structural grading designed for coastal building in Douala.",
        caption: "A visual cross-section of treated versus untreated reinforced concrete under high chloride salinity.",
        altText: "A close-up of premium structural casting column ready for pouring under wet coastal humidity.",
        keywords: "coastal concrete douala, concrete corrosion prevention cameroon, structural engineering Douala, C30 concrete, anticorro rebar, MADECC",
        hashtags: "#CoastalEngineering #CameroonCivilEngineering #DoualaDevelopment #StructuralHonesty",
        socialMediaHandles: "@madecc_group_pm",
      },
    },
    {
      id: "blog-3",
      title: "Budget Baselining: Current Cost Trends of Construction Materials in Cameroon",
      slug: "construction-materials-cost-trends-cameroon",
      category: "Financial Planning",
      author: "Christian Ndi (Financial Officer)",
      image: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=800",
      date: "2026-05-10",
      readTime: "5 min read",
      published: true,
      content: `Sourcing materials at optimized price indices is key to avoiding budget creep in construction. Over the past 12 months, inflation has slightly impacted key items like import steel rods, while locally produced materials (like Cimencam, Dangote, and Mira cement) have displayed relative stabilization owing to domestic logistics arrangements.

### Estimated Pricing Baseline (2026 Averages):
- **Cement (Grade 42.5R)**: Retails average of 4,600 XAF to 5,200 XAF per bag of 50kg, varying on metropolitan distance and bulk delivery agreements.
- **River Sand (Sable de Sanaga)**: Crucial for premium casting. Averaging 150,000 XAF to 180,000 XAF per 10-wheel truckloads delivered directly to central Yaoundé sites.
- **Deformed Reinforcement Bars (Fers à béton)**: 8mm, 10mm and 12mm structural grades range between 420,000 XAF to 480,000 XAF per ton.
- **Laterite Foundation Soil**: Red laterite fills hover around 60,000 XAF per trip.

Understanding these pricing vectors allows MADECC Group to baseline site bids with high accuracy, locking in material quotas ahead of seasonal increments.`,
      seoTags: {
        title: "Construction Materials Cost Index 2026 Cameroon | MADECC",
        description: "Verify actual retail prices for Sanaga river sand, cement brandings, and imported steel rods across Cameroon to optimize budget sheets.",
        caption: "Line index tracking quarterly retail cement price movements in Yaounde and Douala markets.",
        altText: "Drawn catalog of standard structural construction components and sand stockpiles on a clean Camerron site.",
        keywords: "cement prices cameroon, sable de sanaga, Dangote cement price Yaounde, steel rods cost XAF, construction budget cameroon, MADECC Group",
        hashtags: "#CameroonEconomy #ConstructionCosts #XAFBudgeting #AfricanRealEstate",
        socialMediaHandles: "@madecc_financials",
      },
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "The MADECC Heights Residential & Commercial Complex",
      slug: "madecc-heights-yaounde",
      location: "Yaoundé, Nlongkak",
      category: "Commercial",
      status: "In Progress",
      progress: 68,
      budget: 345000000,
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200",
      desc: "A multi-use structure comprising 5 structural storeys plus sub-level basement parking. It utilizes high-grade earthquake resistant columns, structural cantilever balcony sheets, and elegant double-paned solar reflective glass façades.",
      architectName: "Brice Foasso (Senior ONAC Architect)",
      engineerNotes: "Basement retaining structure completed using dense concrete shear walls. Currently casting 4th floor structural beams. Material standard audits verified by Labogenie.",
      seoTags: {
        title: "MADECC Heights Commercial Complex | Post-modern Yaounde Construction",
        description: "Official project parameters for MADECC Heights. Structural design, basement shear walls, and earthquake-resistant pillars details in Yaounde, Cameroon.",
        caption: "Architectural 3D model illustration rendering for MADECC Heights in Nlongkak, Yaoundé.",
        altText: "Active modular crane tower lifting framework modules over casted concrete floors on site.",
        keywords: "commercial building yaounde, earthquake resistant structures, multi-storey commercial cameroon, MADECC heights, ONAC architecture",
        hashtags: "#YaoundeDevelopment #CameroonAesthetic #ModernAfricanArchitecture",
        socialMediaHandles: "@madecc_heights_lead",
      },
      checklists: [
        { task: "Topographical surveying and soil testing", completed: true },
        { task: "Sub-level excavation and retaining pile wall installation", completed: true },
        { task: "Basement slab framework and concrete pouring", completed: true },
        { task: "First to Third floor standard structural beam casting", completed: true },
        { task: "Fourth floor shuttering and structural reinforcement layout", completed: true },
        { task: "Electrical conduit running and internal masonry framing", completed: false },
        { task: "Reflective exterior glazing, painting, and visual fit-out", completed: false },
      ],
    },
    {
      id: "proj-2",
      title: "Douala Port Logistics Warehouse Extension",
      slug: "douala-port-logistics-warehouse",
      location: "Douala, Bonabéri Zone",
      category: "Infrastructure",
      status: "Completed",
      progress: 100,
      budget: 185000000,
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
      desc: "A sprawling 2,500 square meter dry-cargo storage terminal. Engineered with custom structural steel portal frames, anti-condensation treated roofing panels, and a 200mm industrial grade mesh-reinforced floor floor with epoxy finish.",
      architectName: "Cabinet ONAC-A3",
      engineerNotes: "Structural portal span measures 40 meters without intermediate columns to ensure unhindered forklift maneuvers. Concrete sub-base contains chloride-resistant chemical additives.",
      seoTags: {
        title: "Douala Port Infrastructure Logistics Warehouse | MADECC",
        description: "Discover how MADECC completed the heavy logistics warehouse portal frame in Douala Port utilizing low corrosion coatings and steel truss trusses.",
        caption: "The completed logistics dry warehouse terminal interior showcasing wide unimpeded portal arches.",
        altText: "Wide shot of custom steel metal truss framing panels bolted safely to modular concrete columns.",
        keywords: "warehouse construction Douala, industrial portal frame design, Cameroon port infrastructure engineering, civil steel constructor",
        hashtags: "#IndustrialConstruction #DoualaPort #CameroonLogistics #MadeInCameroon",
        socialMediaHandles: "@madecc_group_infra",
      },
      checklists: [
        { task: "Dynamic soil compaction and soil load capacity audits", completed: true },
        { task: "Anor compliance and steel structural member checks", completed: true },
        { task: "Portal truss welding, double coat anti-rust primer coat", completed: true },
        { task: "High-strength roof cladding assembly with ridge vents", completed: true },
        { task: "Foundry pouring of dense structural mesh floor", completed: true },
        { task: "Anti-slip epoxy compound coating and delivery to CUD officers", completed: true },
      ],
    },
    {
      id: "proj-3",
      title: "Coastal Breeze High-End Residential Villa",
      slug: "coastal-breeze-villa-limbe",
      location: "Limbe, Down Beach",
      category: "Residential",
      status: "In Progress",
      progress: 40,
      budget: 120000000,
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200",
      desc: "A custom beachfront luxury estate presenting infinity pool details, moisture-shedding exterior wall textures, and multi-deck coastal viewing pavilions utilizing saline-resistant materials.",
      architectName: "Simeon Tchounkeu",
      engineerNotes: "Sub-base utilizes thick deep grade cast-in-place retaining modules to negate sandy coastal erosion forces.",
      seoTags: {
        title: "Limbe Beachfront Luxury Residential Villa Structural Design",
        description: "Detailed ocean-front architectural layout blueprints by MADECC Group, featuring salt-tolerant specifications in Limbe, Cameroon.",
        caption: "Computer visual model showing mock coastal oceanfront residential villas with ocean view.",
        altText: "Beachfront excavation setup displaying reinforced foundation concrete works on soft sandy soils.",
        keywords: "luxury villa limbe, beachfront architecture cameroon, tropical pool villa, maritime civil construction, sandy foundation",
        hashtags: "#Limbe #CameroonLuxury #HomeDesignsCameroun #CoastalParadise",
        socialMediaHandles: "@madecc_homes",
      },
      checklists: [
        { task: "Coastal erosion modeling and soil anchoring", completed: true },
        { task: "Deep concrete pilling and anchor tie beams casting", completed: true },
        { task: "Main structure structural columns and ground deck cast", completed: true },
        { task: "Waterproofing membranes under basement and pool cavity", completed: false },
        { task: "Second floor brick masonry and roof frame truss placement", completed: false },
        { task: "Salt-proof window fit-out and high-grade coastal painting", completed: false },
      ],
    },
  ],
  invoices: [
    {
      id: "inv-1",
      invoiceNumber: "MAD-2026-INV-001",
      clientName: "SCI Kribi Development Corporation",
      clientEmail: "contact@kribidev.com",
      clientPhone: "+237 677 889 911",
      projectTitle: "Douala Port Logistics Warehouse Extension",
      date: "2026-05-02",
      dueDate: "2026-06-02",
      lineItems: [
        { description: "Final Stage Handover & Epoxy Floor Coating execution", quantity: 1, unitPrice: 15000000, total: 15000000 },
        { description: "External drainage channels fitting and masonry backfills", quantity: 300, unitPrice: 12000, total: 3600000 },
        { description: "Safety ANOR compliance certificates administration", quantity: 1, unitPrice: 400000, total: 400000 },
      ],
      subtotal: 19000000,
      vatRate: 0.1925,
      vatAmount: 3657500,
      totalAmountXAF: 22657500,
      status: "Paid",
      notes: "Payment cleared via Afriland First Bank Transfer. Thank you for partnering with MADECC Group.",
      issuedBy: "Clement Atangana (Accountant Officer)",
    },
    {
      id: "inv-2",
      invoiceNumber: "MAD-2026-INV-002",
      clientName: "Sariel Tchami (Owner, Villa 4)",
      clientEmail: "stchami@gmail.com",
      clientPhone: "+237 699 112 233",
      projectTitle: "Coastal Breeze High-End Residential Villa",
      date: "2026-05-20",
      dueDate: "2026-06-20",
      lineItems: [
        { description: "Excavation, grading machinery hire & soil stabilizer fills", quantity: 8, unitPrice: 800000, total: 6400000 },
        { description: "C30 high-strength Portland concrete bags bulk supply", quantity: 1200, unitPrice: 5000, total: 6000000 },
        { description: "Rebar structural steel rods (12mm, high elasticity) loads", quantity: 15, unitPrice: 450000, total: 6750000 },
      ],
      subtotal: 19150000,
      vatRate: 0.1925,
      vatAmount: 3686375,
      totalAmountXAF: 22836375,
      status: "Sent",
      notes: "Awaiting stage payment confirmation prior to pouring concrete for ground slab deck.",
      issuedBy: "Clement Atangana",
    },
  ],
  receipts: [
    {
      id: "rec-1",
      receiptNumber: "MAD-2026-REC-001",
      customerName: "SCI Kribi Development Corporation",
      purpose: "Final Stage Warehouse delivery and steel trusses balance payment",
      date: "2026-05-04",
      paymentMethod: "Bank Transfer",
      amountXAF: 22657500,
      vatRate: 0.1925,
      vatAmount: 3657500,
      totalXAF: 22657500,
      processedBy: "Clement Atangana",
      status: "Cleared",
      notes: "Cleared under bank ref #AFR-884920. Full site delivered.",
    },
    {
      id: "rec-2",
      receiptNumber: "MAD-2026-REC-002",
      customerName: "Dr. Samuel Eto'o Fils (Investment Consultant)",
      purpose: "Retainer for site baselining & topographic feasibility study",
      date: "2026-05-18",
      paymentMethod: "Mobile Money",
      amountXAF: 1500000,
      vatRate: 0.0,
      vatAmount: 0,
      totalXAF: 1500000,
      processedBy: "Amina Alhadji (Secretary Hub)",
      status: "Cleared",
      notes: "Mobile Money transaction validated via Orange Money Business #11920-OM. Forwarded studies to Architect Simeon.",
    },
  ],
  quotes: [
    {
      id: "quote-1",
      clientName: "Marc-Arthur Noah",
      clientEmail: "m.noah@noahinvestments.com",
      clientPhone: "+237 675 443 210",
      location: "Douala, Bonapriso",
      landSquareMeters: 600,
      projectType: "Commercial Complex",
      budgetRange: "150,000,000 XAF - 250,000,000 XAF",
      preferredStartDate: "2026-07-15",
      requestDate: "2026-05-25",
      status: "Pending",
      notes: "Intends to build a boutique 3-storey office building. Requires high-strength core pillars. Land surveyed already by official surveyor.",
    },
    {
      id: "quote-2",
      clientName: "Therese Beyala",
      clientEmail: "tbeyala@gmail.com",
      clientPhone: "+237 680 990 120",
      location: "Yaoundé, Bastos",
      landSquareMeters: 450,
      projectType: "Residential Villa",
      budgetRange: "80,000,000 XAF - 120,000,000 XAF",
      preferredStartDate: "2026-08-01",
      requestDate: "2026-05-28",
      status: "Contacted",
      notes: "Contacted by Amina on 2026-05-29 to set schedule meeting with architect Brice.",
    },
  ],
  appointments: [
    {
      id: "app-1",
      purpose: "Bastos soil leveling diagnostics and foundation alignment audit",
      date: "2026-06-05",
      engineerName: "Simeon Tchounkeu",
      clientName: "Therese Beyala",
      clientPhone: "+237 680 990 120",
      status: "Scheduled",
      notes: "First architectural and terrain physical diagnosis session"
    }
  ],
  blueprints: [
    {
      id: "bp-1",
      title: "Bastos Villa Foundation Alignment Blue-Sheet",
      fileName: "MADECC-2026-Bastos-F-01.pdf",
      fileSize: "14.2 MB",
      uploadDate: "2026-05-28",
      projectTitle: "Bastos Luxury Villa Residence",
      onacCertified: true,
      minhduApproved: false,
      status: "Awaiting Engineering Audit",
      author: "Brice Foasso"
    },
    {
      id: "bp-2",
      title: "Kribi Beachfront Resort - Portal Steel-Truss Frame",
      fileName: "MADECC-2026-Kribi-Section-F-03.pdf",
      fileSize: "28.5 MB",
      uploadDate: "2026-05-20",
      projectTitle: "Kribi Beachfront Resort",
      onacCertified: true,
      minhduApproved: true,
      status: "Approved",
      author: "Cabinet ONAC-A3"
    }
  ],
  gmSafetyDirectives: [
    "All active sites MUST execute absolute rebar tensile tests on Sanaga sand shipments before concrete casting.",
    "Ensure full respiratory harness kits are equipped during second-floor post installations on the Kribi beachfront resort yard."
  ]
};

// Ensure database state file exists and load it
let currentState: DatabaseState = { ...defaultState };

// Re-verify and resolve the absolute file path and permissions
try {
  const dbDir = path.dirname(DB_FILE);
  if (!fs.existsSync(dbDir)) {
    console.warn(`[Startup Watchdog] Warning: DB folder "${dbDir}" does not exist. Auto-creating directory branch.`);
    fs.mkdirSync(dbDir, { recursive: true });
  }
} catch (dirErr: any) {
  console.error(`[Startup Watchdog] Inaccessible db_state.json folder branch: ${dirErr.message}`);
}

try {
  if (fs.existsSync(DB_FILE)) {
    try {
      const rawData = fs.readFileSync(DB_FILE, "utf-8");
      currentState = JSON.parse(rawData);
      
      // Ensure key arrays are present
      if (!currentState.appointments) currentState.appointments = [];
      if (!currentState.blueprints) currentState.blueprints = [...defaultState.blueprints!];
      if (!currentState.gmSafetyDirectives) currentState.gmSafetyDirectives = [...defaultState.gmSafetyDirectives!];
      
      console.log(`[Startup Watchdog] Database state loaded successfully from database file on disk at: ${DB_FILE}`);
    } catch (parseErr: any) {
      console.warn(`[Startup Watchdog] Corrupted db_state.json detected: ${parseErr.message}. Auto-regenerating clean file structure.`);
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultState, null, 2), "utf-8");
    }
  } else {
    console.warn(`[Startup Watchdog] Warning: db_state.json was missing or inaccessible. Auto-generating fresh state structure to prevent startup errors.`);
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultState, null, 2), "utf-8");
  }
} catch (error: any) {
  console.error("[Startup Watchdog] Critical verification error on db_state.json path on startup:", error);
  // Auto-regenerate in process working directory as safety safeguard if the previous path failed completely
  try {
    DB_FILE = path.join(process.cwd(), "db_state.json");
    console.log(`[Startup Watchdog] Falling back and writing clean db_state.json to: ${DB_FILE}`);
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultState, null, 2), "utf-8");
  } catch (recoverErr: any) {
    console.error("[Startup Watchdog] Fatal: Failed to recover in fallback path. Resorting to in-memory db fallback.", recoverErr);
  }
}

const saveDb = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(currentState, null, 2), "utf-8");
  } catch (err: any) {
    console.error(`Error saving database state to file ${DB_FILE}:`, err);
    // Dynamic runtime self-recovery path shift if there is a permission error
    try {
      const pwdFallback = path.join(process.cwd(), "db_state.json");
      if (pwdFallback !== DB_FILE) {
        DB_FILE = pwdFallback;
        fs.writeFileSync(DB_FILE, JSON.stringify(currentState, null, 2), "utf-8");
        console.log(`Successfully recovered and shifted active active save path to: ${DB_FILE}`);
      }
    } catch (subErr: any) {
      console.error("Critical: Self-recovery path shift failed too.", subErr);
    }
  }
};

// API: get database state
app.get("/api/db", (req, res) => {
  res.json(currentState);
});

// API: download database state file (backup) with dynamic directory resolution and auto-heal
app.get("/api/admin/download-db", (req, res) => {
  try {
    // Dynamically resolve DB_FILE to ensure we locate it even when the process working directory varies
    let activeDbPath = DB_FILE;
    if (!fs.existsSync(activeDbPath)) {
      activeDbPath = getDbFilePath(); // re-evaluates through the safe resolver
    }

    if (fs.existsSync(activeDbPath)) {
      console.log(`[File Server] Serving database backup stream from verified path: ${activeDbPath}`);
      res.download(activeDbPath, "db_state.json");
    } else {
      console.warn(`[File Server] Warning: db_state.json missing from expected paths. Auto-healing by generating database snapshot on demand.`);
      fs.writeFileSync(activeDbPath, JSON.stringify(currentState, null, 2), "utf-8");
      res.download(activeDbPath, "db_state.json");
    }
  } catch (error: any) {
    console.error("[File Server] Inaccessible/failed database streaming retrieval request:", error);
    res.status(500).json({ error: `Dynamic deserialization fallback streaming failure: ${error.message}` });
  }
});

// Serve dynamic dynamic Sitemap.xml for Google Indexers & Search Console on both domains
app.get("/sitemap.xml", (req, res) => {
  const domains = ["madecc-group.online", "madecc-constructionltd.online"];
  const staticPaths = ["", "#about", "#services", "#portfolio", "#projects", "#blogs", "#privacy", "#compliance", "#terms"];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Generate URLs for both authority domains
  for (const domain of domains) {
    for (const path of staticPaths) {
      xml += `  <url>\n`;
      xml += `    <loc>https://${domain}/${path}</loc>\n`;
      xml += `    <lastmod>2026-05-30</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${path === "" ? "1.0" : "0.8"}</priority>\n`;
      xml += `  </url>\n`;
    }
    
    // Dynamic blog articles index
    const publishedBlogs = (currentState.blogs || []).filter((b: any) => b.published);
    for (const blog of publishedBlogs) {
      // Hash-routing representation
      xml += `  <url>\n`;
      xml += `    <loc>https://${domain}/#blogs/${blog.slug}</loc>\n`;
      xml += `    <lastmod>${blog.date || "2026-05-30"}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
      
      // Secondary query routing representation
      xml += `  <url>\n`;
      xml += `    <loc>https://${domain}/?page=blogs&amp;slug=${blog.slug}</loc>\n`;
      xml += `    <lastmod>${blog.date || "2026-05-30"}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    }
    
    // Dynamic construction details index
    const activeProjects = currentState.projects || [];
    for (const proj of activeProjects) {
      // Hash-routing representation
      xml += `  <url>\n`;
      xml += `    <loc>https://${domain}/#projects/${proj.slug}</loc>\n`;
      xml += `    <lastmod>2026-05-30</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
      
      // Secondary query routing representation
      xml += `  <url>\n`;
      xml += `    <loc>https://${domain}/?page=projects&amp;slug=${proj.slug}</loc>\n`;
      xml += `    <lastmod>2026-05-30</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    }
  }
  
  xml += '</urlset>';
  
  res.header("Content-Type", "application/xml");
  res.status(200).send(xml);
});

// API: save database state parts
app.post("/api/db/save", (req, res) => {
  try {
    const { blogs, projects, invoices, receipts, quotes, commandKeys, pagesContent, appointments, blueprints, gmSafetyDirectives } = req.body;
    if (blogs) currentState.blogs = blogs;
    if (projects) currentState.projects = projects;
    if (invoices) currentState.invoices = invoices;
    if (receipts) currentState.receipts = receipts;
    if (quotes) currentState.quotes = quotes;
    if (commandKeys) currentState.commandKeys = commandKeys;
    if (pagesContent) currentState.pagesContent = pagesContent;
    if (appointments) currentState.appointments = appointments;
    if (blueprints) currentState.blueprints = blueprints;
    if (gmSafetyDirectives) currentState.gmSafetyDirectives = gmSafetyDirectives;
    saveDb();
    res.json({ success: true, message: "Database state successfully synchronized on disk." });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper to lazily send SMTP emails with robust simulations if credentials are default
async function sendSmtpNotification({ subject, text, html }: { subject: string; text: string; html: string }) {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || "madeccco5@gmail.com";
  const pass = process.env.SMTP_PASS;
  const recipient = process.env.NOTIFICATION_RECIPIENT || "madeccco5@gmail.com";

  console.log(`[SMTP Outbox] Preparing email notification to route:`);
  console.log(`  To: ${recipient}`);
  console.log(`  Subject: ${subject}`);
  console.log(`  User account: ${user}`);

  const hasDummyCredentials = !pass || pass.trim() === "" || pass.includes("YOUR_GMAIL_APP_PASSWORD") || pass === "none";

  if (hasDummyCredentials) {
    console.log("--------------------------------------------------------------------------------");
    console.log(`[SMTP STDOUT SIMULATION] - SUBJECT: ${subject}`);
    console.log(`[SMTP RECIPIENT] - TO: ${recipient}`);
    console.log(`[SMTP BODY] - TEXT PART:\n${text}`);
    console.log("--------------------------------------------------------------------------------");
    return {
      success: true,
      simulated: true,
      message: "SMTP user is registered, but SMTP_PASS is missing or using default. Notification recorded locally & logged successfully."
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: port === 465, // True for 465, false for 587/other
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const info = await transporter.sendMail({
      from: `"${user}" <${user}>`,
      to: recipient,
      subject: subject,
      text: text,
      html: html,
    });

    console.log(`[SMTP Dispatch Success] Mail delivered successfully. ID: ${info.messageId}`);
    return {
      success: true,
      simulated: false,
      messageId: info.messageId
    };
  } catch (err: any) {
    console.error(`[SMTP Transmission Failure] Error sending email:`, err);
    return {
      success: false,
      simulated: false,
      error: err.message
    };
  }
}

// API: Quote Baseline submission
app.post("/api/quotes/submit", async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, location, landSquareMeters, projectType, budgetRange, preferredStartDate, notes } = req.body;
    
    if (!clientName || !clientEmail || !clientPhone) {
      return res.status(400).json({ success: false, error: "Missing mandatory fields" });
    }

    const newQuote: QuoteRequest = {
      id: "quote-" + Date.now(),
      clientName,
      clientEmail,
      clientPhone,
      location: location || "Cameroon Local",
      landSquareMeters: Number(landSquareMeters) || 200,
      projectType: projectType || "Residential Villa",
      budgetRange: budgetRange || "Under 50,000,000 XAF",
      preferredStartDate: preferredStartDate || "Directly",
      requestDate: new Date().toISOString().split('T')[0],
      status: "Pending",
      notes: notes || "",
    };

    currentState.quotes.unshift(newQuote);
    saveDb();

    // Construct elegant mail bodies
    const emailSubject = `[MADECC Quote] New Civil Baseline Request - ${clientName}`;
    const emailText = `
MADECC GROUP CAMEROON - NEW BASLINE ESTIMATE QUOTE
==================================================
A prospect client has requested a construction calculation estimation on the web platform:

Client Name: ${clientName}
Client Email: ${clientEmail}
Client Phone: ${clientPhone}
Project Type: ${projectType}
Preferred Yard Location: ${location || "Cameroon"}
Land Surface Area: ${landSquareMeters} sqm
Budget Range: ${budgetRange}
Preferred Start Date: ${preferredStartDate}

Additional Notes:
${notes || "No extra comment"}

Date Submitted: ${newQuote.requestDate}
Inquiry ID reference: ${newQuote.id}
==================================================
This is an automated dispatch from the MADECC Corporate Portal.
    `;

    const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
  <div style="background-color: #0f172a; padding: 24px; text-align: center; color: #ffffff;">
    <h1 style="margin: 0; font-size: 20px; text-transform: uppercase; tracking: 0.05em; color: #f59e0b;">MADECC GROUP</h1>
    <p style="margin: 4px 0 0; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-family: monospace;">Cameroon Building & Civil Engineering</p>
  </div>
  <div style="padding: 24px; background-color: #ffffff; color: #334155; font-size: 13px; line-height: 1.6;">
    <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 0; text-transform: uppercase;">New Baseline Estimate Request</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 6px 0; font-weight: bold; width: 40%; color: #475569;">Client Name:</td>
        <td style="padding: 6px 0; color: #0f172a;">${clientName}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-weight: bold; color: #475569;">Email Address:</td>
        <td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${clientEmail}" style="color: #ea580c; text-decoration: none;">${clientEmail}</a></td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-weight: bold; color: #475569;">Phone Number:</td>
        <td style="padding: 6px 0; color: #0f172a;">${clientPhone}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-weight: bold; color: #475569;">Project Type:</td>
        <td style="padding: 6px 0; color: #0f172a; font-weight: 500;">${projectType}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-weight: bold; color: #475569;">Target Location:</td>
        <td style="padding: 6px 0; color: #0f172a;">${location || "Cameroon"}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-weight: bold; color: #475569;">Surface Area:</td>
        <td style="padding: 6px 0; color: #0f172a;">${landSquareMeters} m²</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-weight: bold; color: #475569;">Budget Range:</td>
        <td style="padding: 6px 0; color: #0f172a; font-weight: 500; color: #059669;">${budgetRange}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-weight: bold; color: #475569;">Preferred Launch:</td>
        <td style="padding: 6px 0; color: #0f172a;">${preferredStartDate}</td>
      </tr>
    </table>
    
    <div style="background-color: #f8fafc; border-left: 4px solid #ea580c; padding: 12px; border-radius: 4px; margin-bottom: 20px;">
      <h4 style="margin: 0 0 6px; font-size: 12px; text-transform: uppercase; color: #1e293b;">Inquiry Notes & Scope Factors:</h4>
      <p style="margin: 0; font-family: monospace; white-space: pre-wrap; font-size: 11px;">${notes || "No extra commentary"}</p>
    </div>

    <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 11px; color: #64748b;">
      <p style="margin: 0;">Ref Inquiry ID: <code style="background-color: #f1f5f9; padding: 2px 4px; border-radius: 4px;">${newQuote.id}</code> | Date: ${newQuote.requestDate}</p>
      <p style="margin: 4px 0 0;">Management Desk can update target project status inside the staff workspace panel.</p>
    </div>
  </div>
</div>
    `;

    const mailResult = await sendSmtpNotification({
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    res.json({ success: true, quote: newQuote, mailSent: mailResult.success, mailSimulated: mailResult.simulated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Direct contact message submission
app.post("/api/contact/submit", async (req, res) => {
  try {
    const { fullName, email, phone, message } = req.body;

    if (!fullName || !email || !phone || !message) {
      return res.status(400).json({ success: false, error: "Please populate all inquiry fields." });
    }

    // Save general inquiries to our Quotes state with a distinct prefix label so admins can easily access them!
    const newQuote: QuoteRequest = {
      id: "quote-" + Date.now(),
      clientName: fullName,
      clientEmail: email,
      clientPhone: phone,
      location: "Inquiry Desk",
      landSquareMeters: 0,
      projectType: "General Inquiry",
      budgetRange: "None Supplied",
      preferredStartDate: "Direct",
      requestDate: new Date().toISOString().split('T')[0],
      status: "Pending",
      notes: `[SENDER: General Contact Form Inquiry]\nMessage Text: ${message}`,
    };

    currentState.quotes.unshift(newQuote);
    saveDb();

    // Send notifications to headquarters via SMTP
    const emailSubject = `[MADECC Contact] New Headquarters Inquiry - ${fullName}`;
    const emailText = `
MADECC GROUP CAMEROON - NEW GENERAL INQUIRY
===========================================
A client visitor has submitted a general inquiry form on the public layout portal:

Full Name: ${fullName}
Email Address: ${email}
Cameroon Phone: ${phone}

Message body:
"${message}"

Date Submitted: ${newQuote.requestDate}
Inquiry ID reference: ${newQuote.id}
===========================================
This notification was automatically routed on behalf of MADECC Communications Desk.
    `;

    const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
  <div style="background-color: #0f172a; padding: 24px; text-align: center; color: #ffffff;">
    <h1 style="margin: 0; font-size: 20px; text-transform: uppercase; color: #f59e0b;">MADECC GROUP</h1>
    <p style="margin: 4px 0 0; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-family: monospace;">Inquiry & Communications Desk</p>
  </div>
  <div style="padding: 24px; background-color: #ffffff; color: #334155; font-size: 13px; line-height: 1.6;">
    <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 0; text-transform: uppercase;">General Inquiry Message</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="padding: 6px 0; font-weight: bold; width: 40%; color: #475569;">Inquirer Name:</td>
        <td style="padding: 6px 0; color: #0f172a;">${fullName}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-weight: bold; color: #475569;">Client Email:</td>
        <td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #ea580c; text-decoration: none;">${email}</a></td>
      </tr>
      <tr>
        <td style="padding: 6px 0; font-weight: bold; color: #475569;">Contact Phone:</td>
        <td style="padding: 6px 0; color: #0f172a;">${phone}</td>
      </tr>
    </table>
    
    <div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 14px; border-radius: 4px; margin-bottom: 20px;">
      <h4 style="margin: 0 0 6px; font-size: 12px; text-transform: uppercase; color: #1e293b;">Message Content:</h4>
      <p style="margin: 0; white-space: pre-wrap; font-style: italic;">"${message}"</p>
    </div>

    <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 11px; color: #64748b;">
      <p style="margin: 0;">Ref Inquiry ID: <code style="background-color: #f1f5f9; padding: 2px 4px; border-radius: 4px;">${newQuote.id}</code> | Date: ${newQuote.requestDate}</p>
      <p style="margin: 4px 0 0;">This contact record was logged inside the client quote desk databases.</p>
    </div>
  </div>
</div>
    `;

    const mailResult = await sendSmtpNotification({
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    res.json({ success: true, quote: newQuote, mailSent: mailResult.success, mailSimulated: mailResult.simulated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Gemini Digital Receptionist Chatbot
app.post("/api/reception/chat", async (req, res) => {
  try {
    const { messages, userMessage } = req.body;
    
    if (!aiClient) {
      return res.json({
        success: true,
        text: `Hello! I am the MADECC Group Digital Receptionist AI (development fallback mode). 

It looks like the server is currently configured in development mode without an active GEMINI_API_KEY. However, please feel free to proceed with our high-impact redirection options:
- 💬 Message us on **WhatsApp** (+237 683 316 486)
- 📞 Give our headquarters a **Call** at +237 671 063 511
- 📋 Calculate your estimate in the **Baseline Form**
- ✉️ File a direct formal letter in the **Direct Inquiry Form**

How would you like to build today?`
      });
    }

    const systemInstruction = `
You are the MADECC Group Digital Receptionist AI, a professional, highly attentive, and welcoming customer reception advisor representing MADECC Group (Maison de Construction et de Civil S.A.) in Cameroon.
Your role is to assist clients on our corporate Portal, discuss general services, and smoothly guide them to take action via our official channels (WhatsApp, direct calling, the estimate Baseline Form, or the written Direct Inquiry Form).

### KEY COMPANY FACTS (Strict Guidelines):
- **Locations**:
  - Yaoundé (Main Office): Rue de Mbankolo, Centre Region, Cameroon.
  - Douala (Logistics Yard): Boulevard de la Bessecke, Bonabéri, Littoral, Cameroon.
- **Official Contacts**:
  - WhatsApp: +237 683316486 (or call WhatsApp directly)
  - Phone Lines for Calling: +237 671063511 / +237 683316486 / +237 640194505
  - Email: madecccons@gmail.com
- **Services Offered**: Multi-disciplinary architectural planning (ONAC certified), site baselining, masonry structural casting, reinforcement steel coatings, civil infrastructure, and financial costing estimations.
- **Key Resources & Redirections**:
  - **WhatsApp Link**: Guide them to click the floating WhatsApp button or chat with us.
  - **Hotline Calls**: They can click the floating call button or dial: +237 671063511, +237 683316486, +237 640194505.
  - **Baseline Form (Quote / Estimates constructor)**: If they ask about costs, estimates, budget, building pricing, sqm metrics, or want a custom quotation, encourage them to open the "GET ESTIMATE" or "Baseline Constructor" form.
  - **Direct Contact Form**: If they wish to leave a written message, offer the "Direct Inquiry Form" on our contact section.

### TONE & CONSTRAINTS:
- Use clear, professional, warm, and helpful language.
- Keep your answers beautifully structured, utilizing bullet points for clean layout where appropriate.
- When clients show strong intent to hire us or request estimates, always guide them directly to one of our four core channels: WhatsApp, Call, the interactive Baseline Form, or the Contact Form.
- Refer to Cameroon's local context (XAF currency, etc.) naturally when discussing concrete or permits (CUY/CUD urban councils, Cimencam, Sanaga sand).
- Keep responses relatively brief and scannable so they fit nicely within a floating chat widget.
`;

    let contents: any[] = [];
    if (messages && Array.isArray(messages) && messages.length > 0) {
      contents = messages.map((m: any) => ({
        role: m.role || "user",
        parts: [{ text: m.text }]
      }));
    } else if (userMessage) {
      contents = [{ role: "user", parts: [{ text: userMessage }] }];
    } else {
      contents = [{ role: "user", parts: [{ text: "Hello" }] }];
    }

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      success: true,
      text: response.text || "Hello! I am here to help you navigate MADECC Group. How can I assist you with your project today?"
    });

  } catch (error: any) {
    console.error("Error in Gemini Reception AI:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      text: "I apologize, but my reception connection is slightly strained right now. Please feel free to call our main reception directly at +237 671 063 511 or chat on WhatsApp at +237 683 316 486!"
    });
  }
});

// Helper to safely strip markdown code blocks and parse JSON
function cleanAndParseJson(text: string): any {
  let cleaned = text.trim();

  // Find the first '{' and the last '}'
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (err: any) {
    console.warn("Standard JSON parse failed, initiating aggressive recovery parsing...", err.message);
    try {
      const fixed = cleaned.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      const seoKeys = [
        "title",
        "description",
        "caption",
        "altText",
        "keywords",
        "hashtags",
        "socialMediaHandles",
        "suggestedArticleDraft"
      ];

      const parsedObj: Record<string, string> = {};
      let matchedAny = false;

      for (const key of seoKeys) {
        // Lookahead to ensure we match correct properties and don't greedily over-match
        const regex = new RegExp(`"${key}"\\s*:\\s*"([\\s\\S]*?)"(?=\\s*,\\s*"(?:title|description|caption|altText|keywords|hashtags|socialMediaHandles|suggestedArticleDraft)"|\\s*\\})`);
        const match = regex.exec(fixed);
        if (match && match[1] !== undefined) {
          parsedObj[key] = match[1]
            .replace(/\\"/g, '"') // Normalize double quotes
            .replace(/"/g, '\\"') // Properly escape double quotes
            .replace(/\n/g, "\\n"); // Escape raw newlines
          matchedAny = true;
        }
      }

      if (matchedAny) {
        const safeJsonStr = "{\n" + seoKeys.map(k => `  "${k}": "${parsedObj[k] || ""}"`).join(",\n") + "\n}";
        return JSON.parse(safeJsonStr);
      }
    } catch (fallbackErr: any) {
      console.error("Recovery parsing failed too:", fallbackErr.message);
    }
    throw err;
  }
}

// API: Generate SEO copy with Gemini AI
app.post("/api/seo/generate", async (req, res) => {
  try {
    const { contentType, title: inputTitle, keywords: inputKeywords, extraDetails } = req.body;

    if (!inputTitle) {
      return res.status(400).json({ success: false, error: "Content reference title is required" });
    }

    // Fallback if client is missing
    if (!aiClient) {
      // Simulate highly optimized offline solver to keep app functional if key is missing
      const words = inputTitle.split(" ");
      const keywordList = inputKeywords ? inputKeywords.split(",") : words;
      const responseFallback = {
        title: `Premium ${inputTitle} | Engineering Quality & ANOR Compliance Cameroon | MADECC`,
        description: `Expert parameters on ${inputTitle} by MADECC Group Cameroon. Learn practical tips, material cost specifications, and certified structural guidelines in Yaoundé & Douala.`,
        caption: `A verified on-site snapshot representing structural construction frameworks for: ${inputTitle}.`,
        altText: `High-quality close up visual documenting ${inputTitle} implementation work in progress under civil safety protocols.`,
        keywords: `${inputTitle.toLowerCase()}, building cameroon, construction yaounde, civil construction douala, standard concrete ${keywordList.join(", ")}`,
        hashtags: `#MADECCGroup #CameroonIndustry #${words[0] || "Construction"} #AfricanEdifices`,
        socialMediaHandles: "twitter: @madecc_group, facebook: MADECC Group Engineering",
        suggestedArticleDraft: `This editorial provides key professional insights into ${inputTitle}. Standard procedures dictate severe audits of core foundations, sand grade validations sourced from Sanaga river deposits, and reinforcement checking via Labogenie in Cameroon. For commercial and civil works, conforming strictly to physical plans avoids costly structure deformations.`
      };
      return res.json({ success: true, seo: responseFallback, generatedByAI: false });
    }

    const systemPrompt = `You are an elite SEO Optimizer and Head of Communications at MADECC Group, a highly-regulated, upscale building construction and civil engineering conglomerate in Cameroon (Central Africa). 
Generate a JSON output representing SEO parameters optimized for passing Google AdSense approval with premium status in Cameroon context (Yaoundé, Douala, Kribi, Limbe, ANOR standard compliance, ONAC architects, XAF currency, Labogenie, local river sand Sable de Sanaga, Cimencam, Dangote cement).
The response MUST match exact JSON parameters schema precisely.`;

    const userPrompt = `Generate compliance-ready AdSense-optimized SEO metadata and draft content for ${contentType || "blog post"} titled: "${inputTitle}".
Provided Initial Keywords: "${inputKeywords || "none"}"
Extra contexts: "${extraDetails || "none"}"`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.7,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            caption: { type: Type.STRING },
            altText: { type: Type.STRING },
            keywords: { type: Type.STRING },
            hashtags: { type: Type.STRING },
            socialMediaHandles: { type: Type.STRING },
            suggestedArticleDraft: { type: Type.STRING },
          },
          required: [
            "title",
            "description",
            "caption",
            "altText",
            "keywords",
            "hashtags",
            "socialMediaHandles",
            "suggestedArticleDraft",
          ],
        },
      },
    });

    const textOutput = response.text || "{}";
    const seoData = cleanAndParseJson(textOutput);

    res.json({ success: true, seo: seoData, generatedByAI: true });

  } catch (error: any) {
    console.error("Gemini server-side invocation failed:", error);
    res.status(500).json({ success: false, error: error.message || "SEO generator failed" });
  }
});

// Serve Vite in development, static in production
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite server middleware in Development...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving compiled static files in Production...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[READY] MADECC Group Cameroon Full-Stack Server running on port ${PORT}`);
  });
};

startServer();
