/**
 * Each project from its customer's side. Taken from the project's own record;
 * a project without notes here shows its own tagline and description instead.
 */
export interface CaseNote {
  who: string;
  problem: string;
  built: string;
  /** What the product does for the person using it. */
  gives: string[];
  /** The service on the contact form for someone with a similar need. */
  service: string;
}

export const CASE_NOTES: Record<string, CaseNote> = {
  sowcha: {
    who: "A women's fashion and lifestyle label",
    problem: "A label that makes its clothes with care needs a place online that feels the same way.",
    built: "A site that presents its collections, lookbook and journal beautifully on any device, and makes it easy to get in touch.",
    gives: ["Collections and a lookbook to browse", "The story behind the pieces", "A journal to come back to", "A direct way to ask what is available"],
    service: "E-commerce",
  },
  fooducia: {
    who: "Families who want fresher food",
    problem: "Vegetables can spend days on shelves before they reach a kitchen.",
    built: "A service where the order comes first: the produce is harvested after it and brought to the door.",
    gives: ["Fresh produce, harvested after the order", "Diet plans made for the customer", "Delivery to the door"],
    service: "App Development",
  },
  "helm-events": {
    who: "Event studios, planners and decorators",
    problem: "Event teams run on scattered spreadsheets, emails and tools that do not talk to each other.",
    built: "One place to run the whole event: tasks, vendors, clients, tickets and the numbers.",
    gives: ["Tasks that pass from managers to vendors and floor teams", "Vendors who update their own progress", "Registration and ticketing", "Revenue, costs and profit at a glance"],
    service: "Software & Product Development",
  },
  "clean-ai": {
    who: "Households and home service providers",
    problem: "It is hard to know what a cleaning or repair job will cost, and who can be trusted to do it.",
    built: "The customer takes a photo of the job. AI reads it, works out an itemised price and finds verified providers nearby.",
    gives: ["A photo instead of a long form", "A price broken down line by line", "The best matching verified providers nearby", "A separate area for customers, providers and staff"],
    service: "AI Development",
  },
};

/** What a visitor should understand from a project's status. */
export function projectState(p: { status?: string; liveUrl?: string }): string {
  if (p.status === "completed") return p.liveUrl ? "Live" : "Completed";
  if (p.status === "archived") return "Archived";
  return "In progress";
}

/** The studio's sample text, which must never reach a visitor. */
export const SAMPLE_TIMELINE = new Set(["v1.0 Launch", "v2.0 Overhaul", "Plugin System", "Enterprise Edition"]);
const SAMPLE_CAPTIONS = new Set(["Console pipeline monitoring analytics"]);
export const realCaption = (caption: string | undefined): string => (caption && !SAMPLE_CAPTIONS.has(caption.trim()) ? caption : "");

export const realText = (text: string | undefined): string => (text && !/will be updated here/i.test(text) ? text.trim() : "");

export const hostOf = (url: string): string => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "");
