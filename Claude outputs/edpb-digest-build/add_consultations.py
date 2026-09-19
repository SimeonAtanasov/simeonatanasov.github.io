# -*- coding: utf-8 -*-
"""Add the documents that were only at consultation stage on 19 September 2026 to the EDPB
digest, in a group of their own. They do not appear on the EDPB documents listing the digest
was built from. British spelling. No em dashes."""
import json

E = json.load(open("digest.json", encoding="utf-8"))
assert not any(e["type"] == "Consultation version" for e in E)
nid = max(e["id"] for e in E) + 1
C = "Consultation version"

NEW = [
 dict(title="Guidelines 02/2026 on anonymisation (version for public consultation)", date="08 July 2026",
      url="https://www.edpb.europa.eu/public-consultations/guidelines-022026-on-anonymisation_en", rating="R",
      where="Topic 17, Topic 13 and the AI Risk tool: when data stops being personal",
      takeaway="Data is anonymous only when it no longer relates to an identified or identifiable person for the entity holding it, judged by content, purpose and effect; the test has three limbs, none of which may be met: no singling out of a record, no linking of records about the same person, and no inference of an attribute. The guidelines, which fold in the Court of Justice's September 2025 ruling in EDPS v SRB, allow a contextual assessment (what the actual recipients and reasonably likely third parties can do) or a simplified one applied uniformly. Consultation runs to 30 October 2026; treat every 'anonymised' export, training set or statistic against the three limbs now, and keep the assessment on file, since this is the standard supervisory authorities will apply once the text is final."),
 dict(title="Guidelines 03/2026 on web scraping in the context of generative AI (version for public consultation)", date="08 July 2026",
      url="https://www.edpb.europa.eu/public-consultations/guidelines-032026-on-web-scraping-in-the-context-of-generative-ai_en", rating="R",
      where="Topic 13 and the AI Risk tool: training data sourced from the open web",
      takeaway="Scraping the web for personal data to train or ground a generative AI model is processing under the GDPR from the moment of collection, so the scraper needs a legal basis (in practice legitimate interests under the three-step test), purpose limitation and transparency, with the Article 14(5)(b) relief from individual notice only where informing people is impossible or disproportionate and public information is given instead. Controllers should scrape from reliable sources, respect machine-readable opt-outs, record timestamps and provenance, filter and validate data before training, and treat special category data as prohibited unless an Article 9(2) exception applies alongside the Article 6 basis. Consultation runs to 30 October 2026; read it with Opinion 28/2024 on AI models."),
 dict(title="Template for personal data breach notification (version for public consultation)", date="10 June 2026",
      url="https://www.edpb.europa.eu/public-consultations/template-for-personal-data-breach-notification_en", rating="R",
      where="Topic 16 and the Incident tool: the fields an Article 33 notification will ask for",
      takeaway="A common EU template for notifying personal data breaches to supervisory authorities under Article 33, built for implementation in each authority's online tool: conditional sections that appear only when relevant, predefined answer values and tooltips, covering the nature of the breach, categories and numbers of people and records, likely consequences, measures taken, timing and reasons for any delay, and cross-border elements. Consultation ran 10 June to 5 August 2026; the Board will decide the timetable for authorities to adopt it. Map the incident intake form to its fields now so a notification can be assembled from the record rather than rewritten under the 72-hour clock."),
 dict(title="Guidelines 1/2026 on processing of personal data for scientific research purposes (version for public consultation)", date="15 April 2026",
      url="https://www.edpb.europa.eu/public-consultations/guidelines-12026-on-processing-of-personal-data-for-scientific-research_en", rating="B",
      where="Topic 11 secondary use: the research route",
      takeaway="Six indicators decide whether an activity is scientific research (methodical approach, ethical standards, verifiability, independence, societal objective, scientific merit); commercial research qualifies if it is genuinely scientific. Any Article 6 basis can carry it, with broad consent allowed for defined research areas under extra safeguards, public interest where law provides for it, and legitimate interests weighted in research's favour; special categories need an Article 9(2) condition such as (j) with a legal basis in Union or national law. Further processing for research is presumed compatible under Article 5(1)(b) but still needs its own lawful basis, storage may be extended only for identified projects or a defined research area, and Article 89(1) safeguards (anonymise or pseudonymise where the purpose allows, ethics review, secure environments, DPIA) condition the derogations from erasure, objection and information duties. Adopted 15 April 2026 for consultation to 25 June 2026."),
 dict(title="Template for Data Protection Impact Assessment (version for public consultation)", date="14 April 2026",
      url="https://www.edpb.europa.eu/public-consultations/template-for-data-protection-impact-assessment_en", rating="R",
      where="The Full DPIA tool: the reporting format to align with",
      takeaway="A harmonised DPIA report template with predefined fields and an explainer, adopted 14 April 2026 for consultation to 9 June 2026, meant to structure and evidence the Article 35 assessment: description of the processing, necessity and proportionality, risks to individuals, measures, residual risk and consultation of the DPO and of data subjects. Use is not mandatory; after consultation each supervisory authority will adopt it either as its sole standard or as a meta-template that national formats must map to. Compare the site's DPIA tool field by field once the final version is published, and expect authorities to ask for reports in this shape."),
 dict(title="Recommendations 1/2026 on the Application for Approval and on the elements and principles to be found in Processor Binding Corporate Rules (Art. 47 GDPR) (version for public consultation)", date="15 January 2026",
      url="https://www.edpb.europa.eu/public-consultations/recommendations-12026-on-the-application-for-approval-and-on-the-elements-and_en", rating="B",
      where="Transfers: the processor counterpart of Recommendations 1/2022",
      takeaway="The application form, the elements and principles table and the background paper for processor binding corporate rules, replacing WP257 rev.01 and WP265: the same structure as Recommendations 1/2022 for controller BCRs, with the scope clarified (transfers from the processor to its own sub-processor members, not direct transfers from an external controller), full rather than summarised information to data subjects on their enforceable rights, a duty on importers to notify and, where grounds exist, challenge government access requests, and a reminder that approval does not assess supplementary measures, which each exporter still owes transfer by transfer. Adopted 15 January 2026 for consultation to 2 March 2026; groups with processor BCRs in progress should draft to the new table."),
 dict(title="Recommendations 2/2025 on the legal basis for requiring the creation of user accounts on e-commerce websites (version for public consultation)", date="03 December 2025",
      url="https://www.edpb.europa.eu/public-consultations/recommendations-22025-on-the-legal-basis-for-requiring-the-creation-of-user_en", rating="R",
      where="Topic 15 and the cookie digest: mandatory accounts at checkout",
      takeaway="Making a customer create an account before buying rarely passes the Article 6(1)(b) necessity test: a one-off purchase needs only the data to execute the sale, so the account is necessary only for genuine subscriptions with recurrent authenticated interactions or offers restricted to a verified closed group. Legitimate interests fail for fraud prevention, loyalty and order tracking because less intrusive means exist, and consent can only carry optional account benefits kept separate from checkout. Offering a guest checkout beside the account is the design that satisfies Article 25, and dormant account data must be deleted under storage limitation. Adopted 3 December 2025 for consultation to 12 February 2026; retailers should add a guest path now."),
 dict(title="Joint Guidelines of the EDPB and the European Commission on the interplay between the Digital Markets Act and the GDPR (version for public consultation)", date="09 October 2025",
      url="https://www.edpb.europa.eu/public-consultations/joint-guidelines-on-the-interplay-between-the-digital-markets-act-and-the_en", rating="N",
      where="",
      takeaway="Draft joint guidelines on how gatekeepers meet both the DMA and the GDPR when combining or cross-using personal data (Article 5(2) DMA), on data portability, app distribution and messaging interoperability. Gatekeepers only; the cookie digest carries the entry. Consultation 9 October to 4 December 2025.", tier="oneliner"),
 dict(title="Guidelines 3/2025 on the interplay between the Digital Services Act and the GDPR (version for public consultation)", date="11 September 2025",
      url="https://www.edpb.europa.eu/public-consultations/guidelines-32025-on-the-interplay-between-the-dsa-and-the-gdpr_en", rating="B",
      where="Topic 15 digital products: platforms and marketplaces",
      takeaway="The DSA's duties for intermediaries and platforms are performed under the GDPR, not outside it, and the DSA supplies no legal basis of its own: notice-and-action channels should let people report anonymously unless identification is needed, recommender systems on very large platforms must offer a non-profiling option under which no profile is built for future recommendations, targeted advertising may never use special category data and never target minors, and age assurance should avoid methods that identify users unambiguously such as government ID uploads. Supervisory authorities and Digital Services Coordinators cooperate on the overlap. Adopted for consultation 12 September to 31 October 2025; relevant to any marketplace, app or platform in scope of the DSA."),
 dict(title="Guidelines 01/2025 on pseudonymisation (version for public consultation)", date="16 January 2025",
      url="https://www.edpb.europa.eu/public-consultations/guidelines-012025-on-pseudonymisation_en", rating="R",
      where="Topic 11, Topic 16, the Incident tool and the transfer factor: what pseudonymisation buys",
      takeaway="Pseudonymised data stays personal data for everyone who could re-attribute it with the separately held additional information, so pseudonymisation is a safeguard, not an exit from the GDPR. It works within a defined pseudonymisation domain where the keys, lookup tables and original data are kept apart under technical and organisational measures, and within that domain it reduces the impact of a breach (Article 32), supports minimisation and confidentiality by design (Article 25), strengthens a legitimate interest balancing, and can serve as a supplementary measure for transfers where the additional information stays out of the third country's reach. Adopted 16 January 2025 for consultation to 14 March 2025; no final version had been published by September 2026."),
 dict(title="Guidelines 1/2024 on processing of personal data based on Article 6(1)(f) GDPR (version for public consultation)", date="08 October 2024",
      url="https://www.edpb.europa.eu/public-consultations/guidelines-12024-on-processing-of-personal-data-based-on-article-61f-gdpr_en", rating="R",
      where="Topic 10 and the Legitimate Interest Test: the three-step test the tool follows",
      takeaway="Legitimate interests carry processing only when three cumulative conditions are met: an interest that is lawful, clearly articulated and real and present rather than speculative; processing that is necessary, meaning the interest cannot reasonably be achieved just as effectively by less intrusive means; and a balancing in which the person's interests, the sensitivity of the data, the context, vulnerable groups, reasonable expectations (which do not depend only on what the privacy notice said) and mitigating measures beyond the legal minimum are weighed. After an objection the controller must show compelling legitimate grounds, a higher bar. Worked contexts cover fraud prevention, direct marketing, information security and children; public authorities cannot use the basis for their tasks. Adopted 8 October 2024 for consultation to 20 November 2024; no final version had been published by September 2026, and the March 2026 one-stop-shop case digest applies the same test."),
]
for d in NEW:
    e = {"id": nid, "title": d["title"], "type": C, "date": d["date"], "url": d["url"], "rating": d["rating"],
         "where": d["where"], "takeaway": d["takeaway"], "status": "consultation", "topics": [],
         "tier": d.get("tier", "written"), "source": "document"}
    assert "—" not in e["takeaway"]
    E.append(e); nid += 1
