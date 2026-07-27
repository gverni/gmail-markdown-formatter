# Gmail Markdown Formatter

[![Vercel Deployment](https://img.shields.io/github/deployments/gverni/gmail-markdown-formatter/production?label=vercel&logo=vercel&logoColor=white)](https://gmail-markdown-formatter.vercel.app/)

**Live demo:** [gmail-markdown-formatter.vercel.app](https://gmail-markdown-formatter.vercel.app/)

**Gmail does not support Markdown.** Compose is rich text, so if you paste raw Markdown you lose headings, lists, links, and emphasis.

That shows up a lot when your draft comes from an **agent or LLM** (or any tool that outputs Markdown). You still want to send from Gmail without reformatting by hand. This app converts Markdown to HTML in your browser, lets you preview it, and copies **rich HTML** so you can paste into Gmail compose with formatting intact.

Everything runs **entirely in the browser**. No backend, no email storage, no third-party analytics on your content.

Built with [Next.js](https://nextjs.org), [Remarkable](https://github.com/jonschlinkert/remarkable), and [isomorphic-dompurify](https://github.com/kkomelin/isomorphic-dompurify).

## Features

- Live markdown preview
- **Copy HTML for Gmail**: `text/html` plus plain-text fallback via the Clipboard API
- **Dark / light UI** follows your system `prefers-color-scheme`
- Blurple accent styling in the app chrome (preview pane stays white like Gmail)

## Privacy

- No API routes and no server actions for email body
- Your markdown never leaves the tab unless you copy it yourself

## Run your own local server

If you do not want to use a hosted deployment, clone the repository and run the app on your machine. Formatting still happens only in the browser; the dev server serves static assets and does not receive or store your email text.

```bash
git clone https://github.com/gverni/gmail-markdown-formatter.git
cd gmail-markdown-formatter
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production-like build locally:

```bash
npm run build
npm start
```

## Development

Same as above: `npm install` and `npm run dev`.

## Clipboard & Gmail tips

- Rich HTML copy requires a [secure context](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard) (HTTPS on Vercel, or `localhost` in dev).
- Some browsers (notably Safari) may not support `ClipboardItem` with `text/html`. If copy fails, try Chrome or paste from the preview manually.
- Gmail strips most class-based CSS; inline styles on `code`, `blockquote`, and `pre` are applied for better paste results. Lists and links use default HTML from Remarkable.
- Links in the preview open in a new tab with `rel="noopener noreferrer"` (and the same attributes are included in copied HTML when the browser allows it).

## Deploy on Vercel

Connect the repo and deploy with the default Next.js settings. No environment variables required.

## Manual check

1. Paste sample markdown: headings, **bold**, [links](https://example.com), lists, blockquotes, `` `code` ``, fenced blocks.
2. Click **Copy HTML for Gmail** and paste into Gmail compose.

## License

[MIT](LICENSE)
