const jobGradeDropdown = document.getElementById("job-grade");
const competenciesSection = document.getElementById("competencies-section");
const totalMCQInput = document.getElementById("total-mcq");
const totalOEInput = document.getElementById("total-oe");
const totalEInput = document.getElementById("total-e");
const timeMCQInput = document.getElementById("time-mcq");
const timeOEInput = document.getElementById("time-oe");
const timeEInput = document.getElementById("time-e");
const totalTimeInput = document.getElementById("total-time");

var globalData;

// const competenciesOptions = [
//     "Security Operations", "SOC Engineering", "Cyber Threat Intelligence", "Cyber Threat Hunting",
//     "Incident Response", "Digital Forensics", "Malware Analysis", "Security Design & Engineering",
//     "Cryptographic Management", "Cloud Security", "Cyber Programme Management", "Cyber Product Engineering",
//     "DevSecOps", "Security Testing", "Adversary Simulation", "Policy & Strategy (ICT&SS)",
//     "Cyber Risk Assessment & Management", "Ecosystem Development", "International Cooperation Development",
//     "Security Engagement & Promotion", "Regulations", "Policy & Strategy (National Level)"
// ];
const competenciesOptions = [
    "Security Operations", "Cyber Threat Intelligence","Digital Forensics", "Security Testing", "Adversary Simulation",
    "Cyber Risk Assessment & Management", "SOC Engineering"
];

function renderCompetencyFields(numCompetencies, defaultMCQ, defaultOE, defaultE) {
    competenciesSection.innerHTML = "";

    for (let i = 1; i <= numCompetencies; i++) {
        const competencyDiv = document.createElement("div");
        competencyDiv.className = "competency";

        competencyDiv.innerHTML = `
            <div class="competency-header">Competency ${i}</div>
            <select class="competency-dropdown">
                ${competenciesOptions.map(option => `<option value="${option}">${option}</option>`).join("")}
            </select>
            <div class="fields">
                <label>PL</label>
                <select class="proficiency-level">
                    <option value="L1">L1</option>
                    <option value="L2">L2</option>
                    <option value="L3">L3</option>
                </select>
                <label>MCQ</label>
                <input type="number" class="mcq-field" value="${defaultMCQ}" oninput="updateTotals()">
                <label>OE</label>
                <input type="number" class="oe-field" value="${defaultOE}" oninput="updateTotals()">
                <label>E</label>
                <input type="number" class="e-field" value="${defaultE}" oninput="updateTotals()">
            </div>
        `;
        competenciesSection.appendChild(competencyDiv);
    }
    updateTotals();
}

renderCompetencyFields(2, 30, 5, 1);

jobGradeDropdown.addEventListener("change", () => {
    const selectedGrade = jobGradeDropdown.value;
    if (["D-F"].includes(selectedGrade)) {
        renderCompetencyFields(2, 30, 5, 1);
    } else if (["G-J"].includes(selectedGrade)) {
        renderCompetencyFields(3, 15, 5, 1);
    } else {
        renderCompetencyFields(4, 10, 5, 1);
    }
});

function updateTotals() {
    const mcqFields = document.querySelectorAll(".mcq-field");
    const oeFields = document.querySelectorAll(".oe-field");
    const eFields = document.querySelectorAll(".e-field");

    let totalMCQ = 0, totalOE = 0, totalE = 0;
    mcqFields.forEach(field => totalMCQ += parseInt(field.value) || 0);
    oeFields.forEach(field => totalOE += parseInt(field.value) || 0);
    eFields.forEach(field => totalE += parseInt(field.value) || 0);

    totalMCQInput.value = totalMCQ;
    totalOEInput.value = totalOE;
    totalEInput.value = totalE;

    const totalMCQTime = totalMCQ * 1;
    const totalOETime = totalOE * 3;
    const totalETime = totalE * 30;
    const totalTime = totalMCQTime + totalOETime + totalETime;

    timeMCQInput.value = `${Math.floor(totalMCQTime / 60)}h ${totalMCQTime % 60}m`;
    timeOEInput.value = `${Math.floor(totalOETime / 60)}h ${totalOETime % 60}m`;
    timeEInput.value = `${Math.floor(totalETime / 60)}h ${totalETime % 60}m`;
    totalTimeInput.value = `${Math.floor(totalTime / 60)}h ${totalTime % 60}m`;

    if (Math.floor(totalTime / 60)>= 4){
        totalTimeInput.style.color = "red";
    }else {
        totalTimeInput.style.color = "black";
    }
}

function replaceSymbols(str){
    str = str.replaceAll('"',"'");
    // str = str.replace("''","'");
    // str = str.replace('“',"'");
    return str;
}

