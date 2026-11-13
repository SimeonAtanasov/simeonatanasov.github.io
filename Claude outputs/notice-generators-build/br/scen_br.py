SCEN_BR = {
 "pn_br_only": ("pn", {
    "audience": "visitor", "regimes": ["br"], "channel": ["web", "app"], "children": "No", "brKids": "No", "languages": "Portuguese, English",
    "ctrlName": "Loja Exemplo Ltda", "ctrlAddress": "Avenida Paulista 1000\nSao Paulo, SP 01310-100", "ctrlEmail": "privacidade@lojaexemplo-br.example", "ctrlPhone": "+55 11 0000 0000",
    "publicBody": "No", "brEstablished": "Yes", "brSmall": "No", "brEncKind": "person", "brEncName": "Ana Souza", "brEncContact": "encarregado@lojaexemplo-br.example",
    "joint": "No", "source": "direct",
    "acts": [
      {"purpose": "Delivering your orders", "data": "Name, address, CPF, order details", "brBasis": "V", "retention": "5 years after the order, as tax law requires", "required": "contract", "consequence": "We cannot deliver your order"},
      {"purpose": "Issuing invoices", "data": "Name, CPF, order value", "brBasis": "II", "brLawRef": "the federal and state tax rules on electronic invoices", "retention": "5 years", "required": "statutory", "consequence": "We cannot sell to you"},
      {"purpose": "Sending you our newsletter", "data": "Name, email", "brBasis": "I", "retention": "Until you withdraw consent", "required": "optional", "consequence": "You do not receive the newsletter"},
      {"purpose": "Checking orders for fraud", "data": "Order history, device data, payment details", "brBasis": "IX", "brLi": "Protecting us and our customers from payment fraud, a risk we see in card-not-present sales", "retention": "2 years", "required": "contractual", "consequence": "We cannot accept your payment"},
      {"purpose": "Logging you in with your face", "data": "Facial geometry", "brSens": "I", "retention": "Until you switch it off", "required": "optional", "consequence": "You log in with your password instead"}
    ],
    "inferred": "Yes", "inferredWhat": "A fraud risk score from your order and device data", "consequences": "We score every order for fraud before we accept it.",
    "brForm": "Through our website and app forms, stored in our cloud systems, with every order checked automatically for fraud",
    "recipients": [{"who": "Pagamentos Seguros S.A.", "role": "processor", "why": "Payment processing", "where": "Brazil"},
                   {"who": "Cloud Hosting Inc.", "role": "processor", "why": "Hosting our website and app", "where": "United States"},
                   {"who": "Mail Services Ltd", "role": "processor", "why": "Sending the newsletter", "where": "Ireland"}],
    "brTransfers": "Yes",
    "brTrows": [{"country": "United States", "recipient": "Cloud Hosting Inc.", "mech": "scc", "form": "Account and order data, stored on servers there for as long as we keep it, to host our website and app"},
                {"country": "Ireland", "recipient": "Mail Services Ltd", "mech": "adequacy"}],
    "brSecurity": "Encryption in transit and at rest, access limited to named staff, yearly audits",
    "adm": "Yes", "admWhat": "Whether we accept your order", "admLogic": "We compare the order with known fraud patterns and your device data", "admEffect": "A flagged order is cancelled and refunded",
    "rightsContact": "privacidade@lojaexemplo-br.example or our app's privacy menu", "withdrawHow": "Use the unsubscribe link in each newsletter or switch off face login in the app",
    "version": "1.0", "effective": "2026-12-01", "further": "No"
 }),
 "pn_br_small": ("pn", {
    "audience": "visitor", "regimes": ["br"], "channel": ["app"], "children": "Yes", "brKids": "Yes", "brKidsHow": "A parent confirms by email before the account is activated, and we check the email belongs to an adult account",
    "languages": "English",
    "ctrlName": "Example Apps Lda", "ctrlAddress": "Rua Augusta 1\nLisbon, Portugal", "ctrlEmail": "privacy@exampleapps-pt.example",
    "publicBody": "No", "brEstablished": "No", "ctrlCountry": "Portugal", "brSmall": "Yes", "brHighRisk": "No", "brEnc": "No", "brChannel": "privacy@exampleapps-pt.example",
    "joint": "No", "source": "both",
    "sources": [{"name": "App store", "what": "Purchase confirmations", "usedFor": "0", "pub": "No"}], "unattributable": "No",
    "acts": [
      {"purpose": "Running your game account", "data": "Nickname, progress, purchases", "brBasis": "V", "retention": "Until the account is deleted, then 6 months", "required": "contract", "consequence": "You cannot play"},
      {"purpose": "Showing you news about new levels", "data": "Nickname, play time", "brBasis": "I", "retention": "Until you withdraw consent", "required": "optional"}
    ],
    "inferred": "No",
    "recipients": [{"who": "Game Cloud GmbH", "role": "processor", "why": "Hosting", "where": "Germany"}],
    "brTransfers": "No",
    "adm": "No", "profiling": "No",
    "rightsContact": "privacy@exampleapps-pt.example", "withdrawHow": "Switch off news in the app settings",
    "version": "1.0", "effective": "2026-12-01", "further": "Yes", "furtherWhat": "Improving level design", "furtherStart": "2027-03-01", "furtherData": "Play time per level",
    "brFurtherBasis": "IX", "brFurtherLi": "Designing better levels for our players, which they expect from a game they play", "furtherRetention": "12 months", "furtherCompatBr": "It uses data we already collect to run the game, for a closely related purpose you can expect"
 }),
 "pn_br_empty": ("pn", {"regimes": ["br"]}),
 "pn_eu_br": ("pn", {
    "audience": "client", "regimes": ["eu", "br"], "channel": ["web"], "children": "No", "brKids": "No", "languages": "English, Portuguese",
    "ctrlName": "Example Advisory B.V.", "ctrlAddress": "Herengracht 1\nAmsterdam", "ctrlEmail": "privacy@example.nl", "ctrlPhone": "+31 20 000 0000",
    "publicBody": "No", "euEstablished": "Yes", "brEstablished": "No", "ctrlCountry": "the Netherlands", "brSmall": "No", "brEncKind": "entity", "brEncName": "DPO Servicos Ltda", "brEncResp": "Carlos Lima", "brEncContact": "encarregado@dposervicos-br.example",
    "dpo": "Yes", "dpoContact": "dpo@example.nl", "joint": "Yes", "jointWho": "Partner Consultoria Ltda", "jointEssence": "We run joint client events; Partner Consultoria handles registration and we handle follow-up.", "jointContact": "privacy@example.nl",
    "source": "direct",
    "acts": [
      {"purpose": "Managing our contract with your employer", "data": "Name, business email, phone", "basis": "b", "brBasis": "V", "retention": "6 years after the contract ends", "required": "contract", "consequence": "We cannot work with you"},
      {"purpose": "Inviting you to our client events", "data": "Name, business email, dietary needs", "basis": "f", "li": "Keeping our client relationships", "brBasis": "IX", "brLi": "Keeping in touch with the clients we already serve, which they expect", "brSens": "I",
       "art9": "a", "retention": "Until you object", "required": "optional", "consequence": "You do not receive invitations", "jointP": "Yes"}
    ],
    "marketing": "No", "inferred": "No",
    "recipients": [{"who": "Cloud Mail Inc.", "role": "processor", "why": "Email", "where": "United States"}, {"who": "Partner Consultoria Ltda", "role": "joint", "why": "Joint client events", "where": "Brazil"}],
    "transfers": "Yes", "trows": [{"country": "United States", "recipient": "Cloud Mail Inc.", "mech": "adequacy", "adeqScope": "Organisations certified under the EU-US Data Privacy Framework"}],
    "brTransfers": "Yes", "brTrows": [{"country": "the Netherlands", "recipient": "Example Advisory B.V.", "mech": "adequacy"},
                                      {"country": "United States", "recipient": "Cloud Mail Inc.", "mech": "adequacy"}],
    "adm": "No", "profiling": "No", "brAdm": "No",
    "rightsContact": "privacy@example.nl", "withdrawHow": "Email privacy@example.nl", "saName": "Autoriteit Persoonsgegevens",
    "restriction": "No", "version": "1.0", "effective": "2026-12-01", "further": "No"
 }),
 "pn_ch_br": ("pn", {
    "audience": "applicant", "regimes": ["ch", "br"], "channel": ["web"], "children": "No", "brKids": "No", "languages": "German, Portuguese",
    "ctrlName": "Beispiel AG", "ctrlAddress": "Bahnhofstrasse 1\n8001 Zurich", "ctrlEmail": "datenschutz@beispiel-ch.example",
    "publicBody": "No", "chEstablished": "Yes", "brEstablished": "No", "ctrlCountry": "Switzerland", "brSmall": "Yes", "brHighRisk": "No", "brEnc": "Yes", "brEncKind": "person", "brEncName": "Maria Silva", "brEncContact": "maria.silva@beispiel-ch.example",
    "dpo": "No", "joint": "No", "source": "direct",
    "acts": [{"purpose": "Assessing your application", "data": "CV, interview notes", "chGround": "contract", "brBasis": "V", "retention": "6 months after the recruitment closes", "required": "contract", "consequence": "We cannot consider your application"}],
    "inferred": "No",
    "recipients": [{"who": "HR Cloud GmbH", "role": "processor", "why": "Applicant tracking system", "where": "Germany"}],
    "chAbroad": "Yes", "chTrows": [{"country": "Germany", "recipient": "HR Cloud GmbH", "mech": "adequacy"}],
    "brTransfers": "Yes", "brTrows": [{"country": "Germany", "recipient": "HR Cloud GmbH", "mech": "scc", "form": "Your application, stored there until 6 months after the recruitment closes, to run the applicant tracking system"},
                                      {"country": "Switzerland", "recipient": "Beispiel AG", "mech": "scc", "form": "Your application, for the recruitment"}],
    "brSecurity": "Encryption and role-based access",
    "adm": "Yes", "admWhat": "Whether your application goes to interview", "admLogic": "We match the CV against the required qualifications", "admEffect": "Without a match you are not invited",
    "chAdmExc": "none", "brAdm": "Yes",
    "rightsContact": "datenschutz@beispiel-ch.example", "restrictionCh": "No", "version": "1.0", "effective": "2026-12-01", "further": "No"
 }),
 "pn_br_ca_us": ("pn", {
    "audience": "visitor", "regimes": ["br", "ca", "us"], "channel": ["web"], "children": "No", "brKids": "No", "languages": "Portuguese",
    "ctrlName": "Exemplo Digital S.A.", "ctrlEmail": "privacidade@exemplo-br.example", "publicBody": "Yes",
    "brEstablished": "Yes", "brSmall": "No", "brEncKind": "person", "brEncName": "Joao Pereira", "brEncContact": "encarregado@exemplo-br.example",
    "joint": "No", "source": "direct",
    "acts": [{"purpose": "Providing our public service portal", "data": "Name, CPF, requests", "brBasis": "III", "retention": "10 years", "required": "statutory", "consequence": "We cannot process your request"}],
    "inferred": "No", "recipients": [], "brTransfers": "No", "adm": "No", "profiling": "No",
    "caCats": [{"cat": "A", "examples": "Name, email", "sources": "You", "purposes": "Providing the portal", "retention": "10 years", "sold": "No", "shared": "No", "past12": "No", "sp": "No"}],
    "caMethods": ["email", "phone"], "caEmailReq": "privacidade@exemplo-br.example", "caPhone": "1-800-555-0100", "caVerify": "We match your email", "caAgent": "Email us with a signed authorisation",
    "usStates": ["CO"], "usCats": [{"cat": "Identifiers", "sold": "No", "ta": "No", "prof": "No"}],
    "rightsContact": "privacidade@exemplo-br.example", "version": "1.0", "effective": "2026-12-01", "further": "No"
 })
}
