// Pure logic: takes a link + UTM values, returns the tagged link.
function buildUtmUrl(raw, params) {
  raw = (raw || "").trim();
  if (!raw) return { error: "Paste a link" };
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) raw = "https://" + raw;

  let url;
  try {
    url = new URL(raw);
  } catch (e) {
    return { error: "That doesn't look like a valid link" };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { error: "Only http(s) links can be tagged" };
  }

  const keys = ["source", "medium", "campaign", "id", "content", "term"];
  for (const k of keys) {
    const key = "utm_" + k;
    const val = ((params && params[k]) || "").trim();
    if (val) url.searchParams.set(key, val);
    else url.searchParams.delete(key);
  }

  const missing = ["source", "medium", "campaign"].filter(
    (k) => !((params && params[k]) || "").trim()
  );
  return { url: url.toString(), missing };
}

if (typeof module !== "undefined") module.exports = { buildUtmUrl };
