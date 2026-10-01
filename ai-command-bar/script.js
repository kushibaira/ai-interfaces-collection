// ---------- Grab elements ----------
const overlay = document.getElementById("overlay");
const searchInput = document.getElementById("searchInput");
const resultsEl = document.getElementById("results");
const aiAnswerEl = document.getElementById("aiAnswer");
const statusEl = document.getElementById("status");
const openBtn = document.getElementById("openBtn");
const themeBtn = document.getElementById("themeBtn");

// ---------- Commands list ----------
const commands = [
  { group: "Actions", label: "Create new project" },
  { group: "Actions", label: "Invite a teammate" },
  { group: "Actions", label: "Toggle dark theme" },
  { group: "Actions", label: "Export report" },
  { group: "Pages", label: "Go to Dashboard" },
  { group: "Pages", label: "Go to Settings" },
  { group: "Pages", label: "Go to Billing" },
  { group: "Pages", label: "Go to Help Center" }
];

let recent = [];
let visibleItems = [];
let activeIndex = 0;

// ---------- Open and close ----------
function openPalette() {
  overlay.classList.add("open");
  searchInput.value = "";
  aiAnswerEl.classList.remove("show");
  render("");
  searchInput.focus();
}

function closePalette() {
  overlay.classList.remove("open");
}

// ---------- Show results ----------
function render(query) {
  resultsEl.innerHTML = "";
  aiAnswerEl.classList.remove("show");
  query = query.toLowerCase().trim();

  let list;
  if (query === "") {
    // Show recent actions first, then all commands
    const recentItems = recent.map((label) => ({ group: "Recent", label }));
    list = recentItems.concat(commands);
  } else {
    list = commands.filter((c) => c.label.toLowerCase().includes(query));
  }

  visibleItems = list;
  activeIndex = 0;

  // No match: offer "Ask AI"
  if (list.length === 0) {
    const li = document.createElement("li");
    li.className = "result-item active";
    li.textContent = 'Ask AI: "' + query + '"';
    li.addEventListener("click", () => askAI(query));
    resultsEl.appendChild(li);
    visibleItems = [{ group: "AI", label: "ask", query: query }];
    return;
  }

  // Build grouped list
  let lastGroup = "";
  list.forEach((item, index) => {
    if (item.group !== lastGroup) {
      const label = document.createElement("li");
      label.className = "group-label";
      label.textContent = item.group;
      resultsEl.appendChild(label);
      lastGroup = item.group;
    }
    const li = document.createElement("li");
    li.className = "result-item" + (index === 0 ? " active" : "");
    li.textContent = item.label;
    li.dataset.index = index;
    li.addEventListener("click", () => selectItem(item));
    resultsEl.appendChild(li);
  });
}

// ---------- Highlight with arrow keys ----------
function updateActive() {
  const items = resultsEl.querySelectorAll(".result-item");
  items.forEach((el, i) => el.classList.toggle("active", i === activeIndex));
  if (items[activeIndex]) items[activeIndex].scrollIntoView({ block: "nearest" });
}

// ---------- Select a command ----------
function selectItem(item) {
  if (item.group === "AI") {
    askAI(item.query);
    return;
  }

  if (item.label === "Toggle dark theme") {
    document.body.classList.toggle("dark");
  }

  // Save to recent (no duplicates, max 3)
  recent = recent.filter((r) => r !== item.label);
  recent.unshift(item.label);
  recent = recent.slice(0, 3);

  statusEl.textContent = "Ran: " + item.label;
  closePalette();
}

// ---------- Fake AI answer ----------
function askAI(question) {
  resultsEl.innerHTML = "";
  aiAnswerEl.classList.add("show");
  aiAnswerEl.textContent = "Thinking...";

  setTimeout(() => {
    aiAnswerEl.textContent = "";
    const answer =
      'Here is a quick answer about "' + question + '": this is a simulated AI reply. In a real app, the question would be sent to an AI model.';
    let i = 0;
    const timer = setInterval(() => {
      aiAnswerEl.textContent += answer[i];
      i++;
      if (i >= answer.length) clearInterval(timer);
    }, 20);
  }, 600);
}

// ---------- Events ----------
openBtn.addEventListener("click", openPalette);

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

searchInput.addEventListener("input", () => render(searchInput.value));

// Click on dark background closes the popup
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closePalette();
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl+K or Cmd+K opens the bar
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    openPalette();
    return;
  }

  if (!overlay.classList.contains("open")) return;

  if (e.key === "Escape") {
    closePalette();
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex = Math.min(activeIndex + 1, visibleItems.length - 1);
    updateActive();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex = Math.max(activeIndex - 1, 0);
    updateActive();
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (visibleItems[activeIndex]) selectItem(visibleItems[activeIndex]);
  }
});