# Markdown Document Standards

- **Limitation**: do not use this standard for prompts markdown files and main repository `root/README.md`.
- Every Markdown doc starts with `# Title`, then `**Created**` and `**Updated**` dates (update the latter whenever the doc changes).
- Surround headings, lists, and fenced code blocks with blank lines; specify a language on fences (` ```bash `, ` ```text `, etc.).
- Use Markdown checkboxes (`- [ ]`, `- [x]`) instead of emoji for task/status lists.
- Whenever you mention another file or doc, use a relative Markdown link so it's clickable - [Document or File Name](ralative/direct link to document or file)
- Prefer small, single-purpose docs (<= ~500 lines). If a doc grows beyond that, split by topic or scope and link between them. For example:
  - System Overview (Refers to sub-guides)
    - User Guide
    - Developer Guide
    - Technical Reference
    - Best Practices
    - Troubleshooting
    - FAQ
- At "final draft" (or before committing), run `markdownlint` on the file and fix reported issues.