/** Default markdown shown on first load; also used to populate the live preview. */
export const MARKDOWN_SAMPLE = `Replace this with your email body (or edit in place).

Gmail expects rich text, not Markdown. Paste output from an agent or LLM here, preview it, then copy HTML for Gmail.

# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text* and \`inline code\`.

[Link text](https://example.com) [0]

Unordered list (use * or - with a space after the marker):
* First bullet
* Second bullet

Ordered list:
1. First step
2. Second step

> Blockquote for callouts or quoted reply text.

Fenced code block:

\`\`\`
function hello() {
  return "world";
}
\`\`\`


---

\\[0\\]: https://example.com

`;

export const MARKDOWN_EMPTY_HINT = "Write markdown here...";
