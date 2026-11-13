"""Page copy for Phase 6e (Singapore). Usage: python3 pagecopy.py <src html> <number of review findings>"""
import sys
p, n = sys.argv[1], sys.argv[2]
t = open(p, encoding="utf-8").read()
def R(old, new, cnt=1):
    global t
    assert t.count(old) == cnt, (t.count(old), old[:80])
    t = t.replace(old, new)
R("South Korea's PIPA, the California CCPA", "South Korea's PIPA, Singapore's PDPA, the California CCPA", 5)
R("South Korea's Personal Information Protection Act, the California Consumer",
  "South Korea's Personal Information Protection Act, Singapore's Personal Data Protection Act 2012, the California Consumer")
R("in South Korea, the privacy policy under Article 30 of the PIPA and Article 31 of its Enforcement Decree; in California,",
  "in South Korea, the privacy policy under Article 30 of the PIPA and Article 31 of its Enforcement Decree; in Singapore, the notification of purposes under section 20 of the PDPA, with the data protection officer's contact (section 11(5)); in California,")
R("a policy for people in Korea is normally written in Korean. Other jurisdictions",
  "a policy for people in Korea is normally written in Korean. For Singapore, the PDPA and its 2021 Regulations as in force on 13 November 2026 are modelled; data breach notification and the Do Not Call rules are left to the checklist, and data portability is not in force. Other jurisdictions")
R("privacy portal</a>.</li>",
  "privacy portal</a>.</li>\n"
  "\t\t\t\t\t\t\t\t\t\t<li>Singapore's <a href=\"https://sso.agc.gov.sg/Act/PDPA2012\" rel=\"noopener noreferrer\" target=\"_blank\">Personal Data Protection Act 2012</a> and the <a href=\"https://sso.agc.gov.sg/SL/PDPA2012-S63-2021\" rel=\"noopener noreferrer\" target=\"_blank\">Personal Data Protection Regulations 2021</a> (current versions on Singapore Statutes Online, 13 November 2026), with the Personal Data Protection Commission's <a href=\"https://www.pdpc.gov.sg/organisations/regulations-decisions/regulatory-guidance/advisory-guidelines-on-key-concepts-in-the-personal-data-protection-act\" rel=\"noopener noreferrer\" target=\"_blank\">Advisory Guidelines on Key Concepts</a> (revised 29 April 2026).</li>")
R("Rules checked against these texts on 12 November 2026, then reviewed independently against them the same day:",
  "Rules checked against these texts on 12 and 13 November 2026, then reviewed independently against them:")
R("and all 30 findings of a tenth review of the Korean rules, were applied",
  "all 30 findings of a tenth review of the Korean rules, and all " + n + " findings of an eleventh review of the Singapore rules, were applied")
assert chr(0x2014) not in t
open(p, "w", encoding="utf-8").write(t)
print("ok")
