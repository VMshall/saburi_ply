/**
 * FAQ transform — joins the library (data/faq-content) with the placement map (data/faq-placement)
 * to produce the `Faq[]` a guide page renders, and enforces the one-home-per-FAQ invariant.
 */
import type { Faq, GuidePage } from "@/data/types";
import { getFaqByNumber } from "@/data/faq-content";
import { GUIDE_PAGES, ABOUT_FAQS, PRODUCT_FAQS } from "@/data/faq-placement";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Answer rendering (FAQ_IMPLEMENTATION_PLAN.md §6): bold AEO "quick answer" lead followed by the
 * SEO detail paragraph. Output is fed to FaqAccordion via dangerouslySetInnerHTML, so both answers
 * are escaped first.
 */
export function buildAnswerHtml(entry: { aeoAnswer: string; seoAnswer: string }): string {
  return `<p><strong>${escapeHtml(entry.aeoAnswer)}</strong></p><p>${escapeHtml(entry.seoAnswer)}</p>`;
}

/** Resolve library FAQ numbers to rendered Faq[] (question + AEO-bold + SEO answerHtml). */
export function getFaqsByNumbers(nums: number[]): Faq[] {
  return nums.map((n) => {
    const e = getFaqByNumber(n);
    return { question: e.question, answerHtml: buildAnswerHtml(e) };
  });
}

/** The Faq[] for a guide page, in placement order. */
export function getFaqsForPage(page: GuidePage): Faq[] {
  return getFaqsByNumbers(page.faqNumbers);
}

/** The Company Faq[] homed on an /about route (empty when none placed there). */
export function getAboutFaqs(path: string): Faq[] {
  return getFaqsByNumbers(ABOUT_FAQS[path] ?? []);
}

/** Reconciled library Product Faq[] merged into a product page (empty when none placed). */
export function getProductFaqs(slug: string): Faq[] {
  return getFaqsByNumbers(PRODUCT_FAQS[slug] ?? []);
}

export function getGuidePage(slug: string): GuidePage | undefined {
  return GUIDE_PAGES.find((p) => p.slug === slug);
}

/** Child cluster GuidePages of the pillar (for the pillar's cluster-nav cards). */
export function getClusterPages(): GuidePage[] {
  return GUIDE_PAGES.filter((p) => p.kind === "cluster");
}

// Sections that have a published home: Technical → /plywood-guide, Purchase → /plywood-buying-guide,
// Company → /about pages, Product → existing product pages (partial — reconciled subset only).
const HUB_SECTIONS = new Set(["Technical", "Purchase", "Company", "Product"]);

// FAQ "families" that may share a page. Purchase + Product are both buyer product-recommendation
// content, so the library's Product use-case Qs can co-home on the Purchase which-plywood pages.
const familyOf = (section: string) =>
  section === "Purchase" || section === "Product" ? "buyer" : section;

/**
 * Build-time invariant across ALL placements (guide + /about pages): every placed FAQ exists,
 * belongs to a hub-backed section, is homed on exactly one page, and no page mixes content families
 * (a page is one of: buyer [Purchase+Product] / Technical / Company). Throws on violation.
 */
export function assertPlacementIntegrity(): void {
  const seen = new Map<number, string>();
  const check = (path: string, faqNumbers: number[]) => {
    let pageFamily: string | null = null;
    for (const n of faqNumbers) {
      const prev = seen.get(n);
      if (prev) {
        throw new Error(`FAQ #${n} is double-homed (${prev} and ${path}) — one home per FAQ`);
      }
      seen.set(n, path);
      const entry = getFaqByNumber(n); // throws if the number is missing from the library
      if (!HUB_SECTIONS.has(entry.section)) {
        throw new Error(`FAQ #${n} is section "${entry.section}" — no home for it yet`);
      }
      const fam = familyOf(entry.section);
      if (pageFamily && fam !== pageFamily) {
        throw new Error(`${path} mixes ${pageFamily} + ${fam} content — a page draws from one family`);
      }
      pageFamily = fam;
    }
  };
  for (const page of GUIDE_PAGES) check(page.path, page.faqNumbers);
  for (const [path, nums] of Object.entries(ABOUT_FAQS)) check(path, nums);
  for (const [slug, nums] of Object.entries(PRODUCT_FAQS)) check(`product:${slug}`, nums);
}

// Enforce once at module load — runs during SSG when a guide route imports this.
assertPlacementIntegrity();
