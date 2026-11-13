"""Page copy for Phase 6c (Japan). Usage: python3 pagecopy.py <src html> <number of review findings>"""
import sys
p, n = sys.argv[1], sys.argv[2]
t = open(p, encoding="utf-8").read()
def R(old, new, cnt=1):
    global t
    assert t.count(old) == cnt, (t.count(old), old[:80])
    t = t.replace(old, new)
R("India's DPDP Act, China's PIPL, the California CCPA", "India's DPDP Act, China's PIPL, Japan's APPI, the California CCPA", 4)
R("China's Personal Information Protection Law with the Network Data Security Management Regulations, the California Consumer",
  "China's Personal Information Protection Law with the Network Data Security Management Regulations, Japan's Act on the Protection of Personal Information, the California Consumer")
R("with Article 21 of the Network Data Security Management Regulations; in California,",
  "with Article 21 of the Network Data Security Management Regulations; in Japan, Articles 21, 27, 28 and 32 of the APPI with Article 10 of its Enforcement Order; in California,")
R("China's PIPL with the Network Data Security Management Regulations, the California CCPA and",
  "China's PIPL with the Network Data Security Management Regulations, Japan's APPI, the California CCPA and")
R("national standards. Other jurisdictions",
  "national standards. For Japan, the APPI as in force is modelled; its 2026 amendment (children under 16, facial feature data, statistics and AI development) takes effect on a date still to be set and is not, and the generator writes English while people in Japan normally need Japanese. Other jurisdictions")
R("on reporting personal information protection officers; all read in Chinese on the Cyberspace Administration's site.</li>\n",
  "on reporting personal information protection officers; all read in Chinese on the Cyberspace Administration's site.</li>\n"
  "\t\t\t\t\t\t\t\t\t\t<li>Japan's <a href=\"https://laws.e-gov.go.jp/law/415AC0000000057\" rel=\"noopener noreferrer\" target=\"_blank\">Act on the Protection of Personal Information</a> (Act No. 57 of 2003, as in force on 2 November 2026), its <a href=\"https://laws.e-gov.go.jp/law/415CO0000000507\" rel=\"noopener noreferrer\" target=\"_blank\">Enforcement Order</a> and <a href=\"https://laws.e-gov.go.jp/law/428M60020000003\" rel=\"noopener noreferrer\" target=\"_blank\">Enforcement Rules</a>, read in Japanese on e-Gov; the Personal Information Protection Commission's notice designating countries with equivalent protection (No. 1 of 2019) and its <a href=\"https://www.ppc.go.jp/personalinfo/legal/guidelines_tsusoku/\" rel=\"noopener noreferrer\" target=\"_blank\">general guidelines</a>; and its <a href=\"https://www.ppc.go.jp/personalinfo/legal/r8kaiseihogohou\" rel=\"noopener noreferrer\" target=\"_blank\">page on the 2026 amendment</a>.</li>\n")
R("and all 30 findings of an eighth review of the Chinese rules, were applied",
  "all 30 findings of an eighth review of the Chinese rules, and all " + n + " findings of a ninth review of the Japanese rules, were applied")
assert chr(0x2014) not in t
open(p, "w", encoding="utf-8").write(t)
print("ok")
