// ---------- Grab elements ----------
const sourceText = document.getElementById("sourceText");
const summarizeBtn = document.getElementById("summarizeBtn");
const sampleBtn = document.getElementById("sampleBtn");
const themeBtn = document.getElementById("themeBtn");
const lengthBtns = document.querySelectorAll(".length-btn");
const summaryCard = document.getElementById("summaryCard");
const summaryText = document.getElementById("summaryText");
const keyPoints = document.getElementById("keyPoints");
const togglePoints = document.getElementById("togglePoints");
const confidenceEl = document.getElementById("confidence");
const copyBtn = document.getElementById("copyBtn");
const regenBtn = document.getElementById("regenBtn");
const likeBtn = document.getElementById("likeBtn");
const dislikeBtn = document.getElementById("dislikeBtn");
const feedbackEl = document.getElementById("feedback");

let currentLength = "short";
let regenCount = 0;

// ---------- Sample text ----------
const sample =
  "Remote work has changed how teams collaborate. Many companies now use video calls, shared documents and chat tools to stay connected. " +
  "Workers report more flexibility and less time spent commuting. However, some people feel isolated and find it harder to separate work from home life. " +
  "Managers are experimenting with hybrid schedules, regular check-ins and clear goals to keep teams productive. " +
  "Experts say the most successful teams are the ones that communicate openly and trust each other.";

// ---------- Split text into sentences ----------
function getSentences(text) {
  const parts = text.match(/[^.!?]+[.!?]*/g) || [];
  return parts.map((s) => s.trim()).filter((s) => s.length > 0);
}

// ---------- Build a simulated summary ----------
function buildSummary(text) {
  const sentences = getSentences(text);

  // Short = first sentence, Detailed = first three sentences
  const count = currentLength === "short" ? 1 : 3;
  const summary = sentences.slice(0, count).join(" ");

  // Key points = up to 4 longer sentences
  const points = sentences
    .filter((s) => s.length > 30)
    .slice(0, 4)
    .map((s) => (s.length > 90 ? s.slice(0, 90) + "..." : s));

  return { summary, points };
}

// ---------- Show the card ----------
function showSummary() {
  const text = sourceText.value.trim();

  if (text === "") {
    alert("Please paste some text or click 'Use sample text'.");
    return;
  }

  summaryCard.classList.remove("show");
  feedbackEl.textContent = "";
  summaryText.textContent = "Thinking...";
  keyPoints.innerHTML = "";
  summaryCard.classList.add("show");

  setTimeout(() => {
    const result = buildSummary(text);
    summaryText.textContent = "";

    // Typing effect for the summary
    let i = 0;
    const timer = setInterval(() => {
      summaryText.textContent += result.summary[i];
      i++;
      if (i >= result.summary.length) clearInterval(timer);
    }, 15);

    // Key points
    result.points.forEach((p) => {
      const li = document.createElement("li");
      li.textContent = p;
      keyPoints.appendChild(li);
    });

    // Confidence depends on text length
    const words = text.split(/\s+/).length;
    confidenceEl.textContent = words > 40 ? "Confidence: High" : "Confidence: Medium";
  }, 700);
}

// ---------- Events ----------
summarizeBtn.addEventListener("click", showSummary);

sampleBtn.addEventListener("click", () => {
  sourceText.value = sample;
});

lengthBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    lengthBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentLength = btn.dataset.length;
    // Update the card if it is already showing
    if (summaryCard.classList.contains("show")) showSummary();
  });
});

togglePoints.addEventListener("click", () => {
  keyPoints.classList.toggle("hidden");
  togglePoints.textContent = keyPoints.classList.contains("hidden")
    ? "Show key points"
    : "Hide key points";
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(summaryText.textContent);
  feedbackEl.textContent = "Copied!";
});

regenBtn.addEventListener("click", () => {
  regenCount++;
  feedbackEl.textContent = "Regenerated (" + regenCount + ")";
  showSummary();
});

likeBtn.addEventListener("click", () => {
  feedbackEl.textContent = "Thanks for the feedback!";
});

dislikeBtn.addEventListener("click", () => {
  feedbackEl.textContent = "Sorry! We will improve.";
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});