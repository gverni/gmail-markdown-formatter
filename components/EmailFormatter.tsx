"use client";

import { useCallback, useMemo, useState } from "react";
import {
  PREVIEW_CONTENT_ID,
  copyHtmlFromPreviewElement,
} from "@/lib/copyToClipboard";
import { renderMarkdownToEmailHtml } from "@/lib/markdownToEmailHtml";
import {
  MARKDOWN_EMPTY_HINT,
  MARKDOWN_SAMPLE,
} from "@/lib/markdownPlaceholder";
import { GITHUB_REPO_URL } from "@/lib/siteConfig";

type CopyStatus = "idle" | "success" | "error";

export default function EmailFormatter() {
  const [markdown, setMarkdown] = useState(MARKDOWN_SAMPLE);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const [copyMessage, setCopyMessage] = useState("");

  const renderedHtml = useMemo(
    () => renderMarkdownToEmailHtml(markdown),
    [markdown],
  );

  const showCopyFeedback = useCallback((success: boolean, message: string) => {
    setCopyStatus(success ? "success" : "error");
    setCopyMessage(message);
    window.setTimeout(() => {
      setCopyStatus("idle");
      setCopyMessage("");
    }, 4000);
  }, []);

  const handleCopyHtml = async () => {
    try {
      const previewElement = document.getElementById(PREVIEW_CONTENT_ID);
      await copyHtmlFromPreviewElement(previewElement);
      showCopyFeedback(true, "HTML copied. Paste into Gmail compose.");
    } catch (error) {
      console.error("Failed to copy HTML:", error);
      showCopyFeedback(
        false,
        "Copy failed. Use Chrome over HTTPS, or copy from the preview manually.",
      );
    }
  };

  const handleClear = () => {
    setMarkdown("");
    setCopyStatus("idle");
    setCopyMessage("");
  };

  const hasContent = markdown.trim().length > 0;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="border-b border-border pb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-blurple">
          Client-only
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
          Gmail markdown formatter
        </h1>
        <p className="mt-2 max-w-3xl text-muted">
          Gmail does not support Markdown. If your draft came from an agent or LLM
          (or any Markdown source), paste it here, preview the result, and copy
          rich HTML into Gmail compose instead of plain, unformatted text.
        </p>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          All formatting runs in your browser; nothing is sent to a server.
        </p>
        <p className="mt-4 max-w-3xl text-sm text-muted">
          Don&apos;t believe your email never leaves your browser?{" "}
          <a
            href={GITHUB_REPO_URL}
            className="font-medium text-blurple underline underline-offset-2 hover:text-blurple-hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            Run your own local server
          </a>
          .
        </p>
      </header>

      {copyStatus !== "idle" && (
        <p
          role="status"
          className={
            copyStatus === "success"
              ? "rounded-lg border border-blurple/30 bg-blurple/10 px-4 py-3 text-sm text-foreground"
              : "rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-foreground"
          }
        >
          {copyMessage}
        </p>
      )}

      <div className="grid flex-1 gap-3 lg:grid-cols-2 lg:gap-x-8">
        <section className="flex min-h-[320px] flex-col gap-3">
          <div className="flex min-h-10 items-center justify-start">
            <button
              type="button"
              onClick={handleClear}
              disabled={!hasContent}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>
          </div>
          <label
            htmlFor="markdown-input"
            className="text-sm font-medium text-foreground"
          >
            Markdown
          </label>
          <textarea
            id="markdown-input"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder={MARKDOWN_EMPTY_HINT}
            className="min-h-[400px] flex-1 resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground shadow-sm outline-none ring-blurple/0 transition-shadow placeholder:text-muted focus:border-blurple focus:ring-2 focus:ring-blurple/30"
            spellCheck={false}
          />
        </section>

        <section className="flex min-h-[320px] flex-col gap-3">
          <div className="flex min-h-10 items-center justify-end">
            <button
              type="button"
              onClick={handleCopyHtml}
              disabled={!hasContent}
              className="rounded-full bg-blurple px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blurple-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Copy HTML for Gmail
            </button>
          </div>
          <h2
            id="preview-label"
            className="m-0 text-sm font-medium text-foreground"
          >
            Preview
          </h2>
          <div
            className="min-h-[400px] flex-1 overflow-auto rounded-xl border border-border bg-email-preview p-6 text-[15px] leading-relaxed text-neutral-900 shadow-inner"
            id={PREVIEW_CONTENT_ID}
            role="region"
            aria-labelledby="preview-label"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </section>
      </div>
    </div>
  );
}
