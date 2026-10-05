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

// ---------- Recharge page ----------
const payBtn = document.getElementById("payBtn");

if (payBtn) {
  const topBalance = document.getElementById("topBalance");
  const numberInput = document.getElementById("number");
  const payAmount = document.getElementById("payAmount");
  const payMsg = document.getElementById("payMsg");
  const typeBtns = document.querySelectorAll(".type-btn");
  let payType = "Mobile recharge";

  function showBalance() {
    topBalance.textContent = "Balance: " + formatMoney(loadState().balance);
  }

  typeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      typeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      payType = btn.dataset.type;
    });
  });

  document.querySelectorAll(".amt-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      payAmount.value = chip.dataset.amt;
    });
  });

  payBtn.addEventListener("click", () => {
    const number = numberInput.value.trim();
    const amount = parseInt(payAmount.value);
    const state = loadState();

    payMsg.className = "pay-msg bad";
    if (number === "") {
      payMsg.textContent = "Please enter a number or consumer ID.";
      return;
    }
    if (!amount || amount <= 0) {
      payMsg.textContent = "Please enter a valid amount.";
      return;
    }
    if (amount > state.balance) {
      payMsg.textContent = "Not enough balance. Add money on the Home page.";
      return;
    }

    addTransaction(payType + " (" + number + ")", -amount);
    payMsg.className = "pay-msg ok";
    payMsg.textContent = "Payment of " + formatMoney(amount) + " successful!";
    numberInput.value = "";
    payAmount.value = "";
    showBalance();
  });

  showBalance();
}