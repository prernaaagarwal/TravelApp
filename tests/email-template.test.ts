import { describe, it, expect } from "vitest";
import { escapeHtml, buildBody } from "@/lib/email-template";

describe("escapeHtml", () => {
  it("escapes ampersand first to avoid double-escaping", () => {
    expect(escapeHtml("&amp;")).toBe("&amp;amp;");
  });

  it("escapes the five XML special characters", () => {
    expect(escapeHtml("<")).toBe("&lt;");
    expect(escapeHtml(">")).toBe("&gt;");
    expect(escapeHtml('"')).toBe("&quot;");
    expect(escapeHtml("'")).toBe("&#39;");
    expect(escapeHtml("&")).toBe("&amp;");
  });

  it("preserves plain ASCII text", () => {
    expect(escapeHtml("Hello world")).toBe("Hello world");
  });

  it("escapes injection attempts", () => {
    const malicious = '<script>alert("xss")</script>';
    expect(escapeHtml(malicious)).not.toContain("<script>");
    expect(escapeHtml(malicious)).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it("preserves non-ASCII unicode (Hindi, emoji)", () => {
    expect(escapeHtml("भारत 🇮🇳")).toBe("भारत 🇮🇳");
  });

  it("returns empty string for empty input", () => {
    expect(escapeHtml("")).toBe("");
  });
});

describe("buildBody", () => {
  it("includes heading and message", () => {
    const html = buildBody("Welcome!", "Glad to have you.");
    expect(html).toContain("Welcome!");
    expect(html).toContain("Glad to have you.");
  });

  it("renders no CTA block when cta is omitted", () => {
    const html = buildBody("h", "m");
    // The footer still has a link to the site URL, but the CTA button styling is absent
    expect(html).not.toMatch(/background:#1a1510;color:#faf8f4/);
    expect(html).not.toMatch(/View the feed/);
  });

  it("renders CTA block with label and href when provided", () => {
    const html = buildBody("h", "m", { cta: { label: "Click me →", href: "https://x.com/y" } });
    expect(html).toContain("Click me →");
    expect(html).toContain('href="https://x.com/y"');
  });

  it("renders no reason block when reason is omitted", () => {
    const html = buildBody("h", "m");
    expect(html).not.toMatch(/uppercase[^"]*">Reason/);
  });

  it("renders reason block with escaped user-controlled text", () => {
    const html = buildBody("h", "m", { reason: '<script>alert("x")</script>' });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("renders both reason and cta blocks together", () => {
    const html = buildBody("h", "m", {
      reason: "Off topic",
      cta:    { label: "Go", href: "/x" },
    });
    expect(html).toContain("Off topic");
    expect(html).toContain("Go");
  });

  it("does not escape heading or message (callers control these)", () => {
    // The contract is that heading/message come from app-controlled strings,
    // so they're inserted verbatim. Only `reason` is escaped.
    const html = buildBody("<b>Bold</b>", "<i>Italic</i>");
    expect(html).toContain("<b>Bold</b>");
    expect(html).toContain("<i>Italic</i>");
  });
});
