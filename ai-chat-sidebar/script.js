// ---------- Grab elements ----------
const messagesEl = document.getElementById("messages");
const welcomeEl = document.getElementById("welcome");
const inputEl = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");
const themeBtn = document.getElementById("themeBtn");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const historyList = document.getElementById("historyList");
const chips = document.querySelectorAll(".chip");

// ---------- Fake AI replies ----------
const replies = [
  "Great question! Here is a simple way to think about it: break the topic into small parts and learn one part at a time.",
  "Sure! Start with a clear greeting, say what you need in one or two sentences, and end by thanking the reader.",
  "Here are some study tips: study in short sessions, take small breaks, and test yourself instead of only re-reading.",
  "That is interesting! Could you tell me a little more so I can give a better answer?"
];

// ---------- Add a message to the screen ----------
function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = "message " + sender;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

// ---------- Typing (streaming) effect ----------
function streamText(element, text) {
  let i = 0;
  const timer = setInterval(() => {
    element.textContent += text[i];
    i++;
    messagesEl.scrollTop = messagesEl.scrollHeight;
    if (i >= text.length) clearInterval(timer);
  }, 20);
}

// ---------- Send a message ----------
function sendMessage(text) {
  text = text.trim();
  if (text === "") return;

  welcomeEl.style.display = "none";
  addMessage(text, "user");
  inputEl.value = "";

  const aiMessage = addMessage("", "ai");
  aiMessage.textContent = "Thinking...";

  setTimeout(() => {
    aiMessage.textContent = "";
    const reply = replies[Math.floor(Math.random() * replies.length)];
    streamText(aiMessage, reply);
  }, 800);
}

// ---------- Events ----------
sendBtn.addEventListener("click", () => sendMessage(inputEl.value));

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage(inputEl.value);
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => sendMessage(chip.textContent));
});

// ---------- New chat ----------
newChatBtn.addEventListener("click", () => {
  messagesEl.querySelectorAll(".message").forEach((m) => m.remove());
  welcomeEl.style.display = "block";

  const item = document.createElement("li");
  item.className = "history-item";
  item.textContent = "New chat";
  historyList.prepend(item);
  sidebar.classList.remove("open");
});

// ---------- Theme toggle ----------
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// ---------- Mobile sidebar ----------
menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});