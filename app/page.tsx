"use client";

import { useState } from "react";
import { ArrowDownRight, ChevronDown, Download, ExternalLink, Github, Linkedin, Mail, Menu, X } from "lucide-react";

const categories = ["B2B SaaS","AI Products","Product Ownership","Automation","Python · SQL · APIs"] as const;
const linkedinHref = ["https://www.linkedin.com", "/in/mohammed-8472781a7/"].join("");
type Category = typeof categories[number];
type CaseStudy = { id:string; category:Category[]; label:string; title:string; tags:string[]; summary:string; meta?:[string,string][]; flow?:string[]; visuals?:{title:string;caption:string;type:"email"|"compose"|"calendar"}[]; details:[string,string][]; technical?:string[] };

const cases: CaseStudy[] = [
  { id:"duplicates", category:["B2B SaaS","Product Ownership","Automation","Python · SQL · APIs"] as Category[], label:"ARBOUR · DATA QUALITY", title:"Designing a Safer Investor Data Import Workflow", tags:["Product Discovery","Data Quality","Duplicate Detection","Fuzzy Matching"], summary:"A data-quality problem became a product workflow: detect likely duplicate investors early, explain the match, and let the user decide before records are incorrectly merged.", meta:[["Role","Product Owner · Full Stack Engineer"],["Focus","Investor data quality"],["Scope","Import · matching · resolution"]], flow:["Upload investor data","Normalize & identify","Find likely matches","Show conflicts","User resolves","Update canonical record"], details:[["The problem","Investor data entered the platform from different sources could represent the same underlying investor under different names or identifiers. If duplicates were allowed through, the problem became harder to fix downstream."],["What I investigated","I used SQL and record-level comparisons to understand how duplicate data was being introduced. The investigation pointed to project creation and import as the right places to intervene."],["Product decision","Move duplicate detection upstream. Instead of treating data cleanup as a separate administrative task, make it part of the workflow where new investor data enters the product."],["How the workflow works","Uploaded data is parsed and normalized, then compared against existing investor records. Potential matches are surfaced with supporting context so the user can confirm, replace, or keep the incoming record."],["Resolution paths","The product supports suggested matches, conflict handling, choosing an existing investor, creating a new investor when appropriate, and preventing obvious duplicate name-and-country records during manual actions."],["Technical contribution","Built across the React interface and Python/Flask backend, with SQLAlchemy data access, spreadsheet parsing, country/name normalization and fuzzy matching. The repository also contains a dedicated duplicate-resolution workflow for duplicates found inside uploaded files."],["Why this mattered","The goal was not simply to make matching more accurate. It was to make the product help users resolve ambiguity at the moment it appears, while keeping the final decision with the person who knows the data."],["Reflection","Data quality is a product-design problem as much as a database problem. Good workflows prevent repeated cleanup by making the right decision easier at the point of entry."]], technical:["React","Python / Flask","SQL / SQLAlchemy","XLSX import & parsing","Fuzzy matching","REST APIs"] },
  { id:"pipeline-intelligence", category:["B2B SaaS","Product Ownership","Automation","Python · SQL · APIs"] as Category[], label:"ARBOUR · ANALYTICS", title:"Turning Investor Data Into Decision-Ready Pipeline Intelligence", tags:["Product Strategy","Analytics","Pipeline Intelligence","Historical Metrics"], summary:"Designed the metric layer behind an investor dashboard so teams could move from rows of operational data to a clearer view of pipeline activity, probability, commitment and change over time.", meta:[["Role","Product Owner · Full Stack Engineer"],["Focus","Investor pipeline intelligence"],["Scope","Metrics · dashboard · snapshots"]], flow:["Raw investor data","Define decision metrics","Calculate live signals","Segment the pipeline","Compare with baseline","Capture daily snapshot"], details:[["The problem","Investor information existed as operational rows, but decision-making required people to interpret commitment, outreach, probability, investor segments and decline patterns across the dataset."],["What I investigated","I worked through the underlying investor fields and existing workflows to determine which signals could support recurring pipeline decisions. The dashboard was shaped around metrics that could be calculated consistently from the product's data rather than around visualisations alone."],["Product decision","Structure the dashboard around a small set of decision-oriented views: investor universe and exclusions, estimated commitment, outreach activity, probability distribution, high-probability targets, ticket-size ranges and decline patterns."],["How the metric layer works","The backend calculates current metrics from sheet or consolidated-folder data, normalises fields such as probability and ticket size, removes excluded investors from relevant calculations, and returns current values together with historical deltas."],["Making change visible","Daily snapshots store metrics such as estimated commitment, investors reached, probability distribution, top targets, decline counts and ticket-size buckets. Period views can then compare current state with a historical baseline instead of showing a static number."],["Dashboard experience","The interface presents KPI cards, outreach breakdowns by country and investor type, probability views, top-target signals, estimated ticket-size analysis and decline-reason breakdowns. The goal is to help users inspect the pipeline from several decision angles without leaving the workspace."],["Technical contribution","Built across React and Python/Flask, using Recharts for interactive visualisations and SQLAlchemy-backed metric and snapshot models. GitHub Actions was used to run the daily snapshot workflow so historical metrics could be captured automatically."],["Why this mattered","The product value was not the charting itself. It was creating a repeatable way to turn operational investor data into signals that could be compared, segmented and revisited over time."],["Reflection","A useful analytics product starts with the decisions users need to make. The visual layer becomes much more valuable when the underlying metric definitions, exclusions and historical comparisons are explicit."]], technical:["React","Python / Flask","SQL / SQLAlchemy","Recharts","Metric APIs","GitHub Actions · daily snapshots"] },
  { id:"consolidated-workspace", category:["B2B SaaS","Product Ownership","Python · SQL · APIs"] as Category[], label:"ARBOUR · WORKSPACE", title:"Building a Unified Investor Workspace From Fragmented Data", tags:["B2B SaaS","Data Consolidation","Workspace Design","Operational UX"], summary:"A folder-level workspace brought investor records from multiple sheets into one consistent view, while preserving a familiar spreadsheet workflow for review, analysis and export.", meta:[["Role","Product Owner · Full Stack Engineer"],["Focus","Investor workspace"],["Scope","Consolidation · layout · access"]], flow:["Multiple investor sheets","Collect folder data","Merge into one dataset","Normalize the view","Analyse in context","Share or export"], details:[["The problem","Investor information lived across separate sheets. Reviewing the overall pipeline meant switching between datasets and reasoning about a larger picture that was not represented in one place."],["Product decision","Create a folder-level consolidated workspace rather than forcing users to manually combine sheets. The consolidated view should feel like the existing spreadsheet experience, so users could inspect the combined data without learning a separate interface."],["How consolidation works","The backend gathers the rows from every sheet in a folder and maintains a single consolidated dataset associated with that folder. The frontend loads that dataset and presents it through the same spreadsheet-oriented workspace used elsewhere in the product."],["Consistency matters","Different sheets can carry variations in fields such as country naming. The consolidated view normalises country fields and removes legacy duplicate column variants so the combined dataset remains coherent."],["Keeping the view usable","Column ordering follows a canonical product layout, with the first real sheet used as a reference for additional columns. The consolidated page also supports refresh and passes the combined data into the dashboard layer for analysis."],["Access and sharing","The consolidated workspace has its own sharing model with view/edit permissions. Share recipients are registered users, receive a direct workspace link by email, and access is checked alongside folder and sheet permissions."],["Technical contribution","Built the consolidation flow across Python/Flask, SQLAlchemy and React. The workspace stores consolidated data at folder level, preserves column order and widths, reuses the spreadsheet UI, and integrates with dashboard and download workflows."],["Why this mattered","The feature turned a collection of separate operational sheets into a shared working surface. That reduced the product-level problem from 'find the right sheet' to 'work from the combined investor view'."],["Reflection","Good internal tools often win by removing coordination overhead. A unified workspace does not need a new interaction model when it can make the existing one work across a broader scope."]], technical:["React","Python / Flask","SQL / SQLAlchemy","Folder-level data consolidation","Spreadsheet workspace","Sharing & permissions"] },
  { id:"reporting", category:["B2B SaaS","Product Ownership","Automation","Python · SQL · APIs"] as Category[], label:"ARBOUR · REPORTING", title:"Turning Operational Data Into an Editable Reporting Workflow", tags:["Product Workflow","Report Builder","Automation","DOCX · PDF"], summary:"Designed a report-building workflow that lets users filter investor data, preview the output, edit the narrative, save a report snapshot and export it as a Word or PDF document.", meta:[["Role","Product Owner · Full Stack Engineer"],["Focus","Operational reporting"],["Scope","Filters · preview · export"]], flow:["Select investor data","Filter the pipeline","Generate preview","Edit the narrative","Save a snapshot","Export DOCX / PDF"], details:[["The problem","Operational investor data needed to become a report that could be reviewed and edited before distribution. A direct export would not give users enough control over which investors or pipeline segments appeared in the final document."],["What I investigated","I worked through the reporting workflow and the underlying investor fields to identify useful report filters and the information that needed to remain editable in the preview. The implementation supports investor selection, probability and ticket-size filtering, while keeping report content structured for export."],["Product decision","Treat reporting as a workflow rather than a download button: let users shape the dataset, inspect the generated report, adjust the narrative and selected investor details, then create a saved snapshot."],["How the workflow works","Users can search and select investors, choose probability values and ticket sizes, generate a report preview, edit overview text and investor-level notes, then export the current report as DOCX or PDF."],["Preview as a review step","The preview surfaces report title and month, an overview, meeting and investor context, probability and ticket-size metadata, main points, meeting notes and next steps. Historical change-log entries can also be incorporated into selected report content."],["Saved reports","Exports create a report record associated with the folder, storing the applied filters and saved report JSON alongside the generated file. Existing reports can be reopened and downloaded from the reporting workspace."],["Technical contribution","Built the workflow across React and Python/Flask, with SQLAlchemy-backed folder report persistence, DOCX generation using python-docx, PDF generation using ReportLab, authenticated download handling and a report-builder UI for filtering, preview and editing."],["Why this mattered","The product moved reporting closer to the point where users already manage investor information. Instead of rebuilding a report outside the system, users could select, review and refine the output within the workspace."],["Reflection","Automation is most useful when it removes repetitive work without removing review. A good reporting workflow automates structure and generation while keeping the user in control of the final narrative."]], technical:["React","Python / Flask","SQL / SQLAlchemy","python-docx","ReportLab","REST APIs"] },

  { id:"collaboration", category:["B2B SaaS","Product Ownership","Automation","Python · SQL · APIs"] as Category[], label:"ARBOUR · COLLABORATION", title:"Making Shared Product Workflows Visible and Auditable", tags:["Collaboration","Permissions","Audit History","Operational UX"], summary:"Designed the collaboration layer around shared investor work: controlled access, visible presence and change history so teams could work in the same data environment with clearer accountability.", meta:[["Role","Product Owner · Full Stack Engineer"],["Focus","Collaborative workflows"],["Scope","Access · presence · history"]], flow:["Share the workspace","Set permissions","See active users","Edit shared data","Record changes","Review history"], details:[["The problem","Investor workflows were increasingly collaborative, which introduced a second product problem beyond editing data: users needed to know who could access a workspace and understand what had changed over time."],["What I investigated","I worked through the access model, shared-workspace behaviour and the points where edits needed traceability. The implementation separates view and edit permissions, tracks active sheet presence and stores cell-level change information."],["Product decision","Treat collaboration as part of the product workflow rather than as an afterthought. Sharing should have explicit permissions, active users should have a visible presence state, and important edits should leave a history that can be reviewed."],["Access and sharing","Sheet and consolidated-workspace sharing supports view or edit permissions. Owners control sharing, registered users receive direct links, and access is checked alongside the existing folder and sheet permissions."],["Presence","The product tracks a user's sheet, device and browser-tab context together with view/edit mode, active/idle/away status and a last-ping timestamp. This creates a lightweight presence model for shared operational work."],["Audit history","Changes are stored with the sheet, row, investor, column, old value, new value, timestamp and related context. That makes it possible to inspect how an investor record changed rather than only seeing its latest state."],["Technical contribution","Built across React and Python/Flask with SQLAlchemy-backed sharing, presence and change-log models, authenticated access checks and email-based sharing flows."],["Why this mattered","As a product becomes a shared system of record, collaboration needs more than a multi-user UI. Permissions and history help make shared work understandable and accountable."],["Reflection","Collaboration features are product infrastructure. The useful question is not only 'can two people edit the same data?' but 'can they understand access, activity and change without creating extra coordination work?'"]], technical:["React","Python / Flask","SQL / SQLAlchemy","Permissions & access control","Presence tracking","Cell-level change history"] },

  {
    id:"historical-investments",
    category:["B2B SaaS","Product Ownership","Python · SQL · APIs"] as Category[],
    label:"ARBOUR · INVESTOR INTELLIGENCE",
    title:"Adding Historical Investment Context to Investor Profiles",
    tags:["Historical Data","Investor Intelligence","Data Matching","Workflow Design"],
    summary:"Extended investor profiles with historical investment records so teams could see prior investment context alongside current pipeline information.",
    meta:[
      ["Role","Product Owner · Full Stack Engineer"],
      ["Focus","Historical investment intelligence"],
      ["Scope","Import · matching · investor context"]
    ],
    flow:[
      "Historical investment file",
      "Dry-run & inspect matches",
      "Resolve ambiguous investors",
      "Import historical records",
      "Combine with tracker history",
      "Review investor context"
    ],
    details:[
      ["The problem","Historical investment information existed outside the current investor workflow. Without that context, users had to reconstruct an investor's previous activity separately from the current pipeline."],
      ["What I investigated","I traced how historical investment rows could be imported, matched to existing investors and surfaced alongside current investor information. The workflow needed a safe way to identify unresolved matches before records were committed."],
      ["Product decision","Treat historical investment data as structured investor context rather than a one-off file attachment. The import workflow should support inspection and resolution before the historical records become part of the product's investor view."],
      ["How the workflow works","Historical CSV or XLSX data can be processed through a dry-run first. The result identifies matched and unresolved rows, allowing ambiguous investors to be resolved before the final import."],
      ["Data captured","Historical records can include investor, GP, fund, partner, ticket size, investment date and year, together with source information used to keep imported records traceable."],
      ["Investor context","Imported history is combined with tracker-derived investment history and surfaced in investor details, giving users historical context alongside the current investor record."],
      ["Technical contribution","Built the workflow across React and Python/Flask with SQLAlchemy-backed historical investment modelling, CSV/XLSX parsing, investor matching, date and ticket-size parsing, safe upsert behaviour and investor-detail integration."],
      ["Why this mattered","Historical investment context can change how a current investor relationship is understood. Bringing that information into the same workflow reduces the need to reconstruct prior activity outside the product."],
      ["Reflection","Historical data becomes more useful when it is matched, structured and placed where decisions already happen. The import workflow also needs to make ambiguity visible rather than silently guessing."],
    ],
    technical:[
      "React",
      "Python / Flask",
      "SQL / SQLAlchemy",
      "CSV / XLSX import",
      "Investor matching",
      "Historical data modelling"
    ]
  },

  {
    id:"fil-ai",
    category:["AI Products","Product Ownership","Automation","Python · SQL · APIs"] as Category[],
    label:"FIL · AI PRODUCT",
    title:"Designing an AI Assistant That Turns Digital Communication Into Action",
    tags:["AI Product Management","Product Vision","Wireframing","Automation"],
    summary:"Defined the product vision for FIL, an AI-powered personal assistant designed to understand everyday digital communication and turn important information into useful actions, reminders, drafts and scheduling support.",
    meta:[
      ["Role","Product Manager · FIL AI initiative"],
      ["Focus","AI-assisted personal productivity"],
      ["Scope","Vision · wireframes · roadmap · execution"]
    ],
    flow:[
      "Read communication",
      "Understand intent",
      "Extract important context",
      "Suggest an action",
      "User reviews",
      "Act, schedule or remind"
    ],
    visuals:[
      {
        title:"Email workspace",
        caption:"Core email surface with inbox navigation, search and communication context.",
        type:"email"
      },
      {
        title:"AI-assisted composition",
        caption:"The assistant interprets intent and proposes a response that the user can regenerate, send or save as a draft.",
        type:"compose"
      },
      {
        title:"Calendar workflow",
        caption:"Scheduling sits alongside communication, with meeting creation and editing as part of the assistant experience.",
        type:"calendar"
      }
    ],
    details:[
      ["The problem","Important information is often buried inside email and digital conversations. Requests, commitments, follow-ups and decisions can be easy to overlook when communication is spread across busy inboxes and chats."],
      ["Product vision","FIL was conceived as a personal digital assistant for the digital world: a system that can understand communication, organise a user's workload and help complete actions rather than simply displaying information."],
      ["What I owned","I developed the concept and product direction, created the wireframes and interaction ideas, shaped the roadmap, planned the work and drove execution with developers who implemented the product."],
      ["AI as the product layer","AI is central to the workflow. The product concept uses AI to read and interpret communication, identify intent and important information, suggest responses, support scheduling and surface reminders or to-do items."],
      ["Email and communication","The wireframes explore an email workspace with a Smart Actions concept for prioritising work functions. The assistant can scan a thread, infer a user's intent and suggest a response instead of making the user start from an empty compose window."],
      ["User control","AI-generated communication is designed as an assisted workflow rather than an invisible action. The composition wireframe includes explicit Regenerate, Send and Save as draft actions, keeping the user involved in the final decision."],
      ["Beyond the inbox","The product concept connects email with a conversational dashboard, notifications and calendar workflows. The dashboard was designed as a personal assistant-style interface for requesting information and surfacing actions, while calendar flows cover creating, editing and managing meetings."],
      ["Roadmap thinking","The broader vision included automatic reminders, to-do generation, improved communication language, context-aware scheduling and communicating on the user's behalf. These were treated as product direction and roadmap concepts rather than all being represented as a single implemented capability."],
      ["Why this mattered","The product opportunity was not simply to add a chatbot to an inbox. It was to use AI to connect scattered communication with the actions that follow from it, reducing the amount of information users have to manually remember, interpret and coordinate."],
      ["Reflection","Good AI product design starts with the user's workflow. FIL was shaped around a simple loop: understand the context, identify what matters, suggest the next action and keep the user in control of what happens next."]
    ],
    technical:["AI / LLM workflows","Product discovery & roadmap","Wireframing","Email & calendar workflows","Conversational UI","Automation"]
  },

  { id:"excel", category:["B2B SaaS","Product Ownership"] as Category[], label:"PRODUCT JUDGEMENT", title:"When a Technically Simple Feature Wasn't the Right Product Decision", tags:["Product Strategy","Stakeholders","Workflow Design"], summary:"Challenged a technically simple upload feature because it could reinforce the workflow the product was trying to replace.", details:[["Context","Engineering proposed allowing users to upload Excel files to automatically populate the product."],["My concern","If every user could upload Excel files, users might continue doing their core work in Excel and use the platform mainly as a data-upload tool."],["Product goal","Move the user's core workflow into the platform."],["Decision","After discussion with engineering and stakeholders, upload functionality was made available to administrators rather than normal users."],["Why it mattered","The constraint aligned the feature with the intended workflow instead of optimising only for technical convenience."],["Reflection","A feature being technically possible does not mean it supports the desired user behaviour or product strategy."]] }
];