json.dump(E, open("digest.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(E), "entries")

s = open("build_digest_page.py", encoding="utf-8").read()
old = ' ("Recommendations", ["Recommendation"]),\n'
assert s.count(old) == 1
s = s.replace(old, old + ' ("Consultation versions", ["Consultation version"]),\n')
old2 = "Every document the European Data Protection Board has published, %d of them as of %s, with one takeaway each."
assert s.count(old2) == 1
s = s.replace(old2, "Every document the European Data Protection Board has published, %d of them as of %s (532 on the documents listing and 11 that were still at consultation stage), with one takeaway each.")
old3 = "Guidelines still at consultation stage appear on the EDPB consultations page and are listed here only once the documents listing carries a version.</p>"
assert s.count(old3) == 1
s = s.replace(old3, "Documents still at consultation stage on that date (guidelines, recommendations and templates adopted for public consultation but not yet final) sit in their own group, Consultation versions, dated by their adoption for consultation and marked consultation; the final text may differ.</p>")
open("build_digest_page.py", "w", encoding="utf-8", newline="\n").write(s)
p = open("build_digest_pdf.py", encoding="utf-8").read()
old4 = "Every document published by the European Data Protection Board, %d of them as of %s, with one takeaway each."
assert p.count(old4) == 1
p = p.replace(old4, "Every document published by the European Data Protection Board, %d of them as of %s (532 on the documents listing, 11 at consultation stage), with one takeaway each.")
open("build_digest_pdf.py", "w", encoding="utf-8", newline="\n").write(p)
print("builders patched")
