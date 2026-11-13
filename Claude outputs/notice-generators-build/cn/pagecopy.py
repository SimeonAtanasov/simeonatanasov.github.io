"""Page copy for Phase 6b (China). Usage: python3 pagecopy.py <src html> <number of review findings>"""
import sys
p, n = sys.argv[1], sys.argv[2]
t = open(p, encoding="utf-8").read()
def R(old, new, cnt=1):
    global t
    assert t.count(old) == cnt, (t.count(old), old[:80])
    t = t.replace(old, new)
R("India's DPDP Act, the California CCPA or the other US state privacy laws",
  "India's DPDP Act, China's PIPL, the California CCPA or the other US state privacy laws", 4)
R("India's Digital Personal Data Protection Act with its 2025 Rules, the California Consumer Privacy Act and the consumer privacy laws of 22 other US states: tick the laws",
  "India's Digital Personal Data Protection Act with its 2025 Rules, China's Personal Information Protection Law with the Network Data Security Management Regulations, the California Consumer Privacy Act and the consumer privacy laws of 22 other US states: tick the laws")
R("in India, section 5 of the DPDP Act with Rules 3, 9 and 14 of the DPDP Rules, 2025; in California,",
  "in India, section 5 of the DPDP Act with Rules 3, 9 and 14 of the DPDP Rules, 2025; in China, Articles 17, 23, 30 and 39 of the PIPL with Article 21 of the Network Data Security Management Regulations; in California,")
R("India's DPDP Act and Rules, the California CCPA and the consumer privacy laws of 22 other US states (18 in force, 4 from 2027 or 2028).",
  "India's DPDP Act and Rules, China's PIPL with the Network Data Security Management Regulations, the California CCPA and the consumer privacy laws of 22 other US states (18 in force, 4 from 2027 or 2028).")
R("so it asks you for one. Other jurisdictions have their own notice rules and are not covered yet.",
  "so it asks you for one. For China, only the Chinese text of the law is authentic and the generator writes English, so publish a Chinese version; it asks which transfer mechanism covers each overseas recipient but does not decide it, and it does not model State organs, critical information infrastructure operators or the recommended national standards. Other jurisdictions have their own notice rules and are not covered yet.")
R("""commencement under G.S.R. 843(E) of 13 November 2025.</li>
""", """commencement under G.S.R. 843(E) of 13 November 2025.</li>
										<li>China's <a href="https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm" rel="noopener noreferrer" target="_blank">Personal Information Protection Law</a> (in force 1 November 2021), all 74 articles; the <a href="https://www.cac.gov.cn/2024-09/30/c_1729384452307680.htm" rel="noopener noreferrer" target="_blank">Network Data Security Management Regulations</a> (State Council Decree No. 790, in force 1 January 2025), Articles 2, 21 to 28, 34 to 39 and 42; the <a href="https://www.cac.gov.cn/2019-08/23/c_1124913903.htm" rel="noopener noreferrer" target="_blank">Provisions on the Cyber Protection of Children's Personal Information</a> (CAC Order No. 4, 2019), Articles 2 and 8 to 10; the <a href="https://www.cac.gov.cn/2025-02/14/c_1741233507681519.htm" rel="noopener noreferrer" target="_blank">Measures for Personal Information Protection Compliance Audits</a> (CAC Order No. 18, in force 1 May 2025), Article 12; and the Cyberspace Administration's <a href="https://www.cac.gov.cn/2025-07/18/c_1754553420421538.htm" rel="noopener noreferrer" target="_blank">announcement of 18 July 2025</a> on reporting personal information protection officers; all read in Chinese on the Cyberspace Administration's site.</li>
""")
R("and all 22 findings of a seventh review of the Indian rules, were applied before publication.",
  "all 22 findings of a seventh review of the Indian rules, and all " + n + " findings of an eighth review of the Chinese rules, were applied before publication.")
assert chr(0x2014) not in t
open(p, "w", encoding="utf-8").write(t)
print("ok")
