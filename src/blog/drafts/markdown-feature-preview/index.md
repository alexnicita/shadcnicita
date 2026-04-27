---
title: "Markdown Feature Preview"
description: "A local-only draft for footnotes, quotes, and link previews."
---

Drafts are the right place to try richer article structure before publishing. A sentence can now carry a compact note without dragging the main line sideways.[^notes]

## Quotes

> A useful quote can take more than one line.
>
> It should keep the same quiet rhythm as the rest of the article, even when the passage is longer than a pull quote.

Regular paragraphs continue underneath the quote without any special wrapper or layout work.

## Link Preview

[React Markdown](https://github.com/remarkjs/react-markdown "The renderer now supports GitHub-flavored markdown, raw HTML compatibility, and custom presentation for standalone links.")

Inline links still render as normal text links, such as [the home page](/), so a link only becomes a preview when it stands alone in its own paragraph.

[^notes]: Footnotes use the standard `[^label]` marker and definition syntax, with an automatic return link.
