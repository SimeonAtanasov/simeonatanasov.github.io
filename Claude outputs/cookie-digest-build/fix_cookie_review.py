# -*- coding: utf-8 -*-
"""Apply the accepted findings of the 19 September 2026 review to the cookie digest data
(cookie_digest.json). British spelling, matching the digest. No em dashes."""
import json

C = json.load(open("all_merged.json", encoding="utf-8"))
n = 0
def sub(i, old, new):
    global n
    e = C[i]
    assert e["takeaway"].count(old) == 1, (i, old[:50])
    e["takeaway"] = e["takeaway"].replace(old, new)
    n += 1

# F13 wording for guidance
sub(0, "They bind every operator addressing users in France,", "They apply to every operator addressing users in France,")
sub(67, "They bind all controllers relying on consent,", "They set the standard the authorities apply to every controller relying on consent,")
sub(69, "Binds supervisory authorities and, through them, every operator.", "Adopted under Article 64(2), it states the reading the supervisory authorities apply to every operator.")
sub(72, "They bind social media providers and every advertiser or publisher that installs their tags.", "They set the standard applied to social media providers and to every advertiser or publisher that installs their tags.")
# F20 GDPR scope
sub(63, "Applies from 25 May 2018 to every controller processing EU residents' data;", "Applies from 25 May 2018 to processing in the context of an EU establishment and, under Article 3(2), to controllers elsewhere that offer goods or services to people in the Union or monitor their behaviour there (residence or citizenship alone is not the test);")
# F21 CNIL pixels
sub(19, "with exemptions limited to measuring deliverability of transactional messages such as order confirmations, password resets and security alerts, and to cases where the recipient has already consented to the communications. Senders must clearly inform recipients about pixels and offer a simple way to object. A three-month transition applies to addresses collected before publication, after which the CNIL has announced inspections.",
    "with one exemption: measuring the individual deliverability of emails tied to a service the recipient asked for, which covers transactional messages such as order confirmations, password resets and security alerts and messages the recipient consented to receive; consent to receive marketing does not exempt any other tracking purpose. Senders must clearly inform recipients about pixels and offer a simple way to object. For addresses collected before publication, senders had three months to inform recipients and give them an easy objection route.")
# F22 ICO children
sub(182, "with additional expectations where services are likely to be accessed by children under 13.", "with additional expectations where services are likely to be accessed by children under 18 (the Children's code applies, with profiling off by default) and parental consent where consent is sought from children under 13.")
# F23 Amazon Turkey allocation
sub(197, "TRY 1,100,000 for failing to take the required technical and organisational measures and TRY 100,000 for processing without explicit consent.", "TRY 1,100,000 under Article 12 for failing to take the technical and organisational measures that would have prevented processing without explicit consent, and TRY 100,000 under Article 10 for failing to inform users about the cookies.")
# F24 California amounts
sub(198, "section 1798.155 sets fines of up to $2,500 per violation and $7,500 for intentional violations or those involving minors.", "section 1798.155 sets fines of up to $2,500 per violation and $7,500 for intentional violations or those involving the data of consumers known to be under 16, amounts the California Privacy Protection Agency adjusts for inflation ($2,663 and $7,988 from 1 January 2025).")
# F25 Oregon
sub(228, "It binds controllers doing business in Oregon that process data of 100,000 or more consumers, or 25,000 with revenue from sales. Treat Oregon as a signal-mandatory state from 1 January 2026 and answer Department inquiries within the stated cure window.",
    "It binds controllers doing business in Oregon that process data of 100,000 or more consumers, or 25,000 or more where more than 25 per cent of annual gross revenue comes from selling personal data; motor vehicle manufacturers are covered with no threshold. The notice-and-cure period ended on 1 January 2026, so treat Oregon as a signal-mandatory state with no cure right and answer Department inquiries as enforcement, not as a warning.")
# F26 Mexico transfers
sub(136, "and requires express consent for sensitive and financial data and for transfers.", "requires express consent for sensitive and financial data (written for sensitive data), and subjects transfers to third parties to the consent form that applies to the data concerned, with the statutory exceptions for group companies, legal requirements and contracts in the person's interest.")
# F27 Nigeria
sub(139, "penalties of up to NGN 10 million or 2 percent of annual gross revenue for controllers of major importance.", "penalties of up to the greater of NGN 10 million and 2 per cent of annual gross revenue for controllers of major importance (NGN 2 million or 2 per cent for others).")
# F28 Consent Mode mapping
sub(156, "a CMP that maps its advertising category to all four parameters satisfies it.", "a CMP satisfies it by mapping its analytics category to analytics_storage and its advertising category to ad_storage, ad_user_data and ad_personalization, provided valid consent is collected where the law requires it and the tags actually respect the signals; the cookieless pings of advanced mode are a platform feature, not a legal exemption.")
# F29 Safari
sub(163, "Measurement built on first-party cookies in Safari loses users after a week regardless of the consent state recorded.", "Measurement that relies on script-written first-party storage in Safari loses returning users after seven days of Safari use without interaction, whatever consent was recorded; cookies set by the server in an HTTP response are not capped unless they arrive through CNAME or IP-address cloaking.")
# F31 work programme
sub(77, "The work programme adopted on 12 February 2026 lists guidelines on consent or pay among the guidance the Board will deliver in the 2026-2027 cycle, extending the reasoning of Opinion 08/2024 beyond large online platforms.", "The work programme adopted on 11 February 2026 (published 12 February) lists guidelines on consent or pay among the guidance the Board will deliver in the 2026-2027 cycle; the programme states no scope, but the expectation is that they extend the reasoning of Opinion 08/2024 beyond large online platforms.")
# F32 Digital Omnibus joint opinion
sub(74, "The joint opinion supports moving terminal equipment rules into the GDPR and a regulatory answer to consent fatigue, welcoming", "The joint opinion supports a regulatory answer to consent fatigue but warns that moving the terminal equipment rules for personal data into the GDPR while non-personal data stays under the ePrivacy Directive splits one rule across two instruments, creates legal uncertainty and must not lower protection; it welcomes")
# F39 pledge causation
sub(75, "Practitioners meet it as the reason the pledge stalled and as an early statement", "Practitioners meet it as one of the reasons the pledge is understood to have stalled and as an early statement")
# F40 DMA date and fines
sub(65, "The obligation binds designated gatekeepers from 6 March 2024, with fines up to 10 per cent of worldwide turnover.", "The obligation binds each designated gatekeeper six months after its designation, which for the first six gatekeepers meant 6 March 2024, with fines up to 10 per cent of worldwide turnover and 20 per cent for repeat infringements.")

for e in C:
    assert "—" not in e["takeaway"]
json.dump(C, open("all_merged.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("edits", n)

# P1: cover stats on the PDF omit the proposals
import sys; sys.exit(0)
s = open("build_cookie_pdf.py", encoding="utf-8").read()
old = """<div><span class="n">%d</span><span class="l">standards</span></div></div>'"""
new = """<div><span class="n">%d</span><span class="l">standards</span></div><div><span class="n">%d</span><span class="l">proposals</span></div></div>'"""
assert s.count(old) == 1
s = s.replace(old, new)
old2 = """c["legislation"], c["regulator guidance"], c["court decision"], c["enforcement"], c["standard"]))"""
new2 = """c["legislation"], c["regulator guidance"], c["court decision"], c["enforcement"], c["standard"], c["proposal"]))"""
assert s.count(old2) == 1
s = s.replace(old2, new2)
open("build_cookie_pdf.py", "w", encoding="utf-8", newline="\n").write(s)
print("cover stats updated")
