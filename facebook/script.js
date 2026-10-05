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

// ---------- Feed page ----------
const postBtn = document.getElementById("postBtn");
const postsEl = document.getElementById("posts");

// Like button toggles on every post
function setupLike(btn) {
  btn.addEventListener("click", () => {
    const count = btn.querySelector(".count");
    let n = parseInt(count.textContent);
    if (btn.classList.contains("liked")) {
      btn.classList.remove("liked");
      count.textContent = n - 1;
    } else {
      btn.classList.add("liked");
      count.textContent = n + 1;
    }
  });
}

// Comment button opens a comment box
function setupComment(btn) {
  btn.addEventListener("click", () => {
    const post = btn.closest(".post");
    const box = post.querySelector(".comment-box");
    box.classList.toggle("open");

    if (!box.querySelector("input")) {
      const input = document.createElement("input");
      input.placeholder = "Write a comment and press Enter...";
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && input.value.trim() !== "") {
          const item = document.createElement("div");
          item.className = "comment-item";
          item.textContent = input.value.trim();
          box.appendChild(item);
          input.value = "";
        }
      });
      box.prepend(input);
    }
  });
}

if (postsEl) {
  document.querySelectorAll(".like-btn").forEach(setupLike);
  document.querySelectorAll(".comment-btn").forEach(setupComment);

  // Create a new post
  postBtn.addEventListener("click", () => {
    const input = document.getElementById("postInput");
    const text = input.value.trim();
    if (text === "") return;

    const article = document.createElement("article");
    article.className = "card post";
    article.innerHTML =
      '<div class="post-head"><div class="avatar">Y</div>' +
      '<div><strong>You</strong><span class="time">Just now</span></div></div>' +
      "<p></p>" +
      '<div class="post-actions">' +
      '<button class="like-btn">👍 Like <span class="count">0</span></button>' +
      '<button class="comment-btn">💬 Comment</button>' +
      "<button>↗ Share</button></div>" +
      '<div class="comment-box"></div>';

    article.querySelector("p").textContent = text;
    postsEl.prepend(article);
    setupLike(article.querySelector(".like-btn"));
    setupComment(article.querySelector(".comment-btn"));
    input.value = "";
  });
}

// ---------- Profile page ----------
const tabButtons = document.querySelectorAll(".tab");
const followBtn = document.getElementById("followBtn");

if (tabButtons.length > 0) {
  // Switch tabs
  tabButtons.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabButtons.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll(".tab-content").forEach((c) => {
        c.classList.add("hidden");
      });
      document.getElementById("tab-" + tab.dataset.tab).classList.remove("hidden");
    });
  });

  // Add friend button
  const friendCount = document.getElementById("friendCount");
  let added = false;

  followBtn.addEventListener("click", () => {
    added = !added;
    followBtn.classList.toggle("added", added);
    followBtn.textContent = added ? "Friends ✓" : "Add friend";
    friendCount.textContent = added ? "249 friends" : "248 friends";
  });
}