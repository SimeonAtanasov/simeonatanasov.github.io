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
  const riskNotes = document.getElementById("risk-notes");

  let riskCounter = 1;
  const risksList = [];

  // Save data to localStorage
  saveButton.addEventListener("click", () => {
    const risks = Array.from(inputs).map(input => input.value);
    const risksWithNotes = risksList.map(risk => ({
      number: risk.number,
      text: risk.text,
      likelihood: risk.likelihood,
      impact: risk.impact
    }));
    localStorage.setItem("riskMatrix", JSON.stringify({ matrix: risks, notes: risksWithNotes }));
    alert("Risks saved!");
  });

  // Load data from localStorage
  loadButton.addEventListener("click", () => {
    const savedData = JSON.parse(localStorage.getItem("riskMatrix"));
    if (savedData) {
      const { matrix, notes } = savedData;

      // Load the matrix data
      inputs.forEach((input, index) => {
        input.value = matrix[index] || "";
      });

      // Load the notes data
      riskNotes.innerHTML = ""; // Clear current notes
      notes.forEach(note => {
        const riskListItem = document.createElement("li");
        riskListItem.dataset.riskId = note.number;

        riskListItem.innerHTML = `
          <input type="text" class="risk-text" value="${note.text}" />
          <select class="likelihood">
            <option value="Likely" ${note.likelihood === 'Likely' ? 'selected' : ''}>Likely</option>
            <option value="Possible" ${note.likelihood === 'Possible' ? 'selected' : ''}>Possible</option>
            <option value="Unlikely" ${note.likelihood === 'Unlikely' ? 'selected' : ''}>Unlikely</option>
            <option value="Rare" ${note.likelihood === 'Rare' ? 'selected' : ''}>Rare</option>
          </select>
          <select class="impact">
            <option value="Low" ${note.impact === 'Low' ? 'selected' : ''}>Low</option>
            <option value="Medium" ${note.impact === 'Medium' ? 'selected' : ''}>Medium</option>
            <option value="High" ${note.impact === 'High' ? 'selected' : ''}>High</option>
            <option value="Critical" ${note.impact === 'Critical' ? 'selected' : ''}>Critical</option>
          </select>
          <button class="delete-risk">Delete</button>
        `;

        // Add event listener for delete button
        riskListItem.querySelector(".delete-risk").addEventListener("click", () => {
          deleteRisk(riskListItem, risk.number); // Call deleteRisk to remove the risk
        });


        // Add event listeners to update risk when likelihood or impact changes
        riskListItem.querySelector(".likelihood").addEventListener("change", (e) => {
          const updatedLikelihood = e.target.value;
          if (updatedLikelihood !== risk.likelihood) { // Only update if the value changed
            risk.likelihood = updatedLikelihood;
            updateRiskInMatrix(risk);
          }
        });

        riskListItem.querySelector(".impact").addEventListener("change", (e) => {
          const updatedImpact = e.target.value;
          if (updatedImpact !== risk.impact) { // Only update if the value changed
            risk.impact = updatedImpact;
            updateRiskInMatrix(risk);
          }
        });

        // Update text field when changed
        riskListItem.querySelector(".risk-text").addEventListener("input", (e) => {
          const updatedText = e.target.value;
          note.text = updatedText;
        });

        riskNotes.appendChild(riskListItem);
      });

      alert("Risks and notes loaded!");
    } else {
      alert("No saved risks found!");
    }
  });

