"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  ShieldCheck,
  ChevronRight,
  Printer,
  Copy,
  Check,
  FileText,
  Mail,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";

/**
 * Parses inline formatting such as **bold** text into clean HTML elements.
 */
function formatInlineText(text) {
  if (!text) return "";
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

/**
 * Parses raw text content into intro blocks, FAQ cards, and structured numbered sections.
 */
function parseContent(rawContent, pageTitle = "") {
  if (!rawContent) return { intro: [], sections: [], faqs: [] };

  const blocks = rawContent.split(/\n\s*\n/);
  const intro = [];
  const sections = [];
  const faqs = [];
  let currentSection = null;

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    if (/^[-*_]{3,}$/.test(trimmed)) continue;

    // Skip redundant document title or prompt artifacts
    const cleaned = trimmed.replace(/\*/g, "").trim().toLowerCase();
    if (pageTitle && cleaned === pageTitle.toLowerCase()) continue;
    if (/^here are the terms and conditions/i.test(trimmed)) continue;

    // Check for FAQ style Q: ...
    const qMatch = trimmed.match(/^(?:Q:|\*\*Q:?\*\*)\s*([^\n]+)(?:\s*\n*([\s\S]*))?/i);
    if (qMatch) {
      const question = qMatch[1].replace(/\*/g, "").trim();
      let answer = qMatch[2]?.trim() || "";
      answer = answer.replace(/^(?:A:|\*\*A:?\*\*)\s*/i, "").trim();
      faqs.push({ question, answer });
      continue;
    }

    // Check for bold or regular numbered section
    const boldNumbered = trimmed.match(/^\*\*(\d+)\.\s+([^*]+)\*\*(?:\s*\n*([\s\S]*))?$/);
    const plainNumbered = trimmed.match(/^(\d+)\.\s+([^\n]+)(?:\s*\n*([\s\S]*))?$/);
    const mdNumbered = trimmed.match(/^(#{1,3})\s+(?:(\d+)\.\s+)?([^\n]+)(?:\s*\n*([\s\S]*))?$/);

    const match = boldNumbered || plainNumbered;

    if (match) {
      const num = match[1];
      const title = match[2].trim();
      const body = match[3]?.trim() || "";

      currentSection = {
        id: `section-${num}`,
        num: String(num).padStart(2, "0"),
        title,
        paragraphs: body ? [body] : [],
      };
      sections.push(currentSection);
    } else if (mdNumbered) {
      const num = mdNumbered[2] || String(sections.length + 1);
      const title = mdNumbered[3].trim().replace(/\*/g, "");
      const body = mdNumbered[4]?.trim() || "";

      currentSection = {
        id: `section-${num}`,
        num: String(num).padStart(2, "0"),
        title,
        paragraphs: body ? [body] : [],
      };
      sections.push(currentSection);
    } else if (currentSection) {
      currentSection.paragraphs.push(trimmed);
    } else {
      intro.push(trimmed);
    }
  }

  return { intro, sections, faqs };
}

/**
 * Calculates estimated reading time.
 */
function estimateReadingTime(text) {
  if (!text) return "2 min read";
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

export default function LegalPageLayout({ page }) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'yes' | 'no' | null

  if (!page) {
    return (
      <div className="min-h-[50vh] py-16 flex items-center justify-center">
        <div className="mx-auto w-[80%] text-center">
          <h1 className="text-2xl font-semibold text-gray-900 font-poppins">Document Not Found</h1>
          <p className="mt-2 text-sm text-gray-500 font-inter">The requested document does not exist or has been moved.</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-pink-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-pink-600 transition font-inter"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const { intro, sections, faqs } = parseContent(page.content, page.title);
  const readTime = estimateReadingTime(page.content);

  const handleCopyLink = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      setCopied(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleScrollTo = (id) => {
    if (typeof document !== "undefined") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 sm:py-14 text-gray-900">
      <div className="mx-auto w-[80%] max-w-6xl">

        {/* 1. Top Breadcrumb & Share Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-gray-400 font-inter">
            <Link href="/" className="hover:text-pink-600 transition">
              Home
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <span className="text-gray-400">{page.category || "Legal"}</span>
            <ChevronRight size={12} className="text-gray-300" />
            <span className="text-gray-800 font-semibold">{page.title}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy page link"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition font-inter cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-500" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} className="text-gray-400" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              title="Print document"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition font-inter cursor-pointer"
            >
              <Printer size={13} className="text-gray-400" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* 2. Hero Header Card */}
        <header className="mb-10 text-left">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-200/80 bg-pink-50/80 px-3 py-1 text-xs font-semibold text-pink-700 font-poppins">
              <ShieldCheck size={14} className="text-pink-600" />
              Official Policy
            </span>

            {page.lastUpdated && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 font-inter">
                <Clock size={13} className="text-gray-400" />
                Updated: {page.lastUpdated}
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 font-inter">
              <FileText size={13} className="text-gray-400" />
              {readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 font-poppins mb-4">
            {page.title}
          </h1>

          {(page.summary || page.description) && (
            <p className="text-base sm:text-lg text-gray-600 font-inter leading-relaxed max-w-3xl font-normal">
              {page.summary || page.description}
            </p>
          )}
        </header>

        {/* 3. At a Glance Summary Card */}
        <div className="mb-10 rounded-2xl border border-gray-100 bg-gray-50/60 p-5 sm:p-6 text-left">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-pink-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900 font-poppins">
              Key Highlights at a Glance
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-gray-600 font-inter leading-relaxed">
            <div className="rounded-xl bg-white p-3.5 border border-gray-100 shadow-2xs">
              <span className="font-semibold text-gray-900 block mb-1 font-poppins">Clear & Transparent</span>
              Terms designed for creator confidence with no hidden surprises.
            </div>
            <div className="rounded-xl bg-white p-3.5 border border-gray-100 shadow-2xs">
              <span className="font-semibold text-gray-900 block mb-1 font-poppins">Your Rights Protected</span>
              You retain full rights and ownership over creative content you create.
            </div>
            <div className="rounded-xl bg-white p-3.5 border border-gray-100 shadow-2xs">
              <span className="font-semibold text-gray-900 block mb-1 font-poppins">Community Standards</span>
              Zero tolerance for malicious abuse, spam, or copyrighted theft.
            </div>
          </div>
        </div>

        {/* 4. Interactive Quick Jump Pill Navigation */}
        {sections.length > 1 && (
          <div className="mb-10 rounded-xl border border-gray-100 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-inter">
                Jump to Section
              </span>
              <span className="text-xs text-gray-400 font-inter">
                {sections.length} sections
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => handleScrollTo(sec.id)}
                  className="shrink-0 rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600 transition font-inter cursor-pointer"
                >
                  <span className="font-semibold text-pink-600 mr-1.5">{sec.num}</span>
                  <span>{sec.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. Document Introduction Paragraphs */}
        {intro.length > 0 && (
          <div className="mb-10 space-y-4 text-left">
            {intro.map((para, i) => (
              <p
                key={i}
                className="text-base sm:text-lg text-gray-700 font-inter leading-8 font-normal"
              >
                {formatInlineText(para)}
              </p>
            ))}
          </div>
        )}

        {/* 6. Document Numbered Sections */}
        {sections.length > 0 && (
          <div className="space-y-8 text-left">
            {sections.map((sec) => (
              <section
                key={sec.id}
                id={sec.id}
                className="scroll-mt-24 rounded-2xl border border-gray-100/80 bg-white p-6 sm:p-8 transition-colors hover:border-gray-200"
              >
                {/* Section Header */}
                <div className="flex items-start gap-3.5 mb-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-xs font-bold text-pink-600 font-poppins">
                    {sec.num}
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 font-poppins tracking-tight">
                      {sec.title}
                    </h2>
                  </div>
                </div>

                {/* Section Content */}
                <div className="space-y-4 pl-0 sm:pl-11">
                  {sec.paragraphs.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-[15px] sm:text-base text-gray-600 font-inter leading-7 whitespace-pre-line font-normal"
                    >
                      {formatInlineText(p)}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* 7. FAQs Section (if present) */}
        {faqs.length > 0 && (
          <div className="mt-12 space-y-4 text-left">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 font-poppins mb-4 flex items-center gap-2">
              <HelpCircle size={22} className="text-pink-500" />
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((faq, fIdx) => (
                <div
                  key={fIdx}
                  className="rounded-xl border border-gray-100 bg-gray-50/50 p-5 text-left"
                >
                  <h3 className="font-semibold text-gray-900 font-poppins text-sm sm:text-base mb-2">
                    {faq.question}
                  </h3>
                  {faq.answer && (
                    <p className="text-sm text-gray-600 font-inter leading-6 font-normal">
                      {formatInlineText(faq.answer)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. Interactive Feedback & Still Need Help Section */}
        <div className="mt-14 pt-8 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Feedback Box */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 text-left">
              <h3 className="text-sm font-semibold text-gray-900 font-poppins mb-1">
                Was this document helpful?
              </h3>
              <p className="text-xs text-gray-500 font-inter mb-4">
                Your feedback helps us keep our documentation clear and accurate.
              </p>

              {feedback ? (
                <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 font-inter">
                  <Check size={14} className="text-emerald-600" />
                  <span>Thank you for your feedback!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedback("yes")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 hover:border-pink-400 hover:text-pink-600 transition font-inter cursor-pointer"
                  >
                    <ThumbsUp size={14} />
                    <span>Yes, helpful</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedback("no")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900 transition font-inter cursor-pointer"
                  >
                    <ThumbsDown size={14} />
                    <span>Could be better</span>
                  </button>
                </div>
              )}
            </div>

            {/* Contact Support Box */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 text-left flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 font-poppins mb-1 flex items-center gap-2">
                  <Mail size={15} className="text-pink-500" />
                  Have additional questions?
                </h3>
                <p className="text-xs text-gray-500 font-inter leading-relaxed mb-4">
                  Our legal and compliance team is ready to answer specific inquiries.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="mailto:support@imagely.com"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-pink-500 px-4 py-2 text-xs font-semibold text-white hover:bg-pink-600 transition font-inter shadow-xs"
                >
                  <Mail size={13} />
                  <span>support@imagely.com</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition font-inter"
                >
                  <span>Contact Page</span>
                  <ExternalLink size={12} className="text-gray-400" />
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* 9. Related Policies Quick Links */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400 font-inter">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-gray-500">Related Documents:</span>
            <Link href="/terms" className="hover:text-pink-600 transition">Terms of Use</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-pink-600 transition">Privacy Policy</Link>
            <span>•</span>
            <Link href="/cookies" className="hover:text-pink-600 transition">Cookie Policy</Link>
            <span>•</span>
            <Link href="/copyright" className="hover:text-pink-600 transition">DMCA / Copyright</Link>
            <span>•</span>
            <Link href="/help" className="hover:text-pink-600 transition">Help Center</Link>
          </div>

          <Link
            href="/"
            className="font-medium text-pink-600 hover:text-pink-700 transition"
          >
            ← Return to Imagely Home
          </Link>
        </div>

      </div>
    </div>
  );
}
