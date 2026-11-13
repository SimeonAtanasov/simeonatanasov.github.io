"""Page copy for Phase 5 (Canada). Usage: python3 pagecopy.py <src html> <number of review findings> <quebec read note>"""
import sys
p, n, qnote = sys.argv[1], sys.argv[2], sys.argv[3]
t = open(p, encoding="utf-8").read()
def R(old, new, cnt=1):
    global t
    assert t.count(old) == cnt, (t.count(old), old[:80])
    t = t.replace(old, new)
R("Brazil's LGPD, the California CCPA or the other US state privacy laws", "Brazil's LGPD, Canada's PIPEDA and provincial laws, the California CCPA or the other US state privacy laws", 4)
R("Brazil's General Data Protection Law (LGPD), the California Consumer Privacy Act and the consumer privacy laws of 22 other US states: tick the laws",
  "Brazil's General Data Protection Law (LGPD), Canada's PIPEDA with the Quebec, Alberta and British Columbia private-sector laws, the California Consumer Privacy Act and the consumer privacy laws of 22 other US states: tick the laws")
R("Article 17 of the ANPD's International Data Transfer Regulation; in California,",
  "Article 17 of the ANPD's International Data Transfer Regulation; in Canada, principle 4.8 of Schedule 1 to PIPEDA with the Privacy Commissioner's consent guidelines, section 8 of Quebec's private-sector Act, section 13 of Alberta's PIPA and section 10 of British Columbia's PIPA; in California,")
R("The privacy notice covers the EU GDPR, the UK GDPR, the Swiss FADP, Brazil's LGPD, the California CCPA and the consumer privacy laws of 22 other US states",
  "The privacy notice covers the EU GDPR, the UK GDPR, the Swiss FADP, Brazil's LGPD, Canada's PIPEDA with the Quebec, Alberta and British Columbia laws, the California CCPA and the consumer privacy laws of 22 other US states")
R("Canada and other jurisdictions have their own notice rules and are not covered yet.",
  "For Canada, Bill C-36, which would replace PIPEDA's privacy rules, was at second reading on 12 November 2026 and is not modelled, nor are the anti-spam law (CASL) and the provincial health information laws; " + qnote +
  " The generator writes in English, while Quebec's Charter of the French language calls for French. Other jurisdictions have their own notice rules and are not covered yet.")
R("""and the ECA Digital, Law 15,211/2025, Articles 7, 16, 22 and 26, named in the completeness check.</li>
""", """and the ECA Digital, Law 15,211/2025, Articles 7, 16, 22 and 26, named in the completeness check.</li>
										<li><a href="https://laws-lois.justice.gc.ca/eng/acts/P-8.6/" rel="noopener noreferrer" target="_blank">Canada's Personal Information Protection and Electronic Documents Act (PIPEDA)</a>, current to 19 October 2026, sections 4 to 11 and Schedule 1; the Privacy Commissioner's <a href="https://www.priv.gc.ca/en/privacy-topics/collecting-personal-information/consent/gl_omc_201805/" rel="noopener noreferrer" target="_blank">Guidelines for obtaining meaningful consent</a> and <a href="https://www.priv.gc.ca/en/privacy-topics/airports-and-borders/gl_dab_090127/" rel="noopener noreferrer" target="_blank">Guidelines for processing personal data across borders</a>; Quebec's <a href="https://www.legisquebec.gouv.qc.ca/en/document/cs/P-39.1" rel="noopener noreferrer" target="_blank">Act respecting the protection of personal information in the private sector</a>, as amended by Law 25, current to 15 October 2026, sections 1 to 34, 42, 43 and 81; <a href="https://kings-printer.alberta.ca/documents/Acts/P06P5.pdf" rel="noopener noreferrer" target="_blank">Alberta's Personal Information Protection Act</a>, current as of 1 September 2025; and <a href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/03063_01" rel="noopener noreferrer" target="_blank">British Columbia's Personal Information Protection Act</a>, current to 10 November 2026.</li>
""")
R("and all 20 findings of a fifth review of the Brazilian rules, were applied before publication.",
  "all 20 findings of a fifth review of the Brazilian rules, and all " + n + " findings of a sixth review of the Canadian rules, were applied before publication.")
assert chr(0x2014) not in t
open(p, "w", encoding="utf-8").write(t)
print("ok")
