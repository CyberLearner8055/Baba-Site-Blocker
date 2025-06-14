document.addEventListener("DOMContentLoaded", () => {
  const loginView = document.getElementById("loginView");
  const mainView = document.getElementById("mainView");
  const loginInput = document.getElementById("loginPass");
  const loginBtn = document.getElementById("loginBtn");
  const loginError = document.getElementById("loginError");

  // Check password or setup first time
  chrome.storage.local.get(["password"], (result) => {
    const savedPass = result.password;

    if (!savedPass) {
      const newPass = prompt("Set your extension password:");
      if (newPass && newPass.trim()) {
        chrome.storage.local.set({ password: newPass.trim() }, () => {
          showMainUI();
        });
      } else {
        alert("Password is required to use the extension.");
      }
    } else {
      loginBtn.onclick = () => {
        const entered = loginInput.value.trim();
        if (entered === savedPass) {
          showMainUI();
        } else {
          loginError.style.display = "block";
        }
      };
    }
  });

  function showMainUI() {
    loginView.classList.add("hidden");
    mainView.classList.remove("hidden");
    initBlockerUI();
  }

  function initBlockerUI() {
    const input = document.getElementById("siteInput");
    const button = document.getElementById("addBtn");
    const list = document.getElementById("siteList");

    function updateUI(sites) {
      list.innerHTML = "";
      sites.forEach((site, i) => {
        const li = document.createElement("li");
        li.textContent = site;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "remove-btn";
        removeBtn.onclick = () => {
          sites.splice(i, 1);
          chrome.storage.local.set({ blockedSites: sites }, () => updateUI(sites));
        };

        li.appendChild(removeBtn);
        list.appendChild(li);
      });
    }

    button.onclick = () => {
      const site = input.value.trim();
      if (!site) return;

      chrome.storage.local.get(["blockedSites"], (result) => {
        const sites = result.blockedSites || [];
        if (!sites.includes(site)) {
          sites.push(site);
          chrome.storage.local.set({ blockedSites: sites }, () => updateUI(sites));
        }
      });

      input.value = "";
    };

    chrome.storage.local.get(["blockedSites"], (result) => {
      updateUI(result.blockedSites || []);
    });
  }
});
