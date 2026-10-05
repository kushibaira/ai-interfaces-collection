// ---------- Shared data (used by all pages) ----------
const STORAGE_KEY = "phonepeState";

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) return saved;
  } catch (e) {}
  return {
    balance: 8500,
    transactions: [
      { title: "Received from Arun", amount: 2000, date: "Today" },
      { title: "Paid to Priya", amount: -350, date: "Yesterday" },
      { title: "Paid to Canteen", amount: -120, date: "2 days ago" }
    ]
  };
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatMoney(n) {
  return "₹" + Math.abs(n).toLocaleString("en-IN");
}

function addTransaction(title, amount) {
  const state = loadState();
  state.balance += amount;
  state.transactions.unshift({ title: title, amount: amount, date: "Just now" });
  saveState(state);
}

function buildTxnRow(t) {
  const li = document.createElement("li");
  li.className = "txn";
  const sign = t.amount >= 0 ? "+" : "-";
  const cls = t.amount >= 0 ? "credit" : "debit";
  li.innerHTML =
    "<div><strong></strong><small></small></div><span class='" + cls + "'></span>";
  li.querySelector("strong").textContent = t.title;
  li.querySelector("small").textContent = t.date;
  li.querySelector("span").textContent = sign + formatMoney(t.amount);
  return li;
}

// ---------- Home page ----------
const balanceEl = document.getElementById("balance");

if (balanceEl) {
  const recentList = document.getElementById("recentList");
  const state = loadState();
  balanceEl.textContent = formatMoney(state.balance);
  state.transactions.slice(0, 3).forEach((t) => {
    recentList.appendChild(buildTxnRow(t));
  });
}