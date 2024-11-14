const jobGradeDropdown = document.getElementById("job-grade");
const competenciesSection = document.getElementById("competencies-section");
const totalMCQInput = document.getElementById("total-mcq");
const totalOEInput = document.getElementById("total-oe");
const totalEInput = document.getElementById("total-e");
const timeMCQInput = document.getElementById("time-mcq");
const timeOEInput = document.getElementById("time-oe");
const timeEInput = document.getElementById("time-e");
const totalTimeInput = document.getElementById("total-time");

const competenciesOptions = [
    "Security Operations", "SOC Engineering", "Cyber Threat Intelligence", "Cyber Threat Hunting",
    "Incident Response", "Digital Forensics", "Malware Analysis", "Security Design & Engineering",
    "Cryptographic Management", "Cloud Security", "Cyber Programme Management", "Cyber Product Engineering",
    "DevSecOps", "Security Testing", "Adversary Simulation", "Policy & Strategy (ICT&SS)",
    "Cyber Risk Assessment & Management", "Ecosystem Development", "International Cooperation Development",
    "Security Engagement & Promotion", "Regulations", "Policy & Strategy (National Level)"
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
}

function generateAssessment() {
    const assessmentOutput = document.getElementById("assessment-output");
    assessmentOutput.innerHTML = "<p>Your assessment has been generated!</p>";
}
