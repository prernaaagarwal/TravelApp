const app = document.getElementById("app");
let session = null;
let pageData = null;

// ── Boot ──────────────────────────────────────────────────────────────────────

async function boot() {
  session = await sb.getSession();
  if (!session) { renderLogin(); return; }
  pageData = await extractPage();
  renderHome();
}

async function extractPage() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractPageData,
    });
    return result;
  } catch {
    return { placeName: "", city: "", platformCategory: "Other", descSeed: "", destinationSlug: "", pageUrl: "" };
  }
}

// Runs inside the page — no closure variables allowed
function extractPageData() {
  function getMeta(name) {
    const el = document.querySelector(`meta[property="${name}"]`) || document.querySelector(`meta[name="${name}"]`);
    return el?.content?.trim() || "";
  }
  function getText(selectors) {
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el?.textContent?.trim()) return el.textContent.trim();
    }
    return "";
  }

  const placeName =
    getMeta("og:title") ||
    getText(["h1", ".property-name", '[data-testid="property-header-title"]']) ||
    document.title.split(/[|\-–]/)[0].trim();

  const breadcrumbs = Array.from(
    document.querySelectorAll(".breadcrumbs a, nav[aria-label] a, .bui-breadcrumb a, [data-testid='breadcrumb'] a")
  ).map(el => el.textContent.trim());

  const city =
    breadcrumbs[breadcrumbs.length - 2] ||
    getMeta("og:locality") ||
    window.location.pathname.split("/").filter(p => p.length > 3 && !/^\d+$/.test(p) && !["hotel","attraction","en-gb","en-us"].includes(p))[0] || "";

  const descSeed = getText([
    ".review-container .entry", '[data-testid="review-title"]',
    ".bui-review-title", "article p", ".description",
  ]).slice(0, 400);

  const host = window.location.hostname;
  let platformCategory = "Other";
  if (host.includes("booking.com") || host.includes("airbnb") || host.includes("hostelworld")) platformCategory = "Accommodation";
  else if (host.includes("tripadvisor") || host.includes("yelp")) platformCategory = "Food & drink";
  else if (host.includes("maps.google") || host.includes("maps.app.goo")) platformCategory = "Street / market";

  const KNOWN_SUFFIXES = ["india","japan","thailand","vietnam","uae","france","indonesia","portugal","spain","italy","greece","singapore","malaysia","nepal","cambodia","myanmar","philippines"];
  const citySlug = city.toLowerCase().replace(/\s+/g, "-");
  let destinationSlug = "";
  const fullText = window.location.href.toLowerCase() + " " + breadcrumbs.join(" ").toLowerCase();
  for (const suffix of KNOWN_SUFFIXES) {
    if (fullText.includes(suffix)) { destinationSlug = `${citySlug}-${suffix}`; break; }
  }

  return { placeName, city, platformCategory, descSeed, destinationSlug, pageUrl: window.location.href };
}

// ── Render: Login ─────────────────────────────────────────────────────────────

function renderLogin() {
  app.innerHTML = `
    <div class="header"><span class="header-logo">Wander Women</span></div>
    <div class="body">
      <div class="login-title">Sign in</div>
      <div class="login-sub">Enter your WW email — we'll send a code</div>
      <div id="login-step-1">
        <label>Email</label>
        <input id="email-input" type="email" placeholder="you@email.com" />
        <button class="btn btn-primary" id="send-btn">Send code</button>
        <div class="error" id="login-err"></div>
      </div>
      <div id="login-step-2" style="display:none">
        <label>6-digit code from your inbox</label>
        <input id="otp-input" type="text" maxlength="6" placeholder="123456" />
        <button class="btn btn-primary" id="verify-btn">Verify</button>
        <button class="btn btn-ghost" id="back-btn">← Back</button>
        <div class="error" id="otp-err"></div>
      </div>
    </div>`;

  let email = "";

  document.getElementById("send-btn").onclick = async () => {
    email = document.getElementById("email-input").value.trim();
    if (!email) return;
    const btn = document.getElementById("send-btn");
    btn.disabled = true; btn.textContent = "Sending…";
    try {
      await sb.sendOtp(email);
      document.getElementById("login-step-1").style.display = "none";
      document.getElementById("login-step-2").style.display = "block";
    } catch (e) {
      document.getElementById("login-err").textContent = e.message;
      btn.disabled = false; btn.textContent = "Send code";
    }
  };

  document.getElementById("back-btn").onclick = () => {
    document.getElementById("login-step-1").style.display = "block";
    document.getElementById("login-step-2").style.display = "none";
  };

  document.getElementById("verify-btn").onclick = async () => {
    const token = document.getElementById("otp-input").value.trim();
    if (!token) return;
    const btn = document.getElementById("verify-btn");
    btn.disabled = true; btn.textContent = "Verifying…";
    try {
      const data = await sb.verifyOtp(email, token);
      session = { access_token: data.access_token, refresh_token: data.refresh_token, user: data.user };
      await sb.saveSession(session);
      pageData = await extractPage();
      renderHome();
    } catch (e) {
      document.getElementById("otp-err").textContent = e.message;
      btn.disabled = false; btn.textContent = "Verify";
    }
  };
}

// ── Render: Home ──────────────────────────────────────────────────────────────

function renderHome() {
  const initial = (session.user.email || "W")[0].toUpperCase();
  const name = pageData?.placeName || "this page";
  const url = pageData?.pageUrl || "";

  app.innerHTML = `
    <div class="header">
      <span class="header-logo">Wander Women</span>
      <div class="header-user">
        <div class="avatar">${initial}</div>
        <button class="signout-btn" id="signout-btn">Sign out</button>
      </div>
    </div>
    <div class="body">
      <div class="home-place">${name.slice(0, 60)}</div>
      <div class="home-url">${url.slice(0, 55)}…</div>
      <div class="home-actions">
        <button class="btn btn-primary" id="check-btn">🔍 Check safety reports</button>
        <button class="btn btn-secondary" id="report-btn">＋ Report this place</button>
      </div>
    </div>`;

  document.getElementById("signout-btn").onclick = async () => {
    await sb.clearSession(); session = null; renderLogin();
  };
  document.getElementById("check-btn").onclick = () => renderCheck();
  document.getElementById("report-btn").onclick = () => renderReport();
}

// ── Render: Check ─────────────────────────────────────────────────────────────

async function renderCheck() {
  const initial = (session.user.email || "W")[0].toUpperCase();
  app.innerHTML = `
    <div class="header">
      <span class="header-logo">Wander Women</span>
      <div class="header-user"><div class="avatar">${initial}</div></div>
    </div>
    <div class="body">
      <div class="check-title">Checking reports…</div>
    </div>`;

  try {
    const reports = await sb.checkPlace(pageData?.city, pageData?.destinationSlug);
    const counts = {};
    for (const r of reports) {
      const k = (r.category || "other").toLowerCase();
      counts[k] = (counts[k] || 0) + 1;
    }
    const total = reports.length;

    const tagsHtml = total === 0
      ? `<div class="tag tag-none">No reports found</div>`
      : Object.entries(counts).map(([k, n]) => {
          const cls = ["accommodation","stay"].includes(k) ? "tag-stay"
            : k.includes("transport") ? "tag-transport"
            : k.includes("food") || k.includes("street") ? "tag-scam"
            : "tag-scam";
          return `<div class="tag ${cls}">${k} · ${n}</div>`;
        }).join("");

    const msgHtml = total === 0
      ? `<div class="safe-msg">✓ No reports for this place yet.</div>`
      : `<div class="warn-msg">⚠ ${total} report${total > 1 ? "s" : ""} found — read before you go.</div>`;

    app.innerHTML = `
      <div class="header">
        <span class="header-logo">Wander Women</span>
        <div class="header-user"><div class="avatar">${initial}</div></div>
      </div>
      <div class="body">
        <div class="check-title">${(pageData?.placeName || "This place").slice(0, 50)}</div>
        ${msgHtml}
        <div class="report-count">${tagsHtml}</div>
        <hr class="divider" />
        <button class="btn btn-secondary" id="back-btn">← Back</button>
        <button class="btn btn-primary" id="report-btn">＋ Report this place</button>
      </div>`;

    document.getElementById("back-btn").onclick = renderHome;
    document.getElementById("report-btn").onclick = renderReport;
  } catch (e) {
    app.querySelector(".check-title").textContent = "Error: " + e.message;
  }
}

// ── Render: Report form ───────────────────────────────────────────────────────

function renderReport() {
  const initial = (session.user.email || "W")[0].toUpperCase();
  const p = pageData || {};

  const CATEGORIES = ["Accommodation", "Transport", "Food & drink", "Street / market", "Temple / attraction", "Online", "Other"];

  app.innerHTML = `
    <div class="header">
      <span class="header-logo">Wander Women</span>
      <div class="header-user"><div class="avatar">${initial}</div></div>
    </div>
    <div class="body" style="padding-bottom:16px">
      <label>Title <span style="color:var(--rust)">*</span></label>
      <input id="f-title" type="text" maxlength="200" value="${esc(p.placeName || "")}" placeholder="e.g. Fake taxi at airport" />

      <label>What happened <span style="color:var(--rust)">*</span></label>
      <textarea id="f-desc" placeholder="Describe what happened in detail…">${esc(p.descSeed || "")}</textarea>

      <label>City</label>
      <input id="f-city" type="text" value="${esc(p.city || "")}" placeholder="e.g. Goa" />

      <label>Specific location</label>
      <input id="f-location" type="text" placeholder="e.g. Dabolim Airport exit" />

      <label>Destination slug</label>
      <input id="f-slug" type="text" value="${esc(p.destinationSlug || "")}" placeholder="e.g. goa-india" />

      <label>Category</label>
      <select id="f-category">
        ${CATEGORIES.map(c => `<option value="${c}" ${c === p.platformCategory ? "selected" : ""}>${c}</option>`).join("")}
      </select>

      <label>Severity</label>
      <div class="radio-group">
        <label><input type="radio" name="severity" value="low" /> Low</label>
        <label><input type="radio" name="severity" value="medium" checked /> Medium</label>
        <label><input type="radio" name="severity" value="high" /> High</label>
        <label><input type="radio" name="severity" value="critical" /> Critical</label>
      </div>

      <div class="error" id="form-err"></div>
      <button class="btn btn-primary" id="submit-btn">Submit report</button>
      <button class="btn btn-ghost" id="back-btn">← Back</button>
    </div>`;

  document.getElementById("back-btn").onclick = renderHome;

  document.getElementById("submit-btn").onclick = async () => {
    const title = document.getElementById("f-title").value.trim();
    const desc = document.getElementById("f-desc").value.trim();
    const errEl = document.getElementById("form-err");

    if (title.length < 3) { errEl.textContent = "Title too short (min 3 chars)"; return; }
    if (desc.length < 10) { errEl.textContent = "Description too short (min 10 chars)"; return; }

    const btn = document.getElementById("submit-btn");
    btn.disabled = true; btn.textContent = "Submitting…";
    errEl.textContent = "";

    try {
      await sb.submitReport({
        title,
        description: desc,
        city: document.getElementById("f-city").value.trim(),
        location: document.getElementById("f-location").value.trim(),
        destination_slug: document.getElementById("f-slug").value.trim(),
        category: document.getElementById("f-category").value,
        severity: document.querySelector('input[name="severity"]:checked')?.value || "medium",
      }, session);
      renderSuccess();
    } catch (e) {
      errEl.textContent = e.message;
      btn.disabled = false; btn.textContent = "Submit report";
    }
  };
}

// ── Render: Success ───────────────────────────────────────────────────────────

function renderSuccess() {
  app.innerHTML = `
    <div class="header"><span class="header-logo">Wander Women</span></div>
    <div class="body" style="text-align:center;padding:24px 14px">
      <span class="success-icon">✓</span>
      <div style="font-family:Georgia,serif;font-size:16px;margin-bottom:8px">Report submitted</div>
      <div style="color:var(--muted);font-size:10px;margin-bottom:20px">It's live on the beware map now.</div>
      <button class="btn btn-secondary" id="home-btn">← Back to home</button>
    </div>`;
  document.getElementById("home-btn").onclick = renderHome;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function esc(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

// ── Start ─────────────────────────────────────────────────────────────────────
boot();
