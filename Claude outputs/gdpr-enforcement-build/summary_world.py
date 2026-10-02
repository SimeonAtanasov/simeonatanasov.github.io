# -*- coding: utf-8 -*-
"""Hand-written comparison fields for the worldwide page: first court, route of a penalty, tile
position. The three map values come from each jurisdiction's verified JSON (`map`), except where
OVERRIDE says otherwise with a reason. Keep this in step with gdata/."""

ORDER = ["us", "ca", "mx", "co", "br", "ar",
         "tr", "il", "sa", "ae",
         "ng", "ke", "za",
         "in", "cn", "kr", "jp", "th", "vn", "ph", "sg", "id", "au"]

REGIONS = ["Americas", "Middle East", "Africa", "Asia-Pacific"]

MODELS = {
    "regulator": ("Regulator penalises by its own decision", "#4f8fd6", "#ffffff"),
    "regulator-court": ("Regulator must go to court for a penalty", "#b07cd8", "#ffffff"),
    "court": ("Penalties only through courts or prosecutors", "#d95926", "#ffffff"),
    "none-yet": ("No body can penalise yet", "#c9a227", "#10172e"),
}
PUBLIC = {  # the maximum penalty
    "turnover": ("Linked to turnover or revenue", "#199e70", "#ffffff"),
    "fixed": ("Fixed amount, often per violation", "#4f8fd6", "#ffffff"),
    "none": ("No monetary penalty in force yet", "#c9a227", "#10172e"),
    "unclear": ("Not confirmed", "#5c6684", "#ffffff"),
}
SUSP = {  # private damages action
    "yes": ("Yes, individuals can sue for damages", "#199e70", "#ffffff"),
    "limited": ("Only in narrow cases", "#c9a227", "#10172e"),
    "no": ("No", "#d95926", "#ffffff"),
}

OVERRIDE = {
    # The 5% of turnover ceiling under Amendment 13 rests on one consultancy source and the
    # verifier could not confirm it; show it as not confirmed rather than guess.
    "il": {"cap": "unclear"},
}

FIRST = {
    "us": "Federal or state court (FTC and AG cases); California court review of CPPA fines",
    "ca": "Federal Court (fresh hearing, s.14); Court of Quebec for CAI penalties",
    "mx": "Federal district judges (amparo)",
    "co": "Contentious-administrative courts",
    "br": "ANPD Board, then the federal courts",
    "ar": "Federal contentious-administrative courts (not confirmed)",
    "tr": "Administrative courts (since June 2024)",
    "il": "Magistrates' Court (reported)",
    "sa": "Board of Grievances (administrative courts)",
    "ae": "DIFC Courts or ADGM Courts (free zones)",
    "ng": "Federal High Court",
    "ke": "High Court (s.64)",
    "za": "High Court (s.97)",
    "in": "TDSAT (from 2027)",
    "cn": "Administrative reconsideration or the people's courts",
    "kr": "Seoul Administrative Court",
    "jp": "District court (challenge to a PPC order)",
    "th": "Administrative Court (not confirmed)",
    "vn": "People's Court",
    "ph": "Court of Appeals",
    "sg": "Data Protection Appeal Panel, then the High Court",
    "id": "State Administrative Court (planned); criminal courts now",
    "au": "Federal Court sets the penalty",
}

ROUTE = {
    "us": ["FTC, state AG or CPPA", "Consent order, court action or CPPA fine", "Federal or state courts"],
    "ca": ["OPC investigation and report", "Federal Court (s.14)", "Federal Court of Appeal", "Supreme Court (leave)"],
    "mx": ["Secretariat (SABG) decision", "Amparo before federal judges", "Collegiate circuit courts"],
    "co": ["SIC decision", "Internal appeals", "Administrative courts", "Council of State"],
    "br": ["ANPD decision", "ANPD Board", "Federal courts", "STJ or STF"],
    "ar": ["AAIP decision", "Federal administrative courts", "Supreme Court"],
    "tr": ["KVKK Board decision", "Administrative court", "Regional administrative court", "Council of State"],
    "il": ["PPA financial sanction", "Magistrates' Court (reported)"],
    "sa": ["SDAIA violations committee", "Board of Grievances"],
    "ae": ["DIFC or ADGM Commissioner fine", "DIFC or ADGM Courts"],
    "ng": ["NDPC order", "Federal High Court", "Court of Appeal"],
    "ke": ["ODPC penalty notice", "High Court", "Court of Appeal"],
    "za": ["Information Regulator notice", "High Court", "Supreme Court of Appeal"],
    "in": ["Data Protection Board (from May 2027)", "TDSAT", "Supreme Court"],
    "cn": ["CAC or other department", "Reconsideration or people's court", "Higher people's court"],
    "kr": ["PIPC surcharge", "Seoul Administrative Court", "Seoul High Court", "Supreme Court"],
    "jp": ["PPC guidance, recommendation, order", "Breach of an order: prosecution", "Criminal court"],
    "th": ["PDPC expert committee", "Administrative Court", "Supreme Administrative Court"],
    "vn": ["Ministry of Public Security (A05)", "Complaint or People's Court"],
    "ph": ["NPC decision", "Motion for reconsideration", "Court of Appeals", "Supreme Court"],
    "sg": ["PDPC direction", "Reconsideration or Appeal Panel", "High Court", "Court of Appeal"],
    "id": ["Komdigi now, PDP agency planned", "Objection, then State Administrative Court"],
    "au": ["OAIC investigation", "Federal Court civil penalty", "Full Federal Court", "High Court (special leave)"],
}

GRID = {"ca": (1, 0), "us": (1, 1), "mx": (1, 2), "co": (2, 3), "br": (3, 4), "ar": (2, 5),
        "tr": (5, 0), "il": (5, 1), "sa": (6, 1), "ae": (7, 1),
        "ng": (5, 3), "ke": (6, 3), "za": (6, 5),
        "in": (8, 1), "cn": (9, 0), "kr": (10, 0), "jp": (11, 0),
        "th": (9, 2), "vn": (10, 2), "ph": (11, 2), "sg": (9, 3), "id": (10, 3), "au": (11, 5)}

# The European page, reached from a tile on the world map
EXTRA_TILES = [("EU", "gdpr-enforcement.html", 4, 0, "Europe: see GDPR enforcement in Europe")]
