const $ = (id) => document.getElementById(id);
const fields = ["source", "medium", "campaign", "id", "content", "term"];

function render() {
  const params = {};
  fields.forEach((f) => (params[f] = $(f).value));
  const res = buildUtmUrl($("url").value, params);

  if (res.error) {
    $("out").textContent = "";
    $("err").textContent = $("url").value.trim() ? res.error : "";
    $("copy").disabled = true;
    return;
  }
  $("out").textContent = res.url;
  $("err").textContent = res.missing.length
    ? "Missing: " + res.missing.map((m) => "utm_" + m).join(", ")
    : "";
  $("copy").disabled = res.missing.length > 0;
}

$("copy").addEventListener("click", async () => {
  await navigator.clipboard.writeText($("out").textContent);
  const b = $("copy");
  b.textContent = "Copied!";
  setTimeout(() => (b.textContent = "Copy tagged URL"), 1200);
});

["url", ...fields].forEach((id) => $(id).addEventListener("input", render));

// Prefill with the current tab's link
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const u = tabs && tabs[0] && tabs[0].url;
  if (u && /^https?:\/\//i.test(u)) $("url").value = u;
  render();
  $("campaign").focus();
});
