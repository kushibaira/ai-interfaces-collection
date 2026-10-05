// ---------- Shared wallet data (used by all pages) ----------
const STORAGE_KEY = "mobikwikState";

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) return saved;
  } catch (e) {}
  return {
    balance: 1250,
    transactions: [
      { title: "Added to wallet", amount: 1000, date: "Today" },
      { title: "Electricity bill", amount: -450, date: "Yesterday" },
      { title: "Mobile recharge", amount: -299, date: "2 days ago" }
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
  const addBtn = document.getElementById("addBtn");
  const addAmount = document.getElementById("addAmount");
  const msg = document.getElementById("msg");
  const recentList = document.getElementById("recentList");

  function renderHome() {
    const state = loadState();
    balanceEl.textContent = formatMoney(state.balance);
    recentList.innerHTML = "";
    state.transactions.slice(0, 3).forEach((t) => {
      recentList.appendChild(buildTxnRow(t));
    });
  }

  addBtn.addEventListener("click", () => {
    const amount = parseInt(addAmount.value);
    if (!amount || amount <= 0) {
      msg.textContent = "Please enter a valid amount.";
      return;
    }
    addTransaction("Added to wallet", amount);
    addAmount.value = "";
    msg.textContent = formatMoney(amount) + " added successfully!";
    renderHome();
  });

  renderHome();
}