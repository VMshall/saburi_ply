/**
 * FAQ library loader — the single source of truth for the 197 fact-checked FAQs.
 *
 * Content is authored in `Saburi_200_FAQs_CORRECTED.docx` and extracted (verbatim, entity-decoded)
 * into `content/faq-library.json`. Pages NEVER hand-copy answers — they read from here via the
 * placement map (`data/faq-placement.ts`) and transform (`lib/faqs.ts`). Regenerate the JSON from
 * the .docx if content changes. Build-time only (server components / SSG) — never ships to client.
 */
import raw from "@/content/faq-library.json";
import type { FaqLibraryEntry } from "@/data/types";

// JSON infers `section: string`; the library is validated on extraction, so narrow to our union.
export const allFaqs = raw.faqs as unknown as FaqLibraryEntry[];

const byNumber = new Map<number, FaqLibraryEntry>(allFaqs.map((f) => [f.number, f]));

/** Look up a FAQ by its library number (1–197). Throws if missing — a placement map typo should
 *  fail the build loudly rather than silently drop a Q&A. */
export function getFaqByNumber(n: number): FaqLibraryEntry {
  const f = byNumber.get(n);
  if (!f) throw new Error(`FAQ #${n} not found in content/faq-library.json`);
  return f;
}

export const technicalFaqs = allFaqs.filter((f) => f.section === "Technical");
