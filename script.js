const patternInput = document.getElementById("pattern");
const textInput = document.getElementById("text");
const flagsInput = document.getElementById("flags");

patternInput.addEventListener("input", testRegex);
textInput.addEventListener("input", testRegex);
flagsInput.addEventListener("input", testRegex);

function testRegex() {

  const pattern = patternInput.value;
  const text = textInput.value;
  const flags = flagsInput.value;

  const result = document.getElementById("result");
  const countDisplay = document.getElementById("count");
  const stats = document.getElementById("stats");
  const groups = document.getElementById("groups");

  if (!pattern || !text) {
    result.innerHTML = "";
    countDisplay.textContent = "";
    stats.textContent = "";
    groups.textContent = "";
    return;
  }

  try {

    const validFlags = flags.replace(/[^gimsuy]/g, "");
    const finalFlags = validFlags.includes("g")
      ? validFlags
      : validFlags + "g";

    const regex = new RegExp(pattern, finalFlags);

    const start = performance.now();

    let matchCount = 0;
    let captureHTML = "";

    const safeText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const highlighted = safeText.replace(regex, (...args) => {

      matchCount++;

      const match = args[0];
      const captures = args.slice(1, -2);

      if (captures.length > 0) {
        captureHTML += `
          <p>
            <strong>Match ${matchCount}</strong><br>
            ${captures.map((g, i) =>
              `Group ${i + 1}: ${g || "(empty)"}`
            ).join("<br>")}
          </p>
        `;
      }

      return `<span class="highlight">${match}</span>`;
    });

    const end = performance.now();

    if (matchCount === 0) {
      result.textContent = "No matches found";
    } else {
      result.innerHTML = highlighted;
    }

    countDisplay.textContent = `Matches Found: ${matchCount}`;

    stats.innerHTML = `
      Characters: ${text.length} |
      Lines: ${text.split("\n").length} |
      Execution Time: ${(end - start).toFixed(2)}ms
    `;

    groups.innerHTML = captureHTML;

  } catch (e) {

    result.innerHTML = `
      <span style="color:red;">
        Invalid Regex: ${e.message}
      </span>
    `;

    countDisplay.textContent = "";
    stats.textContent = "";
    groups.textContent = "";
  }
}


function copyMatches() {

  const matches =
    document.querySelectorAll(".highlight");

  const text = Array.from(matches)
    .map(m => m.textContent)
    .join("\n");

  navigator.clipboard.writeText(text);

  alert("Matches copied!");
}


const themeBtn =
  document.getElementById("themeToggle");

themeBtn.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeBtn.textContent = "☀️";
  } else {
    themeBtn.textContent = "🌙";
  }
});


document.getElementById("examples")
.addEventListener("change", function(){

  patternInput.value = this.value;

  if(this.value === "\\d+"){
    textInput.value = "Age 21 and score 450";
  }

  if(this.value.includes("@")){
    textInput.value =
      "hello@gmail.com support@yahoo.com";
  }

  if(this.value === "\\d{10}"){
    textInput.value =
      "9876543210 9123456780";
  }

  if(this.value === "\\d{2}\\/\\d{2}\\/\\d{4}"){
    textInput.value =
      "25/12/2025";
  }

  testRegex();
});