"""Page copy for Phase 6a (India). Usage: python3 pagecopy.py <src html> <number of review findings>"""
import sys
p, n = sys.argv[1], sys.argv[2]
t = open(p, encoding="utf-8").read()
def R(old, new, cnt=1):
    global t
    assert t.count(old) == cnt, (t.count(old), old[:80])
    t = t.replace(old, new)
R("Canada's PIPEDA and provincial laws, the California CCPA or the other US state privacy laws",
  "Canada's PIPEDA and provincial laws, India's DPDP Act, the California CCPA or the other US state privacy laws", 4)
R("Canada's PIPEDA with the Quebec, Alberta and British Columbia private-sector laws, the California Consumer Privacy Act and the consumer privacy laws of 22 other US states: tick the laws",
  "Canada's PIPEDA with the Quebec, Alberta and British Columbia private-sector laws, India's Digital Personal Data Protection Act with its 2025 Rules, the California Consumer Privacy Act and the consumer privacy laws of 22 other US states: tick the laws")
R("section 13 of Alberta's PIPA and section 10 of British Columbia's PIPA; in California,",
  "section 13 of Alberta's PIPA and section 10 of British Columbia's PIPA; in India, section 5 of the DPDP Act with Rules 3, 9 and 14 of the DPDP Rules, 2025; in California,")
R("Canada's PIPEDA with the Quebec, Alberta and British Columbia laws, the California CCPA and the consumer privacy laws of 22 other US states (18 in force, 4 from 2027 or 2028).",
  "Canada's PIPEDA with the Quebec, Alberta and British Columbia laws, India's DPDP Act and Rules, the California CCPA and the consumer privacy laws of 22 other US states (18 in force, 4 from 2027 or 2028).")
R("The generator writes in English, while Quebec's Charter of the French language calls for French. Other jurisdictions have their own notice rules and are not covered yet.",
  "The generator writes in English, while Quebec's Charter of the French language calls for French. For India, the notice duty applies from 13 May 2027; the Act lets people read the notice in English or any of the 22 languages of the Eighth Schedule to the Constitution, and the generator writes English only; the Data Protection Board had published no complaint link the generator could cite, so it asks you for one. Other jurisdictions have their own notice rules and are not covered yet.")
R("""current to 10 November 2026.</li>
""", """current to 10 November 2026.</li>
										<li>India's <a href="https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf" rel="noopener noreferrer" target="_blank">Digital Personal Data Protection Act, 2023</a>, sections 2 to 17, and the <a href="https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf" rel="noopener noreferrer" target="_blank">Digital Personal Data Protection Rules, 2025</a> (G.S.R. 846(E), with the corrigenda of 10 December 2025), Rules 1 to 23 and the First, Third, Fourth and Seventh Schedules, both as published in the Gazette of India on MeitY's site; commencement under G.S.R. 843(E) of 13 November 2025.</li>
""")
R("and all 19 findings of a sixth review of the Canadian rules, were applied before publication.",
  "all 19 findings of a sixth review of the Canadian rules, and all " + n + " findings of a seventh review of the Indian rules, were applied before publication.")
assert chr(0x2014) not in t
open(p, "w", encoding="utf-8").write(t)
print("ok")
