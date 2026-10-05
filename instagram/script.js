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

// ---------- Feed page ----------
const posts = document.querySelectorAll(".ig-post");

posts.forEach((post) => {
  const heart = post.querySelector(".heart-btn");
  const count = post.querySelector(".like-count");
  const save = post.querySelector(".save-btn");
  const cmtBtn = post.querySelector(".cmt-btn");
  const cmtInput = post.querySelector(".cmt-input");
  const comments = post.querySelector(".comments");

  // Like toggle
  heart.addEventListener("click", () => {
    let n = parseInt(count.textContent);
    if (heart.classList.contains("liked")) {
      heart.classList.remove("liked");
      heart.textContent = "♡";
      count.textContent = n - 1;
    } else {
      heart.classList.add("liked");
      heart.textContent = "♥";
      count.textContent = n + 1;
    }
  });

  // Save toggle
  save.addEventListener("click", () => {
    save.textContent = save.textContent === "🔖" ? "📑" : "🔖";
  });

  // Comment icon focuses the input
  cmtBtn.addEventListener("click", () => cmtInput.focus());

  // Add a comment
  cmtInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && cmtInput.value.trim() !== "") {
      const user = localStorage.getItem("igUser") || "you";
      const line = document.createElement("p");
      line.className = "comment-line";
      const name = document.createElement("strong");
      name.textContent = user + " ";
      line.appendChild(name);
      line.appendChild(document.createTextNode(cmtInput.value.trim()));
      comments.appendChild(line);
      cmtInput.value = "";
    }
  });
});