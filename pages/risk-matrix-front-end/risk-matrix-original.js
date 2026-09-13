// Starter catalog of common Privacy, AI, and Operational risks. Picking one
// prefills the risk/mitigation text and a suggested Likelihood/Impact below -
// everything stays editable afterward, and "Custom" skips this entirely.
const RISK_CATALOG = {
  Privacy: [
    { text: "Personal data is processed without a documented legal basis", mitigation: "Map each processing activity to a lawful basis (consent, contract, legitimate interest, etc.) and record it in the processing register.", likelihood: "Possible", impact: "Critical" },
    { text: "Data retention periods are not defined or enforced", mitigation: "Define a retention period per data category and automate deletion or archival once it expires.", likelihood: "Likely", impact: "High" },
    { text: "Personal data is transferred across borders without an appropriate safeguard", mitigation: "Confirm an adequacy decision, standard contractual clauses, or binding corporate rules are in place before any transfer.", likelihood: "Possible", impact: "Critical" },
    { text: "Data subject rights requests are not tracked through to completion", mitigation: "Stand up an intake and tracking workflow that flags each request against its statutory deadline.", likelihood: "Possible", impact: "High" },
    { text: "A third-party vendor processes personal data without a signed data processing agreement", mitigation: "Make an executed DPA and a completed security review a condition of vendor onboarding.", likelihood: "Possible", impact: "High" },
    { text: "Non-essential cookies or trackers fire before consent is captured", mitigation: "Block non-essential tags until the consent platform records an explicit opt-in.", likelihood: "Likely", impact: "Medium" },
    { text: "Special category (sensitive) data is collected without explicit consent", mitigation: "Add a dedicated, separate consent step and minimize collection to what's strictly necessary.", likelihood: "Unlikely", impact: "Critical" }
  ],
  AI: [
    { text: "A model is trained on data without clear rights or consent to use it", mitigation: "Verify the provenance and licensing of training data before development starts.", likelihood: "Possible", impact: "Critical" },
    { text: "High-stakes automated decisions are made with no human review", mitigation: "Add a meaningful human checkpoint for any decision with a legal or similarly significant effect.", likelihood: "Possible", impact: "Critical" },
    { text: "Model outputs are not monitored for bias or disparate impact", mitigation: "Run periodic fairness testing across the groups the system affects and log the results.", likelihood: "Possible", impact: "High" },
    { text: "Automated decisions shown to users come with no explanation of the logic behind them", mitigation: "Provide a plain-language summary of the main factors behind each output.", likelihood: "Likely", impact: "Medium" },
    { text: "An AI system is reused for a purpose beyond its original scope without reassessment", mitigation: "Require a documented impact reassessment before repurposing a model.", likelihood: "Possible", impact: "High" },
    { text: "There is no rollback or fallback plan if the AI system fails or misbehaves", mitigation: "Define a kill switch and a manual fallback process, and test both before go-live.", likelihood: "Unlikely", impact: "High" },
    { text: "A third-party model provider's terms allow reuse of submitted data for their own training", mitigation: "Review vendor terms and disable any data retention or training opt-in by default.", likelihood: "Possible", impact: "High" }
  ],
  Operational: [
    { text: "There is no documented incident response plan for a data breach", mitigation: "Maintain a written breach response and notification plan, and test it at least annually.", likelihood: "Unlikely", impact: "Critical" },
    { text: "User access rights are not reviewed on a regular schedule", mitigation: "Run quarterly access recertification and revoke permissions that are no longer needed.", likelihood: "Likely", impact: "Medium" },
    { text: "A key process depends on a single person with no documented backup", mitigation: "Cross-train a second owner and write a runbook for the process.", likelihood: "Possible", impact: "Medium" },
    { text: "Changes are pushed to production without a tested rollback plan", mitigation: "Require a verified rollback step as part of every change approval.", likelihood: "Possible", impact: "High" },
    { text: "A critical vendor or service has no contingency plan for an outage", mitigation: "Identify critical vendors and define a fallback or manual process for when they're unavailable.", likelihood: "Unlikely", impact: "High" },
    { text: "Staff are not trained on data handling or security policy", mitigation: "Schedule mandatory annual training and track completion.", likelihood: "Likely", impact: "Medium" },
    { text: "Backup restoration has never actually been tested", mitigation: "Run a scheduled restore drill and document what happened.", likelihood: "Unlikely", impact: "Critical" }
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

    (RISK_CATALOG[category] || []).forEach((risk, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = risk.text;
      newPredefinedRiskSelect.appendChild(option);
    });
  }

  newCategorySelect.addEventListener("change", () => {
    const category = newCategorySelect.value;
    populatePredefinedRisks(category);
    newRiskInput.value = "";
    document.getElementById("new-mitigation").value = "";
    if (category === "Custom") {
      newRiskInput.focus();
    }
  });

  newPredefinedRiskSelect.addEventListener("change", () => {
    const category = newCategorySelect.value;
    const index = newPredefinedRiskSelect.value;

    if (index === "" || !RISK_CATALOG[category]) {
      newRiskInput.value = "";
      document.getElementById("new-mitigation").value = "";
      newRiskInput.focus();
      return;
    }

    const predefined = RISK_CATALOG[category][index];
    newRiskInput.value = predefined.text;
    document.getElementById("new-mitigation").value = predefined.mitigation;
    newLikelihoodSelect.value = predefined.likelihood;
    newImpactSelect.value = predefined.impact;
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
  });

  riskListItem.querySelector(".mitigation-text").addEventListener("input", e => {
    risk.mitigation = e.target.value;  // Update mitigation
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
