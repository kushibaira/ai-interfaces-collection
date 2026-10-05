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

// ---------- Send page ----------
const sendBtn = document.getElementById("sendBtn");

if (sendBtn) {
  const sendBalance = document.getElementById("sendBalance");
  const sendAmount = document.getElementById("sendAmount");
  const noteInput = document.getElementById("note");
  const sendMsg = document.getElementById("sendMsg");
  const contactBtns = document.querySelectorAll(".contact");
  let selected = "Arun";

  function showSendBalance() {
    sendBalance.textContent = "Balance: " + formatMoney(loadState().balance);
  }

  contactBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      contactBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selected = btn.dataset.name;
    });
  });

  sendBtn.addEventListener("click", () => {
    const amount = parseInt(sendAmount.value);
    const note = noteInput.value.trim();
    const state = loadState();

    sendMsg.className = "send-msg bad";
    if (!amount || amount <= 0) {
      sendMsg.textContent = "Please enter a valid amount.";
      return;
    }
    if (amount > state.balance) {
      sendMsg.textContent = "Insufficient balance.";
      return;
    }

    let title = "Paid to " + selected;
    if (note !== "") title += " (" + note + ")";
    addTransaction(title, -amount);

    sendMsg.className = "send-msg ok";
    sendMsg.textContent = formatMoney(amount) + " sent to " + selected + " successfully!";
    sendAmount.value = "";
    noteInput.value = "";
    showSendBalance();
  });

  showSendBalance();
}

// ---------- History page ----------
const fullList = document.getElementById("fullList");

if (fullList) {
  const histBalance = document.getElementById("histBalance");
  const totalIn = document.getElementById("totalIn");
  const totalOut = document.getElementById("totalOut");
  const emptyMsg = document.getElementById("emptyMsg");
  const clearBtn = document.getElementById("clearBtn");
  const searchBox = document.getElementById("searchBox");
  const filterBtns = document.querySelectorAll(".filter-btn");
  let currentFilter = "all";

  function renderHistory() {
    const state = loadState();
    histBalance.textContent = "Balance: " + formatMoney(state.balance);

    let totalCredit = 0;
    let totalDebit = 0;
    state.transactions.forEach((t) => {
      if (t.amount >= 0) totalCredit += t.amount;
      else totalDebit += Math.abs(t.amount);
    });
    totalIn.textContent = formatMoney(totalCredit);
    totalOut.textContent = formatMoney(totalDebit);

    const query = searchBox.value.trim().toLowerCase();
    const list = state.transactions.filter((t) => {
      if (currentFilter === "credit" && t.amount < 0) return false;
      if (currentFilter === "debit" && t.amount >= 0) return false;
      return t.title.toLowerCase().includes(query);
    });

    fullList.innerHTML = "";
    list.forEach((t) => fullList.appendChild(buildTxnRow(t)));
    emptyMsg.textContent = list.length === 0 ? "No payments found." : "";
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderHistory();
    });
  });

  searchBox.addEventListener("input", renderHistory);

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
  });

  renderHistory();
}