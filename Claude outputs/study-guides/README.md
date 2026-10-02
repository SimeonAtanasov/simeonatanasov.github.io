# Study guides

Every study guide and print digest, each as a PDF (the reference for layout) and a
Markdown text version (for search, diffing and reading anywhere). Gathered here on
3 October 2026.

| Guide | PDF | Markdown | How the Markdown is made | Built by |
| --- | --- | --- | --- | --- |
| Study pack: Practical Privacy, Practical AI Act Advice, the nine assessment tools, the GDPR Readiness model (161 pages, 74 self-test questions) | `privacy-ai-act-assessments-study-pack-v2.pdf` | `privacy-ai-act-assessments-study-pack-v2.md` | pandoc from the HTML the PDF is printed from; `build.py` writes both | `../study-pack-build/` |
| GDPR enforcement study guide | `gdpr-enforcement-study-guide.pdf` | `gdpr-enforcement-study-guide.md` | the Markdown is the source; the PDF is printed from it | `../gdpr-enforcement-build/build_study_guide.py` |
| How the GDPR fine calculator works | none | `gdpr-fine-calculator-explained.md` | written as Markdown | by hand |
| AI Act Digest, 28 September 2026 (current) | `ai-act-digest-2026-09-28.pdf` | `ai-act-digest-2026-09-28.md` | converted from the PDF | `../ai-act-digest-build/build_aia_pdf.py` |
| EDPB Digest, 28 September 2026 (current) | `edpb-digest-2026-09-28.pdf` | `edpb-digest-2026-09-28.md` | converted from the PDF | `../edpb-digest-build/build_digest_pdf.py` |
| Cookie Compliance Digest, 19 September 2026 (current) | `cookie-compliance-digest-2026-09-19.pdf` | `cookie-compliance-digest-2026-09-19.md` | converted from the PDF | `../cookie-digest-build/build_cookie_pdf.py` |
| AI Act Digest, 19 September 2026 (superseded) | `../ai-act-digest-2026-09-19-v2.pdf` (could not be moved here: open in another application) | `ai-act-digest-2026-09-19-v2.md` | converted from the PDF | as above |
| EDPB Digest, 19 September 2026 (superseded) | `edpb-digest-2026-09-19.pdf` | `edpb-digest-2026-09-19.md` | converted from the PDF | as above |

## Converted from the PDF

`../study-pack-build/pdf_to_md.py <file.pdf>` writes the `.md` beside the PDF (needs
pymupdf4llm). It drops running heads, page numbers and soft line-break hyphens and turns
tables into Markdown tables. Checked on 3 October 2026: about 4.6 percent of the words in
the PDF text are not in the Markdown, and nearly all of those are the running heads and
the halves of rejoined hyphenated words. The PDF stays the reference. Rerun the converter
whenever a digest PDF is rebuilt.

## Keeping it current

The build scripts write their output to the sandbox; copy new PDFs here, then make the
Markdown (the study pack builder writes it for you). No em dashes in anything here.
