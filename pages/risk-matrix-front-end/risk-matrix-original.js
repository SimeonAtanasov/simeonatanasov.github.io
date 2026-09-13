// Catalog of Privacy, AI, LLM/GenAI, and Operational risks. The Privacy/AI/
// Operational entries are drawn from real practitioner guidance (genericized
// so nothing here is tied to a specific employer); the LLM entries are drawn
// from the EDPB Support Pool of Experts report "AI Privacy Risks &
// Mitigations - Large Language Models (LLMs)" (Barberá, 2025), a public GDPR-
// mapped source, phrased generically here in the same style as the rest of
// the catalog. Picking one prefills the risk/mitigation text and a suggested
// Likelihood/Impact below - everything stays editable afterward, and
// "Custom" skips this entirely.
const RISK_CATALOG = {
  Privacy: [
    { label: "Invalid or bundled consent", text: "Consent is collected through pre-ticked boxes, vague language, or bundled with an unrelated purpose or terms & conditions", mitigation: "Redesign consent flows so each purpose is opted into separately, remove pre-ticked boxes, and make withdrawing consent as easy as giving it.", likelihood: "Likely", impact: "Medium" },
    { label: "Non-compliant cookie banner", text: "A cookie or tracking banner allows non-essential cookies to load before consent, or doesn't give \"Reject All\" the same visual weight as \"Accept All\"", mitigation: "Block non-essential cookies by default until the user actively consents, and present \"Reject All\" on equal footing with \"Accept All\".", likelihood: "Likely", impact: "Medium" },
    { label: "Data kept past its retention period", text: "Personal data is kept past its retention period because no deletion trigger or schedule was ever applied", mitigation: "Apply a retention label or schedule to each data category at creation, with deletion triggered automatically once it expires.", likelihood: "Likely", impact: "High" },
    { label: "Data reused for an unrelated purpose", text: "Personal data collected for one purpose is reused for an unrelated purpose without a fresh legal basis or consent", mitigation: "Check the original purpose and legal basis before any new use; obtain fresh consent or document a compatibility assessment when the new purpose isn't compatible.", likelihood: "Possible", impact: "High" },
    { label: "Obsolete website left active", text: "An obsolete or unused website or microsite is left active instead of being deactivated or secured", mitigation: "Maintain an inventory of live web properties and deactivate or secure any that are no longer in active use.", likelihood: "Unlikely", impact: "Medium" },
    { label: "Monitoring without a proportionality check", text: "Employee monitoring or location-tracking tools are deployed without a proportionality check, notice, or consent", mitigation: "Assess proportionality before deploying monitoring or tracking tools, disable non-essential tracking by default, and notify those being monitored.", likelihood: "Possible", impact: "High" },
    { label: "Third-party access without a DPA", text: "A third party is given access to personal data without a signed data processing agreement in place", mitigation: "Make an executed data processing agreement a condition of any third party gaining access to personal data.", likelihood: "Possible", impact: "High" }
  ],
  AI: [
    { label: "AI tool deployed without prior review", text: "An AI or analytics tool is put into use without a privacy, ethics, and compliance review first", mitigation: "Require a privacy, ethics, and compliance review before any AI or analytics tool is implemented, not after.", likelihood: "Possible", impact: "Critical" },
    { label: "Confidential data in an unapproved AI tool", text: "Personal or confidential data is entered into an unapproved generative-AI tool", mitigation: "Restrict use to approved generative-AI tools and train staff not to paste personal or confidential data into any of them.", likelihood: "Likely", impact: "High" },
    { label: "Automated decision with no human oversight", text: "An automated or algorithmic decision that significantly affects individuals has no human-in-the-loop or override mechanism", mitigation: "Build a human-in-the-loop checkpoint and an opt-out/review path into any automated decision with a significant effect on people.", likelihood: "Possible", impact: "Critical" },
    { label: "Outputs not monitored for bias", text: "An AI or automated decision-making system's outputs aren't monitored for bias or discriminatory impact", mitigation: "Test model outputs for discriminatory impact across affected groups on a regular schedule, not just before launch.", likelihood: "Possible", impact: "High" },
    { label: "Decision logic not explainable", text: "An AI system's decision logic isn't explainable to the people it affects", mitigation: "Document and be able to explain, in plain language, the main factors behind each automated output.", likelihood: "Likely", impact: "Medium" },
    { label: "Datasets combined without a lawful purpose", text: "Datasets are combined for analytics or AI without a lawful purpose, increasing re-identification risk", mitigation: "Confirm a lawful purpose and assess re-identification risk before combining datasets for analytics or AI.", likelihood: "Possible", impact: "High" },
    { label: "AI content published without review", text: "AI-generated content is used or published without human review or verification", mitigation: "Verify and edit AI-generated content before it's relied on or published, especially for anything consequential.", likelihood: "Likely", impact: "Medium" }
  ],
  LLM: [
    { label: "Inadequate protection of personal data", text: "Sensitive user input, or the data used and produced during training and inference, isn't adequately protected (weak encryption, access control, or anonymization), creating a risk of unauthorized access or a data breach", mitigation: "Encrypt data in transit and at rest, enforce strong access control and authentication, apply anonymization or pseudonymization where feasible, and run regular security audits across the input, processing, and output stages.", likelihood: "Possible", impact: "High" },
    { label: "Training data wrongly treated as anonymous", text: "Training data is treated as anonymous when it can still, directly or by means reasonably likely to be used, be linked back to identifiable individuals", mitigation: "Test the model against state-of-the-art re-identification, membership-inference, and model-inversion attacks before relying on an anonymization claim, and document the assessment.", likelihood: "Possible", impact: "High" },
    { label: "No legal basis for training data", text: "Personal data is included in training datasets without a valid legal basis, adequate transparency, or (where relied on) valid consent", mitigation: "Document the legal basis for each training dataset, exclude unlawfully sourced or unnecessary personal data, and provide accessible information to data subjects about how their data may be used in training.", likelihood: "Possible", impact: "High" },
    { label: "Special category data in training data", text: "Special category data (health, criminal record, biometric, etc.) is present in training data without meeting a recognized exception for processing it", mitigation: "Screen and filter training sources for special category data before use, and rely only on a documented, narrow exception where such data can't be excluded entirely.", likelihood: "Unlikely", impact: "Critical" },
    { label: "Inaccurate or biased model output", text: "The model produces inaccurate, misleading, or biased output that is then treated as reliable, negatively affecting the people it concerns", mitigation: "Disclose the probabilistic, non-factual nature of outputs to users, monitor for bias and inaccuracy on an ongoing basis, and use diverse, representative training and fine-tuning data.", likelihood: "Likely", impact: "Medium" },
    { label: "No human intervention in significant decisions", text: "An LLM-driven process makes a decision with a legal or similarly significant effect on someone without meaningful human review or an escalation path", mitigation: "Require human review before any high-risk automated output is acted on, define clear escalation procedures, and inform people about the automated processing and their right to contest it.", likelihood: "Possible", impact: "Critical" },
    { label: "Data subject rights can't be fulfilled", text: "A data subject's request to access, correct, delete, or object to the use of their data can't be fulfilled because it can't be located or removed from the model or its training data", mitigation: "Offer an opt-out before training data collection where feasible, evaluate machine-unlearning or targeted retraining for deletion requests, and provide a working process to handle rights requests tied to the model.", likelihood: "Possible", impact: "High" },
    { label: "Unlawful repurposing of personal data", text: "Personal data collected for one purpose (e.g. improving a specific feature) is reused for a broader or unrelated purpose (e.g. general model development) without checking compatibility", mitigation: "Define narrow, specific purposes for personal data use rather than broad catch-alls, and run a compatibility assessment or seek a fresh legal basis before reusing data for a new purpose.", likelihood: "Possible", impact: "Medium" },
    { label: "Unlimited retention of input and output data", text: "Input and output data, including logged queries, is retained longer than necessary because no retention period or deletion mechanism is defined", mitigation: "Agree retention periods with the provider as part of the contract or DPA, and set up deletion rules or automated purging for any locally stored input/output data.", likelihood: "Likely", impact: "Medium" },
    { label: "Unlawful international data transfer", text: "Input or training data is processed or stored in a country without an adequate level of protection, without appropriate safeguards in place", mitigation: "Verify where the provider actually processes data, put appropriate transfer safeguards in place, and run a transfer impact assessment where needed before selecting or using a vendor.", likelihood: "Possible", impact: "High" },
    { label: "Breach of data minimization", text: "More personal data is collected or processed for training or fine-tuning than is strictly necessary for the model's purpose", mitigation: "Apply privacy by design from the start, exclude unnecessary personal data at collection, and evaluate whether synthetic or anonymized data could meet the same need with less exposure.", likelihood: "Possible", impact: "Medium" }
  ],
  Operational: [
    { label: "Incident not reported promptly", text: "A suspected privacy or security incident isn't reported promptly because staff aren't sure it qualifies", mitigation: "Train staff to report anything unusual immediately without waiting to confirm it themselves, and make the reporting channel obvious.", likelihood: "Likely", impact: "High" },
    { label: "Breach notification deadline missed", text: "A personal data breach misses its legal notification deadline because the severity assessment takes too long", mitigation: "Build the severity assessment and notification decision into a timed workflow so the legal deadline (e.g., 72 hours under GDPR) can't be missed silently.", likelihood: "Unlikely", impact: "Critical" },
    { label: "Insecure disposal of data or devices", text: "Devices or documents containing personal data are disposed of without secure destruction", mitigation: "Use approved secure-destruction bins or certified disposal vendors for any document or device that held personal data.", likelihood: "Unlikely", impact: "High" },
    { label: "Rights request not tracked centrally", text: "A data subject rights request isn't logged or tracked centrally, so it misses its statutory response deadline", mitigation: "Log every rights request in a central tracker with its statutory deadline and automatic reminders.", likelihood: "Possible", impact: "High" },
    { label: "Requester identity not verified", text: "A rights requester's identity isn't verified before personal data is disclosed, risking disclosure to the wrong person", mitigation: "Verify the requester's identity before any personal data is compiled or disclosed in response to a rights request.", likelihood: "Unlikely", impact: "Critical" },
    { label: "Go-live before privacy review completed", text: "A new system, tool, or process touching personal data goes live before its privacy review is completed", mitigation: "Gate the go-live decision on a completed privacy review; treat \"we'll assess it later\" as a blocker, not an option.", likelihood: "Possible", impact: "High" },
    { label: "Scope change without a review refresh", text: "A project's scope changes after its privacy review, but the review is never revisited", mitigation: "Require sign-off that the privacy review still reflects reality whenever a project's scope, data, or technology changes.", likelihood: "Possible", impact: "Medium" }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("#risk-matrix textarea");
  const saveButton = document.getElementById("save-data");
  const loadButton = document.getElementById("load-data");
  const clearButton = document.getElementById("clear-data");
  const exportButton = document.getElementById("export-excel");
  const addRiskButton = document.getElementById("add-risk");
  const newRiskInput = document.getElementById("new-risk");
  const newLikelihoodSelect = document.getElementById("new-likelihood");
  const newImpactSelect = document.getElementById("new-impact");
  const newCategorySelect = document.getElementById("new-category");
  const newPredefinedRiskSelect = document.getElementById("new-predefined-risk");
  const riskNotes = document.getElementById("risk-notes");

  let riskCounter = 1;
  const risksList = [];

  // Populate the predefined-risk dropdown for whichever category is chosen.
  function populatePredefinedRisks(category) {
    newPredefinedRiskSelect.innerHTML = "";

    if (!category) {
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Select a category first...";
      newPredefinedRiskSelect.appendChild(placeholder);
      newPredefinedRiskSelect.disabled = true;
      return;
    }

    newPredefinedRiskSelect.disabled = false;

    const customOption = document.createElement("option");
    customOption.value = "";
    customOption.textContent = category === "Custom" ? "Type your own risk below" : "Custom risk in this category...";
    newPredefinedRiskSelect.appendChild(customOption);

    // Native <select> options can't wrap, so the dropdown shows a short label
    // and the full wording goes into the risk textarea below (and a tooltip).
    (RISK_CATALOG[category] || []).forEach((risk, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = risk.label || risk.text;
      option.title = risk.text;
      newPredefinedRiskSelect.appendChild(option);
    });
  }

  // Grow a textarea to fit its content so long risk/mitigation text stays visible.
  // scrollHeight excludes the border, so under box-sizing: border-box the border
  // has to be added back or the last line ends up clipped by a couple of pixels.
  function autoGrow(el) {
    if (!el) return;
    el.style.height = "auto";
    const styles = window.getComputedStyle(el);
    const border = styles.boxSizing === "border-box"
      ? (parseFloat(styles.borderTopWidth) || 0) + (parseFloat(styles.borderBottomWidth) || 0)
      : 0;
    el.style.height = (el.scrollHeight + border) + "px";
  }

  const newMitigationInput = document.getElementById("new-mitigation");

  // Keep both fields sized to their content as the user types.
  [newRiskInput, newMitigationInput].forEach(field => {
    if (field) field.addEventListener("input", () => autoGrow(field));
  });

  // A narrower column wraps the same text onto more lines, so heights worked out
  // at one viewport width go stale at another. Re-fit every textarea on resize
  // (and on phone rotation), debounced so it doesn't run on every resize event.
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document
        .querySelectorAll("#new-risk, #new-mitigation, #risk-notes textarea")
        .forEach(autoGrow);
    }, 100);
  });

  newCategorySelect.addEventListener("change", () => {
    const category = newCategorySelect.value;
    populatePredefinedRisks(category);
    newRiskInput.value = "";
    newMitigationInput.value = "";
    autoGrow(newRiskInput);
    autoGrow(newMitigationInput);
    if (category === "Custom") {
      newRiskInput.focus();
    }
  });

  newPredefinedRiskSelect.addEventListener("change", () => {
    const category = newCategorySelect.value;
    const index = newPredefinedRiskSelect.value;

    if (index === "" || !RISK_CATALOG[category]) {
      newRiskInput.value = "";
      newMitigationInput.value = "";
      autoGrow(newRiskInput);
      autoGrow(newMitigationInput);
      newRiskInput.focus();
      return;
    }

    const predefined = RISK_CATALOG[category][index];
    newRiskInput.value = predefined.text;
    newMitigationInput.value = predefined.mitigation;
    newLikelihoodSelect.value = predefined.likelihood;
    newImpactSelect.value = predefined.impact;
    autoGrow(newRiskInput);
    autoGrow(newMitigationInput);
  });

  populatePredefinedRisks("");

  // Save data to localStorage
  saveButton.addEventListener("click", () => {
    const risksWithNotes = risksList.map(risk => ({
      number: risk.number,
      text: risk.text,
      likelihood: risk.likelihood,
      impact: risk.impact,
      mitigation: risk.mitigation,
      category: risk.category
    }));
    const matrixValues = Array.from(inputs).map(input => input.value);
    localStorage.setItem(
      "riskMatrix",
      JSON.stringify({ matrix: matrixValues, notes: risksWithNotes })
    );
    alert("Risks saved!");
  });

  // Load data from localStorage
  loadButton.addEventListener("click", () => {
    const savedData = JSON.parse(localStorage.getItem("riskMatrix"));
    if (savedData) {
      const { matrix, notes } = savedData;
  
      // Restore matrix
      inputs.forEach((input, index) => {
        input.value = matrix[index] || "";
      });
  
      // Clear and repopulate notes
      riskNotes.innerHTML = "";
      risksList.length = 0; // Clear the existing risks list
  
      // Load notes and set the riskCounter to the highest number + 1
      if (notes.length > 0) {
        notes.forEach(note => {
          risksList.push(note);
          addRiskToNotes(note);
        });
        riskCounter = Math.max(...notes.map(note => note.number)) + 1;
      } else {
        riskCounter = 1; // Reset to 1 if no notes
      }
  
      alert("Risks loaded!");
    } else {
      alert("No saved risks found.");
    }
  });
  

