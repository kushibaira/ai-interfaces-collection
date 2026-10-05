// ---------- Login page ----------
const loginBtn = document.getElementById("loginBtn");
const createBtn = document.getElementById("createBtn");

if (loginBtn) {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorEl = document.getElementById("error");

  loginBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === "" || password === "") {
      errorEl.textContent = "Please enter your email and password.";
      return;
    }

    // Demo only: any email and password works
    errorEl.textContent = "";
    window.location.href = "feed.html";
  });

  createBtn.addEventListener("click", () => {
    errorEl.textContent = "Sign up is not available in this demo.";
  });
}