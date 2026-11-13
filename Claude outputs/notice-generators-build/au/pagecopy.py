"""Page copy for Phase 6f (Australia). Usage: python3 pagecopy.py <src html> <number of review findings>"""
import sys
p, n = sys.argv[1], sys.argv[2]
t = open(p, encoding="utf-8").read()
def R(old, new, cnt=1):
    global t
    assert t.count(old) == cnt, (t.count(old), old[:80])
    t = t.replace(old, new)
R("Singapore's PDPA, the California CCPA", "Singapore's PDPA, Australia's Privacy Act, the California CCPA", 5)
R("Singapore's Personal Data Protection Act 2012, the California Consumer",
  "Singapore's Personal Data Protection Act 2012, Australia's Privacy Act 1988, the California Consumer")
R("with the data protection officer's contact (section 11(5)); in California,",
  "with the data protection officer's contact (section 11(5)); in Australia, the APP privacy policy under APP 1.4, with the APP 5 matters and, for decisions from 10 December 2026, automated decisions (APP 1.7 to 1.9); in California,")
R("data portability is not in force. Other jurisdictions",
  "data portability is not in force. For Australia, the Privacy Act 1988 and the Australian Privacy Principles as in force on 13 November 2026 are modelled for organisations, not agencies; a short collection notice at each collection point (APP 5) and the Spam Act and Do Not Call rules are left to the checklist. Other jurisdictions")
R("(revised 29 April 2026).</li>",
  "(revised 29 April 2026).</li>\n"
  "\t\t\t\t\t\t\t\t\t\t<li>Australia's <a href=\"https://www.legislation.gov.au/C2004A03712/latest/text\" rel=\"noopener noreferrer\" target=\"_blank\">Privacy Act 1988</a> (Compilation No. 104, 4 June 2026, on the Federal Register of Legislation), with the Australian Privacy Principles in Schedule 1 and APP 1.7 to 1.9 from 10 December 2026, and the OAIC's <a href=\"https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines\" rel=\"noopener noreferrer\" target=\"_blank\">Australian Privacy Principles guidelines</a> (Chapter 1 updated 30 September 2026).</li>")
R("and all 26 findings of an eleventh review of the Singapore rules, were applied",
  "all 26 findings of an eleventh review of the Singapore rules, and all " + n + " findings of a twelfth review of the Australian rules, were applied")
assert chr(0x2014) not in t
open(p, "w", encoding="utf-8").write(t)
print("ok")