// Clear all data
clearButton.addEventListener("click", () => {
  // Show confirmation dialog
  const confirmation = confirm("Are you sure you want to clear all risks?");
  
  if (confirmation) {
    // Clear matrix cells
    const matrixInputs = document.querySelectorAll("#risk-matrix textarea");
    matrixInputs.forEach(input => input.value = ""); // Clear matrix textareas (if any)

    // Clear notes section
    riskNotes.innerHTML = ""; // Clear all risk notes in the notes list
    risksList.length = 0; // Clear the internal risks list array

    // Clear the matrix graph
    const allCells = document.querySelectorAll("#risk-matrix tbody td");
    allCells.forEach(cell => {
      cell.innerHTML = ""; // Remove all risk elements from the matrix
    });

    // Reset the risk counter
    riskCounter = 1; // Start risk numbering over

    // Clear the new risk form fields
    newRiskInput.value = ""; // Clear the risk description
    newLikelihoodSelect.value = "Likely"; // Reset likelihood dropdown to default value
    newImpactSelect.value = "Low"; // Reset impact dropdown to default value
    document.getElementById("new-mitigation").value = ""; // Clear the mitigation input field
    autoGrow(newRiskInput); // Shrink the textareas back to their base height
    autoGrow(document.getElementById("new-mitigation"));
    newCategorySelect.value = ""; // Reset category dropdown
    populatePredefinedRisks(""); // Reset and disable the predefined-risk dropdown

    alert("Risks and matrix cleared!");
  } else {
    alert("Action canceled. Risks were not cleared.");
  }
});

  

