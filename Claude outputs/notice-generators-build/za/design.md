# South Africa module: design (Phase 6g, 13 November 2026)

Mirrors the Australia module (build/au/au_body.js). Row prefix V (matrix Part V). REG_ORDER: ... "au", "za", "ca", "us".
Lead document: "<name> Privacy Notice" (s. 18 notification; the Regulator calls its own a "Privacy Notice").
Section for other leads: "Additional information under South Africa's POPIA", framed by processing (s. 3(1)(b)).

Per-purpose fields (acts repeater): zaBasis (consent|contract|law|dsli|public|li), zaBasisLaw (law), zaBasisWhat (dsli|public|li),
zaSpecial (none|consent|right|intl|research|public|specific|auth), zaSpecialWhat (kinds), zaSpecialSec (28..33, specific),
zaSpecialWhy (detail; required for 32 and auth), zaLaw (no|required|authorised: s. 18(1)(f)), zaLawName, zaMand (mandatory|voluntary,
direct collection), zaConseq (fallback consequence).
Transfers: zaAbroad yes/no; zaXrows {recipient, country, basis (law|bcr|agreement|consent|contract|contract3|benefit|own), lawName, protection}.
Further: zaFurther (compatible|consent|public|law|threat|research|exempt), zaFurtherLaw.
Section ZA_SECTION: zaScope (in|means), zaOffWhere, zaIo, zaIoEmail, zaIoPhone, zaIoReg, zaDio, zaNoRecip, zaKids, zaKidsBasis,
zaKidsHow, zaDm, zaDmElec (none|consent|customers|both), zaDmPost (yes/no: by post or in person), zaDmOut, zaAdm, zaAdmWhy
(contract_met|contract_measures|law), zaAdmLaw, zaAdmWhat, zaAdmLogic, zaSecurity, zaReqHow, zaFee, zaReqDays, zaComplaint,
zaCode, zaCodeName, zaPaia.
Location test zaWhere: fail closed like auWhere; strip ZA regions (af-south-1, africa-south1, South Africa North/West,
af-johannesburg-1, "Africa (Cape Town)"), ZA places, codes (ZA, ZAF, RSA, KZN), ambiguous codes (SA, GP, WC, EC, FS, LP, MP,
NW, NC) only with a ZA name, neutral (Africa, southern Africa, EMEA); four-digit postcode only next to a province or South
Africa; Newcastle and George left out (ambiguous).
Regulator contact printed (s. 18(1)(h)(v)): Information Regulator (South Africa), Woodmead North Office Park, 54 Maxwell
Drive, Woodmead, Johannesburg, 2191; P.O. Box 31533, Braamfontein, Johannesburg, 2017; complaints
POPIAComplaints@inforegulator.org.za; enquiries@inforegulator.org.za; 010 023 5200; toll free 0800 017 160;
inforegulator.org.za (eServices portal).
Wiring: generic() chained after the Australia lines in pn_block (EU/UK/CH/BR leads), can/in/cn/jp/kr modules and sg_body;
au_body lead edited by hand (ZA section after complaints, before California).
Tests: scen_za.py (BASE: Protea Learning (Pty) Ltd, Cape Town), ph_missing rule extended to ZA scenarios; regression
diff against /home/claude/ng-test-au with build/za/scen_all8.py (scen_all7 + AU 28 + AU review 28 = 351).