function Header(){const [open,setOpen]=useState(false); const links=[["Work","#work"],["How I Think","#how"],["About","#about"],["Resume","#resume"],["Contact","#contact"]]; return <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/90 backdrop-blur"><div className="container-page flex h-16 items-center justify-between"><a href="#top" className="focus-ring text-sm font-semibold">Gouse<span className="text-sage">.</span></a><nav className="hidden gap-7 md:flex">{links.map(([l,h])=><a className="focus-ring text-sm text-slate-600 hover:text-ink" key={h} href={h}>{l}</a>)}</nav><button className="focus-ring rounded-lg p-2 md:hidden" aria-label="Toggle navigation" onClick={()=>setOpen(!open)}>{open?<X size={20}/>:<Menu size={20}/>}</button></div>{open&&<nav className="border-t border-line bg-paper px-5 py-4 md:hidden">{links.map(([l,h])=><a onClick={()=>setOpen(false)} className="block py-3 text-sm" key={h} href={h}>{l}</a>)}</nav>}</header>}

function ArbourVisual({ id }: { id: string }) {
  const labels: Record<string, string[]> = {
    duplicates: ["Upload", "Match", "Resolve"],
    "pipeline-intelligence": ["Signals", "Segments", "History"],
    "consolidated-workspace": ["Sheets", "Unified view", "Export"],
    reporting: ["Filter", "Preview", "Export"],
    collaboration: ["Share", "Edit", "History"],
    "historical-investments": ["Import", "Match", "Context"],
  };
  const items = labels[id] ?? ["Problem", "Decision", "Build"];

  return (
    <div className="mt-7 overflow-hidden rounded-xl border border-line bg-paper p-4">
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        <span>Product workflow</span>
        <span>ARBOUR</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {items.map((item, index) => (
          <div key={item} className="relative">
            <div className={`rounded-lg border px-2 py-3 text-center text-[11px] font-semibold ${index === 1 ? "border-sage/40 bg-white text-ink shadow-sm" : "border-line bg-white/70 text-slate-600"}`}>
              <span className="mr-1 text-[9px] text-sage">0{index + 1}</span>{item}
            </div>
            {index < items.length - 1 && <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-slate-300 sm:block">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function CaseCard({ c, featured = false }: { c: CaseStudy; featured?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article id={c.id} className={`scroll-mt-24 group overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${featured ? "featured-case lg:shadow-sm" : ""}`}>
      <button type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="focus-ring block w-full p-6 text-left sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div className="max-w-4xl">
            <p className="eyebrow">{c.label}</p>
            <h3 className={`mt-2 font-semibold tracking-tight ${featured ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"}`}>{c.title}</h3>
            <p className="muted mt-4 max-w-3xl text-base">{c.summary}</p>
          </div>
          <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-slate-600">
            <ChevronDown size={18} className={expanded ? "rotate-180 transition-transform" : "transition-transform"} />
          </span>
        </div>
        <div className="mt-7 flex flex-wrap gap-2">{c.tags.map((tag) => <span className="pill" key={tag}>{tag}</span>)}</div>
        {!featured && <ArbourVisual id={c.id} />}
        {c.meta && <div className="mt-7 grid gap-3 border-t border-line pt-5 sm:grid-cols-3">{c.meta.map(([key,value]) => <div key={key}><p className="eyebrow">{key}</p><p className="mt-1 text-sm font-medium text-ink">{value}</p></div>)}</div>}
        <div className="mt-6 text-sm font-semibold text-sage">{expanded ? "Close case study" : "Read full case study"} <span className="ml-1">→</span></div>
      </button>
      {expanded && <div className="case-detail border-t border-line bg-paper/50 px-6 pb-8 sm:px-8 sm:pb-10"><div className="pt-8">
        {c.flow && <><p className="eyebrow">Product flow</p><div className="mt-4 flex flex-wrap items-center gap-2">{c.flow.map((step,index) => <div key={step} className="flex items-center gap-2"><span className="rounded-full border border-line bg-white px-3 py-2 text-xs font-medium text-slate-700">{step}</span>{index < c.flow!.length - 1 && <span className="hidden text-slate-300 sm:inline">→</span>}</div>)}</div></>}
        {c.visuals && <div className="mt-10 rounded-2xl border border-line bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Product concept · FIL</p>
              <h4 className="mt-2 text-xl font-semibold tracking-tight">From communication to action</h4>
            </div>
            <p className="max-w-md text-xs leading-5 text-slate-500">Selected early wireframe concepts showing how email, AI-assisted composition and calendar workflows were connected.</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {c.visuals.map((visual, index) => (
              <div key={visual.title} className={`group overflow-hidden rounded-2xl border border-line bg-paper ${index === 1 ? "md:-translate-y-2 md:shadow-md" : ""}`}>
                <div className="border-b border-line bg-white px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{visual.title}</p>
                    <span className="rounded-full border border-line px-2 py-1 text-[10px] font-semibold text-sage">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{visual.caption}</p>
                </div>
                <div className="p-4">
                  <div className="min-h-[190px] rounded-xl border border-slate-300 bg-slate-50 p-3 text-[8px] text-slate-500 shadow-sm transition-transform duration-300 group-hover:scale-[1.015]">
                    {visual.type === "email" && <><div className="flex gap-2 border-b border-slate-200 pb-2 font-semibold"><span>Email</span><span>Dashboard</span><span>Calendar</span><span>Notifications</span></div><div className="mt-4 grid grid-cols-[62px_1fr] gap-3"><div className="space-y-2 font-medium"><div>Inbox</div><div>Starred</div><div>Sent</div><div>Unread</div></div><div className="space-y-2"><div className="h-7 rounded bg-slate-200"/><div className="h-7 rounded bg-slate-200"/><div className="h-7 rounded bg-slate-200"/><div className="h-7 rounded bg-slate-200"/></div></div><div className="mt-4 rounded border border-slate-200 bg-white p-2 font-medium">Smart Actions · AI reads the thread</div></>}
                    {visual.type === "compose" && <><div className="flex gap-2 border-b border-slate-200 pb-2 font-semibold"><span>Email</span><span>Dashboard</span><span>Calendar</span><span>Compose</span></div><div className="mt-4 font-semibold">Email subject</div><div className="mt-2 h-5 w-2/3 rounded bg-slate-200"/><div className="mt-3 h-14 rounded border border-slate-200 bg-white"/><div className="mt-3 rounded border border-slate-200 bg-white p-2">AI-suggested response</div><div className="mt-3 flex gap-1"><span className="rounded border border-slate-300 px-2 py-1">Regenerate</span><span className="rounded border border-slate-300 px-2 py-1">Send</span><span className="rounded border border-slate-300 px-2 py-1">Save draft</span></div></>}
                    {visual.type === "calendar" && <><div className="flex items-center justify-between border-b border-slate-200 pb-2 font-semibold"><span>Calendar</span><span>Month</span></div><div className="mt-3 grid grid-cols-7 gap-px bg-slate-200">{Array.from({length:28}).map((_,index) => <div key={index} className="h-5 bg-white"/>)}</div><div className="mt-4 flex gap-2"><span className="rounded border border-slate-300 px-2 py-1">+ New Meeting</span><span className="rounded border border-slate-300 px-2 py-1">Search</span></div></>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>}
        <div className="mt-9 grid gap-x-10 gap-y-8 sm:grid-cols-2">{c.details.map(([key,value]) => <div key={key}><p className="eyebrow">{key}</p><div className="mt-2 text-sm leading-7 text-slate-700">{value}</div></div>)}</div>
        {c.technical && <div className="mt-9 border-t border-line pt-6"><p className="eyebrow">Technical contribution</p><div className="mt-4 flex flex-wrap gap-2">{c.technical.map((item) => <span className="pill" key={item}>{item}</span>)}</div></div>}
      </div></div>}
    </article>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("B2B SaaS");
  const visibleCases = cases.filter((c) => c.category.includes(activeCategory));

  return (
    <>
      <Header />
      <main id="top">
        <section className="container-page grid min-h-[calc(100vh-4rem)] items-center py-20 sm:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <p className="eyebrow">Berlin, Germany · Product · Technology · Execution</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-7xl">
                Gouse Mohiddin Mohammed
              </h1>
              <p className="mt-6 text-lg font-medium text-sage sm:text-xl">
                Product Owner · Technical Product Manager · AI & SaaS
              </p>
              <p className="mt-7 max-w-2xl text-xl leading-8 text-slate-700 sm:text-2xl sm:leading-9">
                I turn ambiguous business problems into clear product decisions, technical plans and usable digital products.
              </p>
              <p className="muted mt-5 max-w-2xl">
                I work across product discovery, requirements, technical delivery, AI, automation and B2B SaaS — connecting user needs, business context and engineering reality.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white" href="#work">
                  View my work <ArrowDownRight size={16} />
                </a>
                <a className="focus-ring inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold" href="/resume.pdf" download>
                  Download CV <Download size={16} />
                </a>
                <a className="focus-ring inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold" href={linkedinHref} target="_blank" rel="noreferrer">
                  LinkedIn <ExternalLink size={15} />
                </a>
              </div>
            </div>

            <div className="product-system" aria-label="Product thinking system">
              <div className="system-top">
                <span>PRODUCT SYSTEM</span>
                <span className="system-status">● LIVE THINKING</span>
              </div>
              <div className="system-core">
                <div className="core-ring ring-a"></div>
                <div className="core-ring ring-b"></div>
                <div className="core-center">P</div>
                <div className="node node-1"><span>01</span>Problem</div>
                <div className="node node-2"><span>02</span>Data</div>
                <div className="node node-3"><span>03</span>Decision</div>
                <div className="node node-4"><span>04</span>Build</div>
              </div>
              <div className="system-bottom">
                <span>Business</span><span>↔</span><span>Technology</span><span>↔</span><span>Users</span>
              </div>
            </div>
          </div>

          <div className="mt-16 max-w-5xl overflow-x-auto rounded-2xl border border-line bg-white p-1">
            <div className="flex min-w-max gap-1">
              {categories.map((x) => (
                <button
                  type="button"
                  key={x}
                  onClick={() => setActiveCategory(x)}
                  aria-pressed={activeCategory === x}
                  className={`focus-ring rounded-xl px-4 py-3 text-sm font-semibold transition sm:px-5 ${activeCategory === x ? "bg-ink text-white" : "text-slate-600 hover:bg-mint hover:text-ink"}`}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="container-page scroll-mt-20 py-20 sm:py-28">
          <p className="eyebrow">Selected work</p>
          <h2 className="section-title">A product portfolio built around decisions, not buzzwords.</h2>
          <p className="muted mt-5 max-w-2xl">
            These cases focus on the problem, the investigation, the decision and the contribution — including where technical context mattered.
          </p>
          <div className="mt-10 space-y-6">
            {visibleCases.length > 0 && visibleCases[0].id === "fil-ai" && (
              <CaseCard key="fil-ai" c={visibleCases[0]} featured />
            )}
            <div className={`grid gap-5 ${visibleCases.length > 0 && visibleCases[0].id === "fil-ai" ? "md:grid-cols-2" : ""}`}>
              {visibleCases.filter((c) => c.id !== "fil-ai").map((c) => (
                <CaseCard key={c.id} c={c} />
              ))}
            </div>
          </div>
          <p className="muted mt-7 text-xs">
            Examples are based on professional experience. Confidential company information, customer data and proprietary implementation details have been omitted or recreated.
          </p>
        </section>

        <section id="how" className="scroll-mt-20 border-y border-line bg-white py-20 sm:py-28">
          <div className="container-page">
            <p className="eyebrow">How I think</p>
            <h2 className="section-title">A practical loop from ambiguity to improvement.</h2>
            <div className="mt-12 grid gap-3 md:grid-cols-7">
              {[
                ["01", "Understand", "Talk to users and stakeholders; clarify the problem."],
                ["02", "Investigate", "Use data, workflows and technical context to understand what is really happening."],
                ["03", "Define", "Translate the problem into clear requirements and user outcomes."],
                ["04", "Decide", "Make trade-offs across user needs, business goals and technical reality."],
                ["05", "Build", "Work closely with engineering and design."],
                ["06", "Measure", "Look at adoption, efficiency, quality and operational impact."],
                ["07", "Improve", "Use feedback and data to iterate."],
              ].map(([n, t, d]) => (
                <div key={t} className="card p-5">
                  <span className="text-xs font-semibold text-sage">{n}</span>
                  <h3 className="mt-4 font-semibold">{t}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="container-page scroll-mt-20 py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <p className="eyebrow">About</p>
              <h2 className="section-title">Product-minded, technically fluent, grounded in execution.</h2>
              <p className="muted mt-6 max-w-2xl">
                My background combines Product Owner and Full Stack Engineer experience at Arbour with AI product management work, business development, product operations and data/ML experience. I enjoy working where the problem is still slightly messy and the team needs someone who can connect business context to technical delivery.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="card p-5">
                  <p className="eyebrow">Recent experience</p>
                  <div className="mt-3 space-y-4 text-sm leading-6">
                    <div><p className="font-semibold text-ink">Product Owner & Full Stack Engineer · Arbour</p><p className="text-slate-500">Nov 2024 – May 2026 · Berlin (Remote)</p></div>
                    <div><p className="font-semibold text-ink">Product Manager · FIL AI initiative</p><p className="text-slate-500">4–5 months · within Arbour</p></div>
                    <div><p className="font-semibold text-ink">Business Development Intern · MetalMaker3D</p><p className="text-slate-500">Apr 2023 – Aug 2023 · Remote</p></div>
                  </div>
                </div>
                <div className="card p-5">
                  <p className="eyebrow">Education</p>
                  <p className="mt-3 text-sm leading-7">
                    Master's in International Technology Transfer Management · FHM<br />
                    Bachelor’s in Mechanical Engineering · Andhra University
                  </p>
                </div>
              </div>
            </div>
            <div className="card p-7">
              <p className="eyebrow">Technical fluency</p>
              <ul className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                {["Python", "SQL", "React", "REST APIs", "Git / GitHub Actions", "Cloud systems", "Data analysis", "Dashboards", "Figma", "Jira", "Confluence", "Miro"].map((x) => (
                  <li className="flex items-center gap-3" key={x}><span className="h-1.5 w-1.5 rounded-full bg-sage" />{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="resume" className="border-y border-line bg-mint py-16">
          <div className="container-page flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Resume</p>
              <h2 className="mt-2 text-2xl font-semibold">Want the one-page version?</h2>
              <p className="muted mt-2">A concise CV for applications and recruiter screens.</p>
            </div>
            <a className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white" href="/resume.pdf" download>
              Download Resume <Download size={16} />
            </a>
          </div>
        </section>

        <section id="contact" className="container-page scroll-mt-20 py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="eyebrow">Contact</p>
            <h2 className="section-title">Interested in working together?</h2>
            <p className="muted mt-5">For product, product operations, technical product or digital transformation conversations, the easiest route is email or LinkedIn.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white" href="mailto:mohiddinmohammed24@gmail.com"><Mail size={16} /> Email</a>
              <a className="focus-ring inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold" href={linkedinHref} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>
              <a className="focus-ring inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold" href="https://github.com/MohiddinMohammed" target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-8">
        <div className="container-page flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Gouse Mohiddin Mohammed</span>
          <span>Berlin, Germany · Product · Technology · Execution</span>
        </div>
      </footer>
    </>
  );
}
