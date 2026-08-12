import { Remarkable } from "remarkable";
import { linkify } from "remarkable/linkify";
import DOMPurify from "isomorphic-dompurify";

const remarkableOptions = {
  html: true,
  linkTarget: "_blank",
} as const;

const sanitizeOptions = {
  ADD_ATTR: ["target", "rel"],
};

let markdownRenderer: Remarkable | null = null;
let linkRelHookRegistered = false;

function ensureBlankTargetLinkRelHook(): void {
  if (linkRelHookRegistered) {
    return;
  }

  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.nodeName === "A" && node.getAttribute("target") === "_blank") {
      node.setAttribute("rel", "noopener noreferrer");
    }
  });

  linkRelHookRegistered = true;
}

function getMarkdownRenderer(): Remarkable {
  if (!markdownRenderer) {
    markdownRenderer = new Remarkable("full", remarkableOptions).use(linkify);
  }
  return markdownRenderer;
}

/**
 * Applies inline styles so pasted HTML survives Gmail's CSS stripping.
 *
 * TODO: These regex replacements assume Remarkable emits bare tags (e.g. `<ul>`,
 * not `<ul class="...">`). If the renderer changes, prefer walking the DOM or
 * a dedicated HTML post-processor instead of string replace.
 */
export function applyCustomStyles(html: string): string {
  let styledHtml = html;

  styledHtml = styledHtml.replace(
    /<code>/g,
    '<code style="font-family: monospace; font-size: 13px; background-color: #f6f8fa; padding: 2px 4px; border-radius: 3px;">',
  );

  styledHtml = styledHtml.replace(
    /<blockquote>/g,
    '<blockquote style="border-left: 4px solid #ccc; margin: 20px 0; padding: 10px 20px; background-color: #f9f9f9; font-style: italic; font-family: sans-serif; font-size: 13px;">',
  );

  styledHtml = styledHtml.replace(
    /<pre>/g,
    '<pre style="background-color: #f6f8fa; border: 1px solid #d1d5da; border-radius: 6px; padding: 16px; overflow-x: auto; font-family: \'Courier New\', Consolas, monospace; font-size: 13px; line-height: 1.45;">',
  );

  styledHtml = styledHtml.replace(
    /<ul>/g,
    '<ul style="margin: 0.75em 0; padding-left: 1.5em; list-style-type: disc; list-style-position: outside;">',
  );

  styledHtml = styledHtml.replace(
    /<ol>/g,
    '<ol style="margin: 0.75em 0; padding-left: 1.5em; list-style-type: decimal; list-style-position: outside;">',
  );

  styledHtml = styledHtml.replace(
    /<li>/g,
    '<li style="margin: 0.25em 0; display: list-item;">',
  );

  styledHtml = styledHtml.replace(
    /<table>/g,
    '<table style="border-collapse: collapse; width: 100%; font-size: 13px;">',
  );

  styledHtml = styledHtml.replace(
    /<th>/g,
    '<th style="border: 1px solid #d1d5da; padding: 6px 12px; background-color: #f6f8fa; font-weight: 600; text-align: left;">',
  );

  styledHtml = styledHtml.replace(
    /<td>/g,
    '<td style="border: 1px solid #d1d5da; padding: 6px 12px;">',
  );

  return styledHtml;
}

export function renderMarkdownToEmailHtml(markdown: string): string {
  if (!markdown.trim()) {
    return "";
  }

  const md = getMarkdownRenderer();
  const html = md.render(markdown);
  const styledHtml = applyCustomStyles(html);

  ensureBlankTargetLinkRelHook();
  return DOMPurify.sanitize(styledHtml, sanitizeOptions);
}
