// ---------- Login page ----------
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorEl = document.getElementById("error");

  loginBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "" || password === "") {
      errorEl.textContent = "Please enter your username and password.";
      return;
    }
    if (password.length < 4) {
      errorEl.textContent = "Password must be at least 4 characters.";
      return;
    }

    // Demo only: any username and password works
    errorEl.textContent = "";
    localStorage.setItem("igUser", username);
    window.location.href = "feed.html";
  });

  document.getElementById("signupLink").addEventListener("click", (e) => {
    e.preventDefault();
    errorEl.textContent = "Sign up is not available in this demo.";
  });
}