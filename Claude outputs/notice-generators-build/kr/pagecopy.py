"""Page copy for Phase 6d (South Korea). Usage: python3 pagecopy.py <src html> <number of review findings>"""
import sys
p, n = sys.argv[1], sys.argv[2]
t = open(p, encoding="utf-8").read()
def R(old, new, cnt=1):
    global t
    assert t.count(old) == cnt, (t.count(old), old[:80])
    t = t.replace(old, new)
R("Japan's APPI, the California CCPA", "Japan's APPI, South Korea's PIPA, the California CCPA", 5)
R("Japan's Act on the Protection of Personal Information, the California Consumer",
  "Japan's Act on the Protection of Personal Information, South Korea's Personal Information Protection Act, the California Consumer")
R("in Japan, Articles 21, 27, 28 and 32 of the APPI with Article 10 of its Enforcement Order; in California,",
  "in Japan, Articles 21, 27, 28 and 32 of the APPI with Article 10 of its Enforcement Order; in South Korea, the privacy policy under Article 30 of the PIPA and Article 31 of its Enforcement Decree; in California,")
R("and the generator writes English while people in Japan normally need Japanese. Other jurisdictions",
  "and the generator writes English while people in Japan normally need Japanese. For South Korea, the PIPA as in force since 11 September 2026 is modelled; its amendments on using personal information to develop AI (from 9 March 2027) and on mandatory certification (from 1 July 2027) are not, nor are the extra rules for public institutions, and a policy for people in Korea is normally written in Korean. Other jurisdictions")
R("and its <a href=\"https://www.ppc.go.jp/personalinfo/legal/r8kaiseihogohou\" rel=\"noopener noreferrer\" target=\"_blank\">page on the 2026 amendment</a>.</li>\n",
  "and its <a href=\"https://www.ppc.go.jp/personalinfo/legal/r8kaiseihogohou\" rel=\"noopener noreferrer\" target=\"_blank\">page on the 2026 amendment</a>.</li>\n"
  "\t\t\t\t\t\t\t\t\t\t<li>South Korea's <a href=\"https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=283839\" rel=\"noopener noreferrer\" target=\"_blank\">Personal Information Protection Act</a> (as in force on 11 September 2026, Act No. 21445) and its <a href=\"https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=291731\" rel=\"noopener noreferrer\" target=\"_blank\">Enforcement Decree</a> (as in force on 10 November 2026), read in Korean on the National Law Information Center; and the Personal Information Protection Commission's privacy policy drafting guidelines (April 2026), published on its <a href=\"https://www.privacy.go.kr\" rel=\"noopener noreferrer\" target=\"_blank\">privacy portal</a>.</li>\n")
R("and all 27 findings of a ninth review of the Japanese rules, were applied",
  "all 27 findings of a ninth review of the Japanese rules, and all " + n + " findings of a tenth review of the Korean rules, were applied")
assert chr(0x2014) not in t
open(p, "w", encoding="utf-8").write(t)
print("ok")