function convertToCSV(array) {
    
    //const header = Object.keys(array[0][0]);
    const header = ["Sn","question_type","question_text"];
    let rows = [];
    let count = 1;

    for(i=0;i<array.length;i++){
        for(j=0;j<array[i].length;j++){
            
            let val = [count,array[i][j].question_type, '"'+replaceSymbols(array[i][j].question_text)+'"']
            rows.push(val);
            count ++;
        }
    }
//“
    //console.log(rows);
    return [header.join(","), ...rows].join("\n");

    // const rows = array.map(obj => header.map(fieldName => obj[fieldName]).join(","));
    // return [header.join(","), ...rows].join("\n");
}

function displayArrayAsTable(data) {

    globalData = data;

    document.getElementById("messages").innerHTML= `<a href="#" id="downloadlink">Click here to download assessment</a>`;

    document.getElementById("downloadlink").addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the link from opening the URL
        
        const csvContent = convertToCSV(globalData);

        // Create a Blob from the CSV string
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

        // Create a link element
        const link = document.createElement("a");

        // Set the download attribute with a filename
        link.download = "data.csv";

        // Create a URL for the Blob and set it as the href
        if (navigator.msSaveBlob) { // For IE 10+
            navigator.msSaveBlob(blob, "data.csv");
        } else {
            link.href = URL.createObjectURL(blob);
        }

        // Programmatically click the link to trigger the download
        link.click();


    });


    // Combine and sort Data
    let combinedArr = []

    for(i=0;i<data.length;i++){
        for(j=0;j<data[i].length;j++){
            combinedArr.push(data[i][j]);
        }
    }
    const mcqQuestions = combinedArr.filter(q => q.question_type === "MCQ");
    const oeQuestions = combinedArr.filter(q => q.question_type === "OE");
    const efQuestions = combinedArr.filter(q => q.question_type === "E");

    //console.log(combinedArr);
    document.getElementById("table-container").innerHTML="";
    displayRefinedTable(mcqQuestions,"MCQ");
    displayRefinedTable(oeQuestions,"OE");
    displayRefinedTable(efQuestions,"E");

}

function displayRefinedTable(data,label){

    const h3Element = document.createElement("h3");
    h3Element.textContent = label;
    document.getElementById("table-container").appendChild(h3Element);

    const table = document.createElement("table");
    table.classList.add("datatable")

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    
    // Create the header cells
    const headerCell1 = document.createElement("th");
    headerCell1.textContent = "S/N";
    const headerCell2 = document.createElement("th");
    headerCell2.textContent = "Question";
    
    // Append the header cells to the row
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    
    // Append the row to the table header
    thead.appendChild(headerRow);
    
    // Append the table header to the table
    table.appendChild(thead);
    
    // Create the table body (optional, if you want to add rows dynamically)
    const tbody = document.createElement("tbody");

    let cnt = 1;
    data.forEach(item => {
        const row = document.createElement("tr");
    
        // Create the cells for each row
        const snCell = document.createElement("td");
        snCell.textContent = cnt;
    
        const questionCell = document.createElement("td");
        questionCell.innerHTML = item.question_text.replace(/\n/g, "<br>");;
    
        // Append the cells to the row
        row.appendChild(snCell);
        row.appendChild(questionCell);
    
        // Append the row to the table body
        tbody.appendChild(row);
        cnt ++;
    });
    table.appendChild(tbody);
    //     // Append the row to the table
        
    // });

    // Add the table to the container
    document.getElementById("table-container").appendChild(table);

}

function generateAssessment() {
    const assessmentOutput = document.getElementById("assessment-output");

   const dropdowns = document.querySelectorAll('.competency-dropdown');
   const plevel = document.querySelectorAll('.proficiency-level');
   const mcq = document.querySelectorAll('.mcq-field');
   const oe = document.querySelectorAll('.oe-field');
   const ef = document.querySelectorAll('.e-field');

   const dvalues = [];

   for (let i = 0; i < dropdowns.length; i++) {
        let obj = new Object();
        obj = {
            compentency :dropdowns[i].value,
            proficiency : plevel[i].value,
            mcq : mcq[i].value,
            oe : oe[i].value,
            ef : ef[i].value
        }
        dvalues.push(obj);
   }

    fetch("/api/get-questions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dvalues),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        console.log("Fetched questions:", data);
        // Handle the data returned by the API here

        //Display Somthing
        displayArrayAsTable(data);

        //assessmentOutput.innerHTML = "<p>Your assessment has been generated!</p>";


    })
    .catch(error => {
        console.error("There was an error with the fetch operation:", error);
    });


}