// Add risk
addRiskButton.addEventListener("click", () => {
  const riskText = newRiskInput.value.trim();
  const likelihood = newLikelihoodSelect.value;
  const impact = newImpactSelect.value;
  const mitigation = document.getElementById("new-mitigation").value.trim(); // Get mitigation text
  const category = newCategorySelect.value || "Custom";

  if (riskText) {
    // Get the last risk number from the existing risks list (notes)
    const lastRiskNumber = risksList.length > 0 ? risksList[risksList.length - 1].number : 0;

    // Set the new risk number as the next available number
    const riskNumber = lastRiskNumber + 1;

    const risk = {
      number: riskNumber,
      text: riskText,
      likelihood,
      impact,
      mitigation, // Store mitigation with risk
      category
    };

    risksList.push(risk);
    addRiskToNotes(risk);

    // Ready the form for the next risk, without forcing the category to be re-picked.
    newRiskInput.value = "";
    document.getElementById("new-mitigation").value = "";
    autoGrow(newRiskInput);
    autoGrow(document.getElementById("new-mitigation"));
    if (newPredefinedRiskSelect.options.length > 0) {
      newPredefinedRiskSelect.selectedIndex = 0;
    }
  } else {
    alert("Risk description cannot be empty.");
  }
});

// Add risk to notes and matrix
function addRiskToNotes(risk) {
  // Create note element
  const riskListItem = document.createElement("li");
  riskListItem.dataset.riskId = risk.number;

  // Add the risk number and other fields
  const category = risk.category || "Custom";
  riskListItem.innerHTML = `
    <span class="risk-number">#${risk.number}</span> <!-- Display the risk number -->
    <span class="risk-category cat-${category.toLowerCase()}">${category}</span>
    <textarea class="risk-text">${risk.text}</textarea> <!-- Risk Textarea -->
    <textarea class="mitigation-text" placeholder="Mitigation">${risk.mitigation || ''}</textarea>  <!-- Mitigation Textarea -->
    <select class="likelihood">
      <option value="Likely" ${risk.likelihood === "Likely" ? "selected" : ""}>Likely</option>
      <option value="Possible" ${risk.likelihood === "Possible" ? "selected" : ""}>Possible</option>
      <option value="Unlikely" ${risk.likelihood === "Unlikely" ? "selected" : ""}>Unlikely</option>
      <option value="Rare" ${risk.likelihood === "Rare" ? "selected" : ""}>Rare</option>
    </select>
    <select class="impact">
      <option value="Low" ${risk.impact === "Low" ? "selected" : ""}>Low Impact</option>
      <option value="Medium" ${risk.impact === "Medium" ? "selected" : ""}>Medium Impact</option>
      <option value="High" ${risk.impact === "High" ? "selected" : ""}>High Impact</option>
      <option value="Critical" ${risk.impact === "Critical" ? "selected" : ""}>Critical Impact</option>
    </select>
    <button class="delete-risk">Delete</button>
  `;

  // Event listeners for updates and deletion
  riskListItem.querySelector(".risk-text").addEventListener("input", e => {
    risk.text = e.target.value;
    autoGrow(e.target);
  });

  riskListItem.querySelector(".mitigation-text").addEventListener("input", e => {
    risk.mitigation = e.target.value;  // Update mitigation
    autoGrow(e.target);
  });

  riskListItem.querySelector(".likelihood").addEventListener("change", e => {
    risk.likelihood = e.target.value;
    updateRiskInMatrix(risk);
  });

  riskListItem.querySelector(".impact").addEventListener("change", e => {
    risk.impact = e.target.value;
    updateRiskInMatrix(risk);
  });

  riskListItem.querySelector(".delete-risk").addEventListener("click", () => {
    deleteRisk(riskListItem, risk.number);
  });

  // Append the updated risk item to the notes
  riskNotes.appendChild(riskListItem);

  // Size both textareas to their content now that they're in the document
  // (scrollHeight only reports correctly once the element is laid out).
  autoGrow(riskListItem.querySelector(".risk-text"));
  autoGrow(riskListItem.querySelector(".mitigation-text"));

  updateRiskInMatrix(risk);
}
 

 // Delete risk
