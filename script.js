function testRegex() {
  const pattern = document.getElementById("pattern").value;
  const text = document.getElementById("text").value;
  const flags = document.getElementById("flags").value;
  const result = document.getElementById("result");
  const countDisplay = document.getElementById("count");

  if (!pattern) {
    result.textContent = "❌ Enter a regex pattern";
    return;
  }

  if (!text) {
    result.textContent = "⚠️ Enter some text to test";
    countDisplay.textContent = "";
    return;
  }

  try {
    const validFlags = flags.replace(/[^gimsuy]/g, "");
    const finalFlags = validFlags.includes("g") ? validFlags : validFlags + "g";

    const regex = new RegExp(pattern, finalFlags);

    const safeText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    let matchCount = 0;

    const highlighted = safeText.replace(regex, match => {
      matchCount++;
      return `<span class="highlight">${match}</span>`;
    });

    if (matchCount === 0) {
      result.textContent = "No matches found";
    } else {
      result.innerHTML = highlighted;
    }

    countDisplay.textContent = `Matches: ${matchCount}`;

  } catch (e) {
    result.textContent = "Invalid Regex";
    countDisplay.textContent = "";
  }
}