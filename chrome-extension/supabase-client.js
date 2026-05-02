// Vanilla fetch wrapper for Supabase REST + Auth APIs.
// No npm, no bundler — plain JS.

const sb = {
  // ── Auth ──────────────────────────────────────────────────────────────────

  async sendOtp(email) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
      body: JSON.stringify({ email, create_user: false }),
    });
    if (!res.ok) throw new Error((await res.json()).message || "Failed to send OTP");
  },

  async verifyOtp(email, token) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
      body: JSON.stringify({ email, token, type: "email" }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid code");
    return data; // { access_token, refresh_token, user }
  },

  async getSession() {
    return new Promise((resolve) => {
      chrome.storage.local.get(["ww_session"], (r) => resolve(r.ww_session || null));
    });
  },

  async saveSession(session) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ ww_session: session }, resolve);
    });
  },

  async clearSession() {
    return new Promise((resolve) => {
      chrome.storage.local.remove(["ww_session"], resolve);
    });
  },

  // ── Data ──────────────────────────────────────────────────────────────────

  async checkPlace(city, destinationSlug) {
    const session = await sb.getSession();
    const jwt = session?.access_token;

    // Build filter: match by destination_slug OR city name
    let filter = `status=eq.approved`;
    if (destinationSlug) {
      filter += `&destination_slug=eq.${encodeURIComponent(destinationSlug)}`;
    } else if (city) {
      filter += `&city=ilike.*${encodeURIComponent(city)}*`;
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/beware_reports?${filter}&select=category,severity`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: jwt ? `Bearer ${jwt}` : `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch reports");
    return res.json();
  },

  async submitReport(fields, session) {
    const reporterName = session.user.email.split("@")[0];
    const payload = {
      title: fields.title,
      description: fields.description,
      category: fields.category || null,
      severity: fields.severity || "medium",
      city: fields.city || null,
      location: fields.location || null,
      destination_slug: fields.destination_slug || null,
      reported_by_id: session.user.id,
      reported_by_name: reporterName,
      status: "approved",
      photo_urls: [],
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/beware_reports`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Submit failed");
    }
  },
};