function deleteRisk(riskItem, riskNumber) {
  // Find the index of the risk in the risks list
  const index = risksList.findIndex(risk => risk.number === riskNumber);
  if (index > -1) {
    // Remove the risk from the list
    risksList.splice(index, 1);
    
    // Re-number the remaining risks
    for (let i = index; i < risksList.length; i++) {
      risksList[i].number = i + 1;  // Update numbers starting from 1
    }
  }
  
  // Remove the risk item from the DOM
  riskItem.remove();
  
  // Update the matrix to reflect the removed risk
  removeRiskFromMatrix(riskNumber);

  // Re-render the risk notes with updated numbering
  riskNotes.innerHTML = "";
  risksList.forEach(note => addRiskToNotes(note));
  
  // Update the risk matrix with updated numbers
  updateAllRisksInMatrix();
}

// Update all risks in the matrix after deletion
function updateAllRisksInMatrix() {
  // Clear all risk elements in the matrix
  const allCells = document.querySelectorAll("#risk-matrix tbody td .risk-id");
  allCells.forEach(riskElement => riskElement.remove());

  // Re-add updated risks to the matrix
  risksList.forEach(risk => updateRiskInMatrix(risk));
}

// Update risk in the matrix
function updateRiskInMatrix(risk) {
  const rows = document.querySelectorAll("#risk-matrix tbody tr");
  rows.forEach(row => {
    row.querySelectorAll("td").forEach(cell => {
      const riskElement = cell.querySelector(`[data-risk-id="${risk.number}"]`);
      if (riskElement) {
        riskElement.remove(); // Remove existing element if present
      }
    });
  });

  const rowIndex = ["Likely", "Possible", "Unlikely", "Rare"].indexOf(risk.likelihood);
  const colIndex = ["Low", "Medium", "High", "Critical"].indexOf(risk.impact);
  const cell = document.querySelector(`#risk-matrix tbody tr:nth-child(${rowIndex + 1}) td:nth-child(${colIndex + 2})`);

  if (cell) {
    // Create a div to hold the risk numbers
    const riskElement = document.createElement("div");
    riskElement.classList.add("risk-id");
    riskElement.textContent = `#${risk.number}`;
    riskElement.dataset.riskId = risk.number;

    // Wrap all risk numbers in a container with flex-wrap style
    let riskContainer = cell.querySelector('.risk-cell');
    if (!riskContainer) {
      riskContainer = document.createElement("div");
      riskContainer.classList.add("risk-cell");
      cell.appendChild(riskContainer);
    }

    // Append the new risk element to the container
    riskContainer.appendChild(riskElement);
  }
}



  // Remove risk from the matrix
  function removeRiskFromMatrix(riskNumber) {
    const rows = document.querySelectorAll("#risk-matrix tbody tr");
    rows.forEach(row => {
      row.querySelectorAll("td").forEach(cell => {
        const riskElement = cell.querySelector(`[data-risk-id="${riskNumber}"]`);
        if (riskElement) {
          riskElement.remove();
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const risk = { likelihood: "Likely", impact: "High" };  // Example risk data (this could come from your data)
  
    // Function to update the likelihood dropdown
    function updateLikelihood() {
      const likelihoodSelect = document.getElementById("new-likelihood");
      const options = likelihoodSelect.querySelectorAll("option");
  
      options.forEach(option => {
        if (option.value === risk.likelihood) {
          option.selected = true;  // Select the option based on risk.likelihood
        }
      });
    }
  
    // Function to update the impact dropdown
    function updateImpact() {
      const impactSelect = document.getElementById("new-impact");
      const options = impactSelect.querySelectorAll("option");
  
      options.forEach(option => {
        if (option.value === risk.impact) {
          option.selected = true;  // Select the option based on risk.impact
        }
      });
    }
  
    // Call the functions to update selections
    updateLikelihood();
    updateImpact();
  });
  

  // Export data to Excel
exportButton.addEventListener("click", () => {
  const data = [];
  const headers = ["Risk Number", "Category", "Risk Text", "Likelihood", "Impact", "Mitigation"];
  data.push(headers);

  // Add risks to the risk list
  risksList.forEach(risk => {
    data.push([`#${risk.number}`, risk.category || "Custom", risk.text, risk.likelihood, risk.impact, risk.mitigation || ""]);
  });

  // Create a worksheet for the risk list
  const ws = XLSX.utils.aoa_to_sheet(data); 
  const wb = XLSX.utils.book_new(); 
  XLSX.utils.book_append_sheet(wb, ws, "Risk List");

  // Create risk matrix data based on likelihood and impact
  const riskMatrixData = generateRiskMatrixData();
  const matrixWs = XLSX.utils.aoa_to_sheet(riskMatrixData); 
  XLSX.utils.book_append_sheet(wb, matrixWs, "Risk Graph");

  // Write and download the Excel file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Risk_List_with_Graph.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

// Function to generate risk matrix data based on likelihood and impact
function generateRiskMatrixData() {
  const matrixData = [];
  
  // Define Likelihood (columns) and Impact (rows)
  const likelihoods = ["Likely", "Possible", "Unlikely", "Rare"];
  const impacts = ["Low", "Medium", "High", "Critical"];

  // Add header row for the matrix (Likelihood categories)
  const headerRow = ["Impact\\Likelihood", ...likelihoods];
  matrixData.push(headerRow);

  // Loop through impacts (rows) and fill the matrix with appropriate risk numbers
  impacts.forEach((impact, rowIndex) => {
    const rowData = [impact]; // Start with the Impact category

    // Add risks that fit the current impact and likelihood combination
    likelihoods.forEach((likelihood, colIndex) => {
      // Get risks that match this likelihood and impact combination
      const risksInCategory = risksList.filter(risk => risk.likelihood === likelihood && risk.impact === impact);
      
      // If there are risks, display the risk numbers; otherwise, leave blank
      if (risksInCategory.length > 0) {
        // Add the risk numbers or just display the risk count if there are multiple risks
        const riskNumbers = risksInCategory.map(risk => `#${risk.number}`).join(", ");
        rowData.push(riskNumbers);
      } else {
        rowData.push(""); // No risks in this category
      }
    });

    matrixData.push(rowData);
  });

  return matrixData;
}

});
