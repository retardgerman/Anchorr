document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("config-form");
  const botControlBtn = document.getElementById("bot-control-btn");
  const botControlText = document.getElementById("bot-control-text");
  const botControlIcon = botControlBtn.querySelector("i");
  const webhookSection = document.getElementById("webhook-section");
  const webhookUrlElement = document.getElementById("webhook-url");
  const copyWebhookBtn = document.getElementById("copy-webhook-btn");
  const navItems = document.querySelectorAll(".nav-item, .about-button");
  const testJellyseerrBtn = document.getElementById("test-jellyseerr-btn");
  const testJellyseerrStatus = document.getElementById(
    "test-jellyseerr-status"
  );
  const testJellyfinBtn = document.getElementById("test-jellyfin-btn");
  const testJellyfinStatus = document.getElementById("test-jellyfin-status");
  const fetchLibrariesBtn = document.getElementById("fetch-libraries-btn");
  const fetchLibrariesStatus = document.getElementById("fetch-libraries-status");
  const librariesContainer = document.getElementById("libraries-container");
  const librariesList = document.getElementById("libraries-list");
  
  // Create toast element dynamically
  const toast = document.createElement("div");
  toast.id = "toast";
  toast.className = "toast";
  document.body.appendChild(toast);
  
  // Store fetched libraries
  let availableLibraries = [];

  // --- Functions ---

  function showToast(message, duration = 3000) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
  }

  async function fetchConfig() {
    try {
      const response = await fetch("/api/config");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const config = await response.json();
      
      // Store config temporarily for library filtering
      localStorage.setItem("tempConfig", JSON.stringify(config));
      
      for (const key in config) {
        const input = document.getElementById(key);
        if (!input) continue;
        if (input.type === "checkbox") {
          const val = String(config[key]).trim().toLowerCase();
          input.checked = val === "true" || val === "1" || val === "yes";
        } else {
          input.value = config[key];
        }
      }
      
      // If libraries are already loaded, update their checkboxes with config values
      if (availableLibraries.length > 0) {
        displayLibraries();
      }
      
      updateWebhookUrl();
    } catch (error) {
      console.error("Error fetching config:", error);
      showToast("Error fetching configuration.");
    }
  }

  async function fetchStatus() {
    try {
      const response = await fetch("/api/status");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const status = await response.json();
      updateStatusIndicator(status.isBotRunning, status.botUsername);
    } catch (error) {
      console.error("Error fetching status:", error);
      updateStatusIndicator(false);
    }
  }

  function updateStatusIndicator(isRunning, username = null) {
    botControlBtn.disabled = false;
    if (isRunning) {
      botControlBtn.classList.remove("btn-success");
      botControlBtn.classList.add("btn-danger");
      botControlIcon.className = "bi bi-pause-fill";
      botControlText.textContent = "Stop Bot";
      botControlBtn.dataset.action = "stop";
    } else {
      botControlBtn.classList.remove("btn-danger");
      botControlBtn.classList.add("btn-success");
      botControlIcon.className = "bi bi-play-fill";
      botControlText.textContent = "Start Bot";
      botControlBtn.dataset.action = "start";
    }
  }

  function updateWebhookUrl() {
    const portInput = document.getElementById("WEBHOOK_PORT");
    if (!portInput) return;

    const port = portInput.value || 8282;
    // Use `window.location.hostname` which is more reliable than guessing the host IP.
    // This works well for localhost and for accessing via a local network IP.
    const host = window.location.hostname;
    webhookUrlElement.textContent = `http://${host}:${port}/jellyfin-webhook`;
  }

  // Fetch available Jellyfin libraries
  async function fetchJellyfinLibraries() {
    fetchLibrariesBtn.disabled = true;
    fetchLibrariesStatus.textContent = "Loading...";
    fetchLibrariesStatus.style.color = "var(--text)";

    try {
      const response = await fetch("/api/jellyfin-libraries");
      const result = await response.json();

      if (response.ok && result.success) {
        availableLibraries = result.libraries;
        displayLibraries();
        fetchLibrariesStatus.textContent = `Found ${availableLibraries.length} libraries`;
        fetchLibrariesStatus.style.color = "var(--green)";
      } else {
        throw new Error(result.message || "Failed to fetch libraries");
      }
    } catch (error) {
      fetchLibrariesStatus.textContent = error.message || "Failed to load libraries";
      fetchLibrariesStatus.style.color = "#f38ba8"; // Red
      console.error("Error fetching libraries:", error);
    } finally {
      fetchLibrariesBtn.disabled = false;
    }
  }

  // Display library checkboxes
  function displayLibraries() {
    if (availableLibraries.length === 0) {
      librariesContainer.style.display = "none";
      return;
    }

    // Get currently excluded libraries from config
    const excludedLibraries = getExcludedLibraries();

    librariesList.innerHTML = "";
    librariesContainer.style.display = "block";

    availableLibraries.forEach((library) => {
      const checkboxWrapper = document.createElement("div");
      checkboxWrapper.style.cssText = "display: flex; align-items: center; gap: 0.5rem;";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `lib-${library.id}`;
      checkbox.value = library.name;
      checkbox.className = "library-checkbox";
      // Check if this library is in the excluded list
      checkbox.checked = excludedLibraries.includes(library.name);

      const label = document.createElement("label");
      label.htmlFor = `lib-${library.id}`;
      label.textContent = library.name;
      label.style.cursor = "pointer";

      checkboxWrapper.appendChild(checkbox);
      checkboxWrapper.appendChild(label);
      librariesList.appendChild(checkboxWrapper);
    });
  }

  // Get excluded libraries from config (helper function)
  function getExcludedLibraries() {
    try {
      const config = JSON.parse(localStorage.getItem("tempConfig") || "{}");
      if (Array.isArray(config.EXCLUDED_JELLYFIN_LIBRARIES)) {
        return config.EXCLUDED_JELLYFIN_LIBRARIES;
      }
    } catch (e) {
      console.error("Error parsing excluded libraries:", e);
    }
    return [];
  }

  // --- Event Listeners ---

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const config = Object.fromEntries(formData.entries());
    
    // Explicitly capture checkbox values as "true"/"false" (excluding library checkboxes)
    document.querySelectorAll('input[type="checkbox"]:not(.library-checkbox)').forEach((cb) => {
      config[cb.id] = cb.checked ? "true" : "false";
    });

    // Collect excluded libraries from checkboxes
    const excludedLibraries = [];
    document.querySelectorAll('.library-checkbox:checked').forEach((cb) => {
      excludedLibraries.push(cb.value);
    });
    config.EXCLUDED_JELLYFIN_LIBRARIES = excludedLibraries;

    try {
      const response = await fetch("/api/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const result = await response.json();
      showToast(result.message);
      // Update local storage with new config
      localStorage.setItem("tempConfig", JSON.stringify(config));
    } catch (error) {
      console.error("Error saving config:", error);
      showToast("Error saving configuration.");
    }
  });

  botControlBtn.addEventListener("click", async () => {
    const action = botControlBtn.dataset.action;
    if (!action) return;

    botControlBtn.disabled = true;
    const originalText = botControlText.textContent;
    botControlText.textContent = "Processing...";

    try {
      const response = await fetch(`/api/${action}-bot`, { method: "POST" });
      const result = await response.json();
      if (!response.ok) {
        showToast(`Error: ${result.message}`);
        botControlText.textContent = originalText; // Restore text on failure
        botControlBtn.disabled = false;
      } else {
        showToast(result.message);
        setTimeout(fetchStatus, 1000); // Fetch status after a short delay to get the new state
      }
    } catch (error) {
      console.error(`Error with ${action} action:`, error);
      showToast(`Failed to ${action} bot.`);
      botControlText.textContent = originalText; // Restore text on failure
      botControlBtn.disabled = false;
    }
  });

  // Handle navigation between config panes
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      // Update active nav item
      navItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      // Show the correct pane
      const targetId = item.getAttribute("data-target");
      document.querySelectorAll(".config-pane").forEach((pane) => {
        pane.classList.remove("active");
      });
      document
        .getElementById(`config-pane-${targetId}`)
        .classList.add("active");
    });
  });

  // Update webhook URL when port changes
  const portInput = document.getElementById("WEBHOOK_PORT");
  if (portInput) {
    portInput.addEventListener("input", updateWebhookUrl);
  }

  // Copy webhook URL
  copyWebhookBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(webhookUrlElement.textContent);
    showToast("Webhook URL copied to clipboard!");
  });

  // Fetch Jellyfin libraries
  if (fetchLibrariesBtn) {
    fetchLibrariesBtn.addEventListener("click", fetchJellyfinLibraries);
  }

  // Test Jellyseerr Connection
  if (testJellyseerrBtn) {
    testJellyseerrBtn.addEventListener("click", async () => {
      const url = document.getElementById("JELLYSEERR_URL").value;
      const apiKey = document.getElementById("JELLYSEERR_API_KEY").value;

      testJellyseerrBtn.disabled = true;
      testJellyseerrStatus.textContent = "Testing...";
      testJellyseerrStatus.style.color = "var(--text)";

      try {
        const response = await fetch("/api/test-jellyseerr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, apiKey }),
        });

        const result = await response.json();

        if (response.ok) {
          testJellyseerrStatus.textContent = result.message;
          testJellyseerrStatus.style.color = "var(--green)";
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        testJellyseerrStatus.textContent =
          error.message || "Connection failed.";
        testJellyseerrStatus.style.color = "#f38ba8"; // Red
      } finally {
        testJellyseerrBtn.disabled = false;
      }
    });
  }

  // Test Jellyfin Endpoint
  if (testJellyfinBtn) {
    testJellyfinBtn.addEventListener("click", async () => {
      const url = document.getElementById("JELLYFIN_BASE_URL").value;

      testJellyfinBtn.disabled = true;
      testJellyfinStatus.textContent = "Testing...";
      testJellyfinStatus.style.color = "var(--text)";

      try {
        const response = await fetch("/api/test-jellyfin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const result = await response.json();

        if (response.ok) {
          testJellyfinStatus.textContent = result.message;
          testJellyfinStatus.style.color = "var(--green)";
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        testJellyfinStatus.textContent =
          error.message || "Endpoint test failed.";
        testJellyfinStatus.style.color = "#f38ba8"; // Red
      } finally {
        testJellyfinBtn.disabled = false;
      }
    });
  }

  // --- Initial Load ---
  fetchConfig();
  fetchStatus();
  setInterval(fetchStatus, 10000); // Poll status every 10 seconds
});