// Clear button (reset counter and data)
clearButton.addEventListener("click", () => {
  // Show confirmation dialog
  const confirmation = confirm("Are you sure you want to clear all risks?");

  if (confirmation) {
    const matrixInputs = document.querySelectorAll("#risk-matrix textarea");
    matrixInputs.forEach(input => input.value = ""); // Clear matrix cells

    riskNotes.innerHTML = ""; // Clear notes section
    risksList.length = 0; // Clear the list of risks

    // Clear the matrix cells where risks were added
    const allCells = document.querySelectorAll("#risk-matrix tbody td");
    allCells.forEach(cell => {
      cell.innerHTML = ""; // Remove all risk elements from matrix
    });

    riskCounter = 1; // Reset the risk counter to 1

    alert("Risks and matrix cleared!");
  } else {
    alert("Action canceled. Risks were not cleared.");
  }
});


  // Export data to Excel
  exportButton.addEventListener("click", () => {
    const data = [];
    const headers = ["Risk Number", "Risk Text", "Likelihood", "Impact"];
    data.push(headers);

    risksList.forEach(risk => {
      data.push([`#${risk.number}`, risk.text, risk.likelihood, risk.impact]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data); // Create sheet for "Risk List"
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Risk List");

    const riskMatrixData = generateRiskMatrixData();
    const matrixWs = XLSX.utils.aoa_to_sheet(riskMatrixData); // Create sheet for "Risk Graph"
    XLSX.utils.book_append_sheet(wb, matrixWs, "Risk Graph");

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

  // Add risk to matrix and notes from input form
  addRiskButton.addEventListener("click", () => {
    const riskText = newRiskInput.value.trim();
    const likelihood = newLikelihoodSelect.value;
    const impact = newImpactSelect.value;

    if (riskText) {
      const risk = {
        number: riskCounter,
        text: riskText,
        likelihood: likelihood,
        impact: impact
      };

      risksList.push(risk);

      // Create the risk element in the matrix
      const rowIndex = ["Likely", "Possible", "Unlikely", "Rare"].indexOf(likelihood);
      const colIndex = ["Low", "Medium", "High", "Critical"].indexOf(impact);

      const cell = document.querySelector(`#risk-matrix tbody tr:nth-child(${rowIndex + 1}) td:nth-child(${colIndex + 2})`);

      // Add the risk ID element to the cell, stacking it if necessary
      const existingRiskElements = cell.querySelectorAll(".risk-id");
      const riskIdElement = document.createElement("div");
      riskIdElement.classList.add("risk-id");
      riskIdElement.textContent = `#${riskCounter++}`;

      // If there are already risks in the same cell, append the new one below the existing ones
      if (existingRiskElements.length > 0) {
        cell.appendChild(riskIdElement);
      } else {
        cell.appendChild(riskIdElement); // First risk, just append
      }

      // Add the risk to the Notes section with editable fields
      const riskListItem = document.createElement("li");
      riskListItem.dataset.riskId = riskCounter - 1;

      riskListItem.innerHTML = `
        <input type="text" class="risk-text" value="${riskText}" />
        <select class="likelihood">
          <option value="Likely" ${likelihood === 'Likely' ? 'selected' : ''}>Likely</option>
          <option value="Possible" ${likelihood === 'Possible' ? 'selected' : ''}>Possible</option>
          <option value="Unlikely" ${likelihood === 'Unlikely' ? 'selected' : ''}>Unlikely</option>
          <option value="Rare" ${likelihood === 'Rare' ? 'selected' : ''}>Rare</option>
        </select>
        <select class="impact">
          <option value="Low" ${impact === 'Low' ? 'selected' : ''}>Low</option>
          <option value="Medium" ${impact === 'Medium' ? 'selected' : ''}>Medium</option>
          <option value="High" ${impact === 'High' ? 'selected' : ''}>High</option>
          <option value="Critical" ${impact === 'Critical' ? 'selected' : ''}>Critical</option>
        </select>
        <button class="delete-risk">Delete</button>
      `;

      // Add event listener for delete button
      riskListItem.querySelector(".delete-risk").addEventListener("click", () => {
        deleteRisk(riskListItem, risk.number);
      });

      // Add event listeners to update risk when likelihood or impact changes
      riskListItem.querySelector(".likelihood").addEventListener("change", (e) => {
        const updatedLikelihood = e.target.value;
        risk.likelihood = updatedLikelihood;
        updateRiskInMatrix(risk);
      });

      riskListItem.querySelector(".impact").addEventListener("change", (e) => {
        const updatedImpact = e.target.value;
        risk.impact = updatedImpact;
        updateRiskInMatrix(risk);
      });

      // Update text field when changed
      riskListItem.querySelector(".risk-text").addEventListener("input", (e) => {
        const updatedText = e.target.value;
        risk.text = updatedText;
      });

      riskNotes.appendChild(riskListItem);
    }
  });
  // Helper function to delete a risk from both the matrix and notes
  function deleteRisk(riskItem, riskNumber) {
    // Remove risk from list
    const index = risksList.findIndex(risk => risk.number === riskNumber);
    if (index > -1) {
      risksList.splice(index, 1);
    }
  
    // Remove risk element from matrix
    const riskCells = document.querySelectorAll(`#risk-matrix td`);
    riskCells.forEach(cell => {
      const riskIdElements = cell.querySelectorAll(".risk-id");
      riskIdElements.forEach(idElem => {
        if (idElem.textContent === `#${riskNumber}`) {
          cell.removeChild(idElem); // Remove risk element from matrix
        }
      });
    });
  
    // Remove risk from notes
    riskItem.remove();
  }
  


// Update risk in matrix when likelihood or impact changes
function updateRiskInMatrix(risk) {
  const rows = document.querySelectorAll("#risk-matrix tbody tr");

  rows.forEach((row, rowIndex) => {
    row.querySelectorAll("td").forEach((cell, colIndex) => {
      const isLikelihoodMatch = rowIndex === ["Likely", "Possible", "Unlikely", "Rare"].indexOf(risk.likelihood);
      const isImpactMatch = colIndex === ["Low", "Medium", "High", "Critical"].indexOf(risk.impact);

      const riskElement = cell.querySelector(`[data-risk-id="${risk.number}"]`);
         
      if (isLikelihoodMatch && isImpactMatch) {
        // If this cell matches the new likelihood and impact, update or add the risk element
        if (riskElement) {
          riskElement.textContent = `#${risk.number} - ${risk.text}`; // Update the risk ID text
        } else {
          // If there's no existing risk element, create a new one
          const newRiskElement = document.createElement("div");
          newRiskElement.classList.add("risk-id");
          newRiskElement.textContent = `#${risk.number}`;
          newRiskElement.dataset.riskId = risk.number; // Assign risk ID for identification
          cell.appendChild(newRiskElement); // Append the new risk element to the cell
        }
      } else {
        // If this cell does not match, remove the risk element if it exists
        if (riskElement) {
          riskElement.remove();
        }
      }
    });
  });
}

});


