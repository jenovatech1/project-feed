// =================== I18N & PREFS ===================
const i18n = {
  id: {
    search_placeholder: "Cari…",
    prefs: "Preferensi",
    language: "Bahasa",
    currency: "Mata uang",
    apply: "Terapkan",
    cancel: "Batal",
    loading: "Memuat…",
    filtering: "Menyaring…",
    sorting: "Mengurutkan…",
    searching: "Mencari…",
    loading_details: "Memuat detail…",
    all_chains: "Semua chain",
    sort_delta7d: "Δ7H",
    sort_tvl: "TVL",
    sort_fees24h: "Fees 24J",
    sort_revenue24h: "Revenue 24J",
    sort_pricechg: "Δ Harga 24J",
    tvl: "TVL",
    tvl_7d: "TVL Δ 7H",
    price: "Harga",
    price_chg_24h: "Δ Harga 24J",
    fees_24h: "Fees 24J",
    revenue_24h: "Revenue 24J",
    no_token: "Tidak ada token",
    detail: "Lihat detail",
    website: "Website",
    view_llama: "Lihat di DeFiLlama",
    source_note:
      'Sumber: <a href="https://defillama.com" target="_blank" rel="noopener">DeFiLlama</a> (TVL & Fees/Revenue), <a href="https://www.coingecko.com" target="_blank" rel="noopener">CoinGecko</a> (harga/market data). Bukan nasihat investasi.',
    no_data: "Tidak ada protokol.",
    removed_watch: "Dihapus dari Watchlist",
    saved_watch: "Tersimpan ke Watchlist",
    fx_fail: "Gagal ambil kurs; ditampilkan USD",
    github: "GitHub",
    stars: "Stars",
    forks: "Forks",
    last_push: "Push terakhir",
    market_data: "Data Pasar (CoinGecko)",
    mcap: "Market Cap",
    fdv: "FDV",
    ath: "ATH",
    atl: "ATL",
    has_any: "Semua",
    has_token: "Hanya yang punya Token",
    has_fees: "Hanya yang punya Fees",
    has_revenue: "Hanya yang punya Revenue",
    sort_label: "Urut: ",
  },
  en: {
    search_placeholder: "Search…",
    prefs: "Preferences",
    language: "Language",
    currency: "Currency",
    apply: "Apply",
    cancel: "Cancel",
    loading: "Loading…",
    filtering: "Filtering…",
    sorting: "Sorting…",
    searching: "Searching…",
    loading_details: "Loading details…",
    all_chains: "All chains",
    sort_delta7d: "Δ7D",
    sort_tvl: "TVL",
    sort_fees24h: "Fees 24H",
    sort_revenue24h: "Revenue 24H",
    sort_pricechg: "Δ Price 24H",
    tvl: "TVL",
    tvl_7d: "TVL Δ 7D",
    price: "Price",
    price_chg_24h: "Δ Price 24H",
    fees_24h: "Fees 24H",
    revenue_24h: "Revenue 24H",
    no_token: "No token",
    detail: "Details",
    website: "Website",
    view_llama: "View on DeFiLlama",
    source_note:
      'Source: <a href="https://defillama.com" target="_blank" rel="noopener">DeFiLlama</a> (TVL & Fees/Revenue), <a href="https://www.coingecko.com" target="_blank" rel="noopener">CoinGecko</a> (prices/market data). Not financial advice.',
    no_data: "No data.",
    removed_watch: "Removed from Watchlist",
    saved_watch: "Saved to Watchlist",
    fx_fail: "Failed to fetch FX; showing USD",
    github: "GitHub",
    stars: "Stars",
    forks: "Forks",
    last_push: "Last push",
    market_data: "Market Data (CoinGecko)",
    mcap: "Market Cap",
    fdv: "FDV",
    ath: "ATH",
    atl: "ATL",
    has_any: "All",
    has_token: "Only with Token",
    has_fees: "Only with Fees",
    has_revenue: "Only with Revenue",
    sort_label: "Sort: ",
  },
};
const t = (k) => i18n[state.pref.lang]?.[k] || i18n.en?.[k] || k;

const state = {
  pref: {
    lang: localStorage.getItem("pref_lang") || ((navigator.language || "").toLowerCase().startsWith("id") ? "id" : "en"),
    ccy: localStorage.getItem("pref_ccy") || ((navigator.language || "").toLowerCase().startsWith("id") ? "IDR" : "USD"),
  },
  fx: { rate: 0, ts: 0 },
  protocolsRaw: [],
  protocols: [],
  page: 0,
  pageSize: 12,
  sortKey: "chg7d",
  hasKey: "any",
  watchlist: new Set(JSON.parse(localStorage.getItem("watchlist_v1") || "[]")),
  priceNow: new Map(),
  priceChg: new Map(),
  tokenKeys: new Map(),
  feesOverview: new Map(),
  nameToSlug: new Map(),
  chainFilter: "",
  searchQuery: "",
};

// ===== Currency / utils
const nfUSD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
function formatUSD(v) {
  if (v == null || !isFinite(v)) return "—";
  const n = Number(v);
  if (Math.abs(n) >= 1) return nfUSD.format(n);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 6 }).format(n);
}
function formatIDRraw(v) {
  if (v == null || !isFinite(v)) return "—";
  const n = Number(v);
  const opts = { style: "currency", currency: "IDR", maximumFractionDigits: Math.abs(n) >= 1000 ? 0 : 2 };
  return new Intl.NumberFormat("id-ID", opts).format(n);
}
function formatMoney(usd) {
  if (usd == null || !isFinite(usd)) return "—";
  if (state.pref.ccy === "USD" || !state.fx.rate) return formatUSD(usd);
  return formatIDRraw(usd * state.fx.rate);
}
function pctStr(n) {
  if (n == null || !isFinite(n)) return "—";
  const s = n > 0 ? "+" : "";
  return s + n.toFixed(2) + "%";
}
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
function showToast(msg) {
  const tEl = $("#toast");
  tEl.textContent = msg;
  tEl.classList.add("show");
  setTimeout(() => tEl.classList.remove("show"), 1400);
}
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
// ====== A2HS (Add to Home Screen)
let deferredPrompt = null;
const btnInstall = document.getElementById("btnInstall");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (btnInstall) btnInstall.hidden = false;
});

btnInstall?.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === "accepted") {
    showToast?.("Installed");
  }
  deferredPrompt = null;
  btnInstall.hidden = true;
});

window.addEventListener("appinstalled", () => {
  btnInstall?.setAttribute("hidden", "");
  showToast?.("App installed");
});
function lockUI(text) {
  $$("#btnSearch,#btnRefresh,#btnPrefs,#selChain,#selHas,#btnSort,#searchInput").forEach((el) => (el.disabled = true));
  $("#overlayText").textContent = text || t("loading");
  const o = $("#overlay");
  o.classList.remove("hidden");
  o.setAttribute("aria-hidden", "false");
}
function unlockUI() {
  $$("#btnSearch,#btnRefresh,#btnPrefs,#selChain,#selHas,#btnSort,#searchInput").forEach((el) => (el.disabled = false));
  const o = $("#overlay");
  o.classList.add("hidden");
  o.setAttribute("aria-hidden", "true");
}
async function safeFetchJSON(url, opt) {
  try {
    const r = await fetch(url, opt);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

// ---------- Harga per slice ----------
async function fetchPricesForSlice(startIdx, endIdx) {
  const list = state.protocols.slice(startIdx, endIdx);
  if (!list.length) return;
  const keyBySlug = new Map(),
    allKeys = new Set();
  for (const p of list) {
    const keys = resolveCoinKeys(p);
    state.tokenKeys.set(p.slug, keys);
    if (keys?.length) {
      keyBySlug.set(p.slug, keys);
      keys.forEach((k) => allKeys.add(k));
    }
  }
  if (!allKeys.size) return;
  const keysArr = Array.from(allKeys);
  const ts24h = Math.floor(Date.now() / 1000) - 86400;
  const nowAgg = {},
    oldAgg = {};
  for (let i = 0; i < keysArr.length; i += 80) {
    const sub = keysArr.slice(i, i + 80);
    const joined = encodeURIComponent(sub.join(","));
    const now = await safeFetchJSON("https://coins.llama.fi/prices/current/" + joined);
    const old = await safeFetchJSON(`https://coins.llama.fi/prices/historical/${ts24h}/` + joined);
    if (now?.coins) Object.assign(nowAgg, now.coins);
    if (old?.coins) Object.assign(oldAgg, old.coins);
  }
  const pref = (k) => (k.startsWith("ethereum:") ? 0 : k.startsWith("solana:") ? 1 : k.startsWith("base:") ? 2 : k.startsWith("arbitrum:") ? 3 : k.startsWith("optimism:") ? 4 : k.startsWith("coingecko:") ? 5 : 9);
  for (const [slug, keys] of keyBySlug.entries()) {
    const sorted = [...keys].sort((a, b) => pref(a) - pref(b));
    let cur = null,
      old = null;
    for (const k of sorted)
      if (nowAgg[k]?.price != null) {
        cur = { k, d: nowAgg[k] };
        break;
      }
    for (const k of sorted)
      if (oldAgg[k]?.price != null) {
        old = { k, d: oldAgg[k] };
        break;
      }
    if (cur) state.priceNow.set(slug, { price: cur.d.price, symbol: cur.d.symbol || "", source: cur.k });
    if (cur && old && old.d.price > 0) state.priceChg.set(slug, { change24h: ((cur.d.price - old.d.price) / old.d.price) * 100 });
  }
}

async function fetchPricesForList(list) {
  if (!Array.isArray(list) || !list.length) return;
  const keyBySlug = new Map(),
    allKeys = new Set();
  for (const p of list) {
    const keys = resolveCoinKeys(p);
    state.tokenKeys.set(p.slug, keys);
    if (keys.length) {
      keyBySlug.set(p.slug, keys);
      keys.forEach((k) => allKeys.add(k));
    }
  }
  if (!allKeys.size) return;
  const keysArr = Array.from(allKeys);
  const ts24h = Math.floor(Date.now() / 1000) - 86400;
  const nowAgg = {},
    oldAgg = {};
  const BATCH = 50;
  for (let i = 0; i < keysArr.length; i += BATCH) {
    const sub = keysArr.slice(i, i + 50);
    const joined = encodeURIComponent(sub.join(","));
    const now = await safeFetchJSON("https://coins.llama.fi/prices/current/" + joined);
    const old = await safeFetchJSON(`https://coins.llama.fi/prices/historical/${ts24h}/` + joined);
    if (now?.coins) Object.assign(nowAgg, now.coins);
    if (old?.coins) Object.assign(oldAgg, old.coins);
  }
  const pref = (k) =>
    k.startsWith("ethereum:") ? 0 : k.startsWith("solana:") ? 1 : k.startsWith("base:") ? 2 : k.startsWith("arbitrum:") ? 3 : k.startsWith("optimism:") ? 4 : k.startsWith("polygon:") ? 5 : k.startsWith("coingecko:") ? 6 : 9;
  for (const [slug, keys] of keyBySlug.entries()) {
    const sorted = [...keys].sort((a, b) => pref(a) - pref(b));
    let cur = null,
      old = null;
    for (const k of sorted) {
      const d = nowAgg[k];
      if (d && isFinite(d.price)) {
        cur = { k, d };
        break;
      }
    }
    for (const k of sorted) {
      const d = oldAgg[k];
      if (d && isFinite(d.price)) {
        old = { k, d };
        break;
      }
    }
    if (cur) state.priceNow.set(slug, { price: cur.d.price, symbol: cur.d.symbol || "", source: cur.k });
    if (cur && old && old.d.price > 0) state.priceChg.set(slug, { change24h: ((cur.d.price - old.d.price) / old.d.price) * 100 });
  }
}

// ======= Translation cache
const TRANS_CACHE_KEY = "trans_cache_v1";
let transCache = {};
try {
  transCache = JSON.parse(localStorage.getItem(TRANS_CACHE_KEY) || "{}");
} catch {
  transCache = {};
}
function saveTransCache() {
  try {
    localStorage.setItem(TRANS_CACHE_KEY, JSON.stringify(transCache));
  } catch {}
}
function looksIndonesian(txt) {
  if (!txt) return false;
  const t = txt.toLowerCase();
  const hints = [" yang ", " dan ", " atau ", " dengan ", " untuk ", " tidak ", " adalah ", " sebuah ", " dari ", " ke "];
  return hints.some((h) => t.includes(h));
}
async function tryLibreTranslate(q, target) {
  const eps = ["https://libretranslate.de/translate", "https://libretranslate.com/translate", "https://translate.astian.org/translate"];
  for (const url of eps) {
    try {
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q, source: "en", target, format: "text" }) });
      if (r.ok) {
        const j = await r.json();
        if (j && j.translatedText) return j.translatedText;
      }
    } catch {}
  }
  return null;
}
async function tryMyMemory(q, target) {
  const url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(q) + "&langpair=en|" + encodeURIComponent(target);
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const j = await r.json();
    return j?.responseData?.translatedText || null;
  } catch {}
  return null;
}
async function translateFree(text, targetLang) {
  if (!text || targetLang === "en") return text;
  const key = `${targetLang}::${text}`;
  if (transCache[key]) return transCache[key];
  if (targetLang === "id" && looksIndonesian(text)) {
    transCache[key] = text;
    saveTransCache();
    return text;
  }
  const trimmed = String(text).slice(0, 1200);
  let out = await tryLibreTranslate(trimmed, targetLang);
  if (!out) out = await tryMyMemory(trimmed, targetLang);
  if (!out) out = text;
  transCache[key] = out;
  if (Object.keys(transCache).length > 2000) transCache = {};
  saveTransCache();
  return out;
}
async function translateAndSet(el, text) {
  if (!el) return;
  if (state?.pref?.lang === "id") el.textContent = await translateFree(text || "—", "id");
  else el.textContent = text || "—";
}

// =================== DATA (DeFiLlama)
async function fetchProtocols() {
  const data = await safeFetchJSON("https://api.llama.fi/protocols");
  if (!Array.isArray(data)) {
    state.protocolsRaw = [];
    return;
  }
  const cleaned = data.filter((p) => !p?.dead);
  cleaned.forEach((p) => {
    if (!p.category) p.category = "Other";
  });
  state.nameToSlug.clear();
  for (const p of cleaned) {
    const slug = p?.slug || "";
    const names = [p?.name, p?.displayName, p?.symbol].filter(Boolean);
    names.forEach((n) => state.nameToSlug.set(String(n).toLowerCase(), slug));
  }
  cleaned.sort((a, b) => {
    const a7 = a?.change_7d ?? -999,
      b7 = b?.change_7d ?? -999;
    if (b7 !== a7) return b7 - a7;
    return (b?.tvl || 0) - (a?.tvl || 0);
  });
  state.protocolsRaw = cleaned;
}
function findParent(p) {
  if (!p?.parentProtocol) return null;
  return state.protocolsRaw.find((x) => x?.slug === p.parentProtocol || x?.name?.toLowerCase() === p.parentProtocol?.toLowerCase()) || null;
}

// ---------- NORMALIZER & token resolver ----------
function normalizeCoinKey(raw) {
  if (!raw || typeof raw !== "string") return null;
  let s = raw.trim();
  if (s.startsWith("multi-chain:")) s = s.slice("multi-chain:".length);
  const firstColon = s.indexOf(":");
  if (firstColon < 0) return null;
  let chain = s.slice(0, firstColon).toLowerCase();
  let rest = s.slice(firstColon + 1);
  if (rest.toLowerCase().startsWith(chain + ":")) rest = rest.slice(chain.length + 1);
  const alias = {
    eth: "ethereum",
    ethereum: "ethereum",
    bsc: "bsc",
    binance: "bsc",
    polygon: "polygon",
    matic: "polygon",
    arbitrum: "arbitrum",
    optimism: "optimism",
    base: "base",
    avax: "avax",
    avalanche: "avax",
    fantom: "fantom",
    ftm: "fantom",
    celo: "celo",
    cronos: "cronos",
    linea: "linea",
    zkevm: "zkevm",
    "zksync era": "era",
    zksync: "era",
    era: "era",
    gnosis: "gnosis",
    xdai: "gnosis",
    osmosis: "osmosis",
    solana: "solana",
    cardano: "cardano",
    tron: "tron",
    sui: "sui",
    ton: "ton",
    injective: "injective",
    dydx: "dydx",
    near: "near",
    icon: "icon",
    conflux: "conflux",
    mantle: "mantle",
  };
  chain = alias[chain] || chain;
  if (/\s/.test(chain)) return null;
  if (chain === "coingecko") {
    const id = rest.trim().toLowerCase();
    if (!id || /\s/.test(id)) return null;
    return `coingecko:${id}`;
  }
  const EVMs = ["ethereum", "bsc", "polygon", "arbitrum", "optimism", "base", "avax", "fantom", "celo", "cronos", "linea", "zkevm", "era", "gnosis", "mantle"];
  if (EVMs.includes(chain)) {
    const m = rest.match(/^0x[0-9a-fA-F]{40}$/);
    if (!m) return null;
    return `${chain}:${rest.toLowerCase()}`;
  }
  if (chain === "solana") {
    if (/^solana:/i.test(rest) || /\s/.test(rest)) return null;
    return `${chain}:${rest}`;
  }
  if (chain === "osmosis") {
    if (!/^([a-z0-9]+|ibc\/[A-Za-z0-9]+)$/.test(rest)) return null;
    return `${chain}:${rest}`;
  }
  if (chain === "tron") {
    if (/\s/.test(rest)) return null;
    return `${chain}:${rest}`;
  }
  if (chain === "sui") {
    if (!/^0x[0-9a-fA-F]{64}(::[A-Za-z0-9_]+){2}$/.test(rest)) return null;
    return `${chain}:${rest}`;
  }
  if (chain === "ton") {
    if (/\s/.test(rest)) return null;
    return `${chain}:${rest}`;
  }
  if (chain === "cardano") {
    if (/^cardano:/i.test(rest) || /\s/.test(rest)) return null;
    return `${chain}:${rest}`;
  }
  if (["injective", "dydx", "near", "icon", "conflux"].includes(chain)) {
    if (/\s/.test(rest)) return null;
    return `${chain}:${rest}`;
  }
  return null;
}
function resolveCoinKeys(p) {
  const keys = new Set();
  const addKey = (chain, addr) => {
    if (!chain || !addr) return;
    keys.add(`${String(chain).toLowerCase()}:${String(addr).toLowerCase()}`);
  };
  const collect = (q) => {
    if (!q) return;
    if (q.address) {
      if (typeof q.address === "string" && q.chain) addKey(q.chain, q.address);
      else if (typeof q.address === "object") {
        for (const [ch, ad] of Object.entries(q.address)) if (ad) addKey(ch, ad);
      }
    }
    if (q.token && q.chain) addKey(q.chain, q.token);
    if (q.gecko_id) keys.add(`coingecko:${String(q.gecko_id).toLowerCase()}`);
  };
  collect(p);
  collect(findParent(p));
  const name = (p?.name || "").toLowerCase();
  const slug = (p?.slug || "").toLowerCase();
  const M = {
    uniswap: "coingecko:uniswap",
    "uniswap-v3": "coingecko:uniswap",
    aave: "coingecko:aave",
    "aave-v3": "coingecko:aave",
    curve: "coingecko:curve-dao-token",
    "curve-v2": "coingecko:curve-dao-token",
    sushiswap: "coingecko:sushi",
    "balancer-v2": "coingecko:balancer",
    jupiter: "coingecko:jupiter-exchange-solana",
    meteora: "coingecko:meteora",
  };
  if (M[slug]) keys.add(M[slug]);
  if (M[name]) keys.add(M[name]);
  const cleaned = Array.from(keys).map(normalizeCoinKey).filter(Boolean);
  return cleaned;
}

// Fees & Revenue overview
async function fetchFeesOverview(chain = "") {
  const base = "https://api.llama.fi/overview/fees";
  const makeUrl = (params = "") => (chain ? `${base}/${encodeURIComponent(chain)}` : base) + (params ? `?${params}` : "");
  const feesJson = await safeFetchJSON(makeUrl("excludeTotalDataChart=true"));
  const revJson = await safeFetchJSON(makeUrl("dataType=dailyRevenue&excludeTotalDataChart=true"));
  state.feesOverview.clear();
  const arrFees = Array.isArray(feesJson?.protocols) ? feesJson.protocols : Array.isArray(feesJson) ? feesJson : [];
  const arrRev = Array.isArray(revJson?.protocols) ? revJson.protocols : Array.isArray(revJson) ? revJson : [];
  const revBySlug = new Map();
  for (const item of arrRev) {
    if (!item) continue;
    const byName = state.nameToSlug.get(String(item.name || "").toLowerCase());
    const slug = item.slug || byName || normalizeNameToSlug(item.name || "");
    if (!slug) continue;
    const revenue24h = Number.isFinite(item.revenue24h) ? item.revenue24h : Number.isFinite(item.totalRevenue24h) ? item.totalRevenue24h : Number.isFinite(item.total24h) ? item.total24h : null;
    if (revenue24h != null) revBySlug.set(slug, revenue24h);
  }
  for (const item of arrFees) {
    if (!item) continue;
    const byName = state.nameToSlug.get(String(item.name || "").toLowerCase());
    const slug = item.slug || byName || normalizeNameToSlug(item.name || "");
    if (!slug) continue;
    const fees24h = Number.isFinite(item.fees24h) ? item.fees24h : Number.isFinite(item.totalFees24h) ? item.totalFees24h : Number.isFinite(item.total24h) ? item.total24h : null;
    const revenue24h = revBySlug.has(slug) ? revBySlug.get(slug) : null;
    if (fees24h != null || revenue24h != null) state.feesOverview.set(slug, { fees24h, revenue24h });
  }
}

// FX
async function ensureFx() {
  if (state.pref.ccy !== "IDR") return true;
  try {
    const raw = localStorage.getItem("fx_usd_idr");
    if (raw) {
      const obj = JSON.parse(raw);
      if (obj && obj.rate && obj.ts && Date.now() - obj.ts < 24 * 3600 * 1000) {
        state.fx = obj;
        return true;
      }
    }
  } catch {}
  let rate = 0;
  let j = await safeFetchJSON("https://api.frankfurter.app/latest?from=USD&to=IDR");
  rate = j?.rates?.IDR || 0;
  if (!rate) {
    j = await safeFetchJSON("https://api.exchangerate.host/latest?base=USD&symbols=IDR");
    rate = j?.rates?.IDR || 0;
  }
  if (rate) {
    state.fx = { rate, ts: Date.now() };
    localStorage.setItem("fx_usd_idr", JSON.stringify(state.fx));
    return true;
  } else {
    showToast(t("fx_fail"));
    state.pref.ccy = "USD";
    localStorage.setItem("pref_ccy", "USD");
    return false;
  }
}

// FILTER / SORT / SEARCH
function hasToken(p) {
  const keys = state.tokenKeys.get(p.slug) || resolveCoinKeys(p);
  state.tokenKeys.set(p.slug, keys);
  return Array.isArray(keys) && keys.length > 0;
}
function hasFees(p) {
  const ov = state.feesOverview.get(p.slug);
  return ov && ov.fees24h != null;
}
function hasRevenue(p) {
  const ov = state.feesOverview.get(p.slug);
  return ov && ov.revenue24h != null;
}

function applyFilters() {
  let list = state.protocolsRaw.slice();
  const chain = state.chainFilter;
  if (chain) {
    list = list.filter((p) => {
      const arr = Array.isArray(p?.chains) ? p.chains : p?.chain ? [p.chain] : [];
      return arr.some((c) => (c || "").toLowerCase() === chain.toLowerCase());
    });
  }
  const q = state.searchQuery.trim().toLowerCase();
  if (q) {
    const tokens = q.split(/\s+/).filter(Boolean);
    list = list.filter((p) => {
      const hay = [p?.name, p?.slug, p?.symbol, p?.description, ...(Array.isArray(p?.chains) ? p.chains : [])].filter(Boolean).join(" ").toLowerCase();
      return tokens.every((tok) => hay.includes(tok));
    });
  }
  if (state.hasKey === "token") list = list.filter((p) => hasToken(p));
  if (state.hasKey === "fees") list = list.filter((p) => hasFees(p));
  if (state.hasKey === "revenue") list = list.filter((p) => hasRevenue(p));
  state.protocols = list;
}

function sortProtocols() {
  const key = state.sortKey;
  state.protocols.sort((a, b) => {
    if (key === "tvl") return (b?.tvl || 0) - (a?.tvl || 0);
    if (key === "fees24h") {
      const A = state.feesOverview.get(a?.slug)?.fees24h;
      const B = state.feesOverview.get(b?.slug)?.fees24h;
      const aV = Number.isFinite(A) ? A : -1,
        bV = Number.isFinite(B) ? B : -1;
      if (bV !== aV) return bV - aV;
      return (b?.tvl || 0) - (a?.tvl || 0);
    }
    if (key === "revenue24h") {
      const A = state.feesOverview.get(a?.slug)?.revenue24h;
      const B = state.feesOverview.get(b?.slug)?.revenue24h;
      const aV = Number.isFinite(A) ? A : -1,
        bV = Number.isFinite(B) ? B : -1;
      if (bV !== aV) return bV - aV;
      return (b?.tvl || 0) - (a?.tvl || 0);
    }
    if (key === "pricechg") {
      const A = state.priceChg.get(a?.slug)?.change24h;
      const B = state.priceChg.get(b?.slug)?.change24h;
      const aV = Number.isFinite(A) ? A : -9999,
        bV = Number.isFinite(B) ? B : -9999;
      if (bV !== aV) return bV - aV;
      return (b?.tvl || 0) - (a?.tvl || 0);
    }
    const a7 = a?.change_7d ?? -999,
      b7 = b?.change_7d ?? -999;
    if (b7 !== a7) return b7 - a7;
    return (b?.tvl || 0) - (a?.tvl || 0);
  });
}

// UI helpers
function skeleton(n = 3) {
  const feed = $("#feed");
  feed.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const wrap = document.createElement("div");
    wrap.className = "snap-wrap";
    const card = document.createElement("section");
    card.className = "card";
    card.innerHTML = `
            <div class="header">
              <div class="logo skeleton"></div>
              <div><div class="skeleton" style="height:16px;width:60%"></div><div class="skeleton" style="height:12px;width:40%;margin-top:8px"></div></div>
              <span class="badge skeleton" style="width:64px;height:28px"></span>
            </div>
            <div class="skeleton" style="height:54px"></div>
            <div class="metrics">
              <div class="metric skeleton"></div><div class="metric skeleton"></div>
              <div class="metric skeleton"></div><div class="metric skeleton"></div>
            </div>
            <div class="actions"><button class="btn btn-primary" disabled>${t("detail")}</button><button class="watch" disabled>☆</button></div>`;
    wrap.appendChild(card);
    feed.appendChild(wrap);
  }
}

function getNarratives(p) {
  const tags = new Set();
  const cat = (p?.category || "").toLowerCase();
  const name = (p?.name || "").toLowerCase();
  const chainsStr = JSON.stringify(p?.chains || []).toLowerCase();
  if (cat.includes("dex")) tags.add("DEX");
  if (cat.includes("lending") || cat.includes("cdp")) tags.add("Lending");
  if (cat.includes("liquid staking") || name.includes("stake")) tags.add("LSD");
  if (cat.includes("derivative") || name.includes("perp")) tags.add("Perp");
  if (cat.includes("bridge")) tags.add("Bridge");
  if (cat.includes("nft")) tags.add("NFT");
  if (cat.includes("infrastructure") || cat.includes("oracle")) tags.add("Infra");
  if (chainsStr.includes("solana")) tags.add("Solana");
  if (chainsStr.includes("ethereum")) tags.add("Ethereum");
  if (chainsStr.includes("base")) tags.add("Base");
  if (chainsStr.includes("arbitrum")) tags.add("Arbitrum");
  if (chainsStr.includes("optimism")) tags.add("OP");
  return Array.from(tags).slice(0, 4);
}

function toggleWatch(btn, p) {
  const slug = p?.slug;
  if (!slug) return;
  if (state.watchlist.has(slug)) {
    state.watchlist.delete(slug);
    btn.textContent = "☆";
    showToast(t("removed_watch"));
  } else {
    state.watchlist.add(slug);
    btn.textContent = "★";
    showToast(t("saved_watch"));
  }
  localStorage.setItem("watchlist_v1", JSON.stringify(Array.from(state.watchlist)));
  btn.classList.toggle("active");
}


// =================== CHART INTERACTIVE STATE & HELPERS ===================

// Variabel untuk menyimpan status grafik yang sedang aktif di detail sheet
let activeChart = {
  canvas: null,
  ctx: null,
  points: [], // Data mentah [timestamp, usd]
  coords: [], // Data terpetakan [x, y] di canvas
  scale: {
    pad: 8,
    W: 0,
    H: 0,
    min: 0,
    max: 0,
    xScale: (i) => i, // Fungsi untuk memetakan index -> x
    yScale: (v) => v, // Fungsi untuk memetakan value -> y
  },
  activeIdx: -1, // Index data poin yang sedang aktif/di-hover
};

/**
 * Memformat tanggal untuk tooltip grafik.
 * @param {number} ts - Timestamp (ms)
 */
function formatChartDate(ts) {
  return new Date(ts).toLocaleDateString(state.pref.lang === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
  });
}

/**
 * Menggambar ulang KESELURUHAN isi canvas, termasuk garis dan tooltip interaktif.
 */
function redrawActiveChart() {
  const { canvas, ctx, points, coords, scale, activeIdx } = activeChart;
  if (!ctx || !canvas || !coords.length) return;

  const dpr = window.devicePixelRatio || 1;
  // Bersihkan canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Setel ulang skala DPR setiap kali menggambar ulang
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // 1. Gambar Garis dan Area (copy dari drawLineChart lama)
  ctx.beginPath();
  ctx.moveTo(coords[0][0], coords[0][1]);
  for (let i = 1; i < coords.length; i++) {
    ctx.lineTo(coords[i][0], coords[i][1]);
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#1fdc86";
  ctx.stroke();

  const g = ctx.createLinearGradient(0, scale.pad, 0, scale.pad + scale.H);
  g.addColorStop(0, "rgba(31,220,134,.32)");
  g.addColorStop(1, "rgba(31,220,134,0)");
  ctx.lineTo(scale.pad + scale.W, scale.pad + scale.H);
  ctx.lineTo(scale.pad, scale.pad + scale.H);
  ctx.closePath();
  ctx.fillStyle = g;
  ctx.fill();

  // 2. Gambar Elemen Interaktif (Tooltip, Garis Vertikal, Titik)
  if (activeIdx >= 0 && activeIdx < coords.length) {
    const [x, y] = coords[activeIdx];
    const [ts, usd] = points[activeIdx]; // Ambil data mentah

    // Garis Vertikal
    ctx.beginPath();
    ctx.moveTo(x, scale.pad);
    ctx.lineTo(x, scale.pad + scale.H);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.stroke();

    // Titik/Circle
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "#1fdc86";
    ctx.strokeStyle = "#0b0f14"; // Warna background sheet, untuk border
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();

    // Tooltip (Teks dan Latar Belakang)
    const dateStr = formatChartDate(ts);
    const valStr = formatMoney(usd); // Gunakan formatMoney yang ada
    const text = `${dateStr}: ${valStr}`;

    ctx.font = "bold 12px sans-serif";
    const textMetrics = ctx.measureText(text);
    const textW = textMetrics.width;
    const textH = 14; // Perkiraan tinggi font
    const boxPad = 8; // Padding di dalam kotak tooltip

    // Tentukan posisi X kotak tooltip, usahakan tidak keluar layar
    let boxX = x + 12; // Default di kanan titik
    if (boxX + textW + boxPad * 2 > scale.pad + scale.W - 5) {
      boxX = x - textW - boxPad * 2 - 12; // Pindah ke kiri titik
    }
    
    // Tentukan posisi Y, usahakan di tengah titik
    let boxY = y - (textH / 2) - boxPad;
    // Jaga agar tidak keluar dari atas/bawah canvas
    if (boxY < scale.pad) boxY = scale.pad;
    if (boxY + textH + boxPad * 2 > scale.pad + scale.H) {
      boxY = scale.pad + scale.H - textH - boxPad * 2;
    }

    // Gambar latar tooltip
    ctx.fillStyle = "rgba(11, 15, 20, 0.85)"; // Latar semi-transparan
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, textW + boxPad * 2, textH + boxPad * 2, 6);
    ctx.fill();
    ctx.stroke();


    // Gambar teks tooltip
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, boxX + boxPad, boxY + boxPad + textH - 2); // Sesuaikan Y untuk baseline teks
  }
}

/**
 * Mendapatkan koordinat x/y dari event mouse/touch relatif terhadap canvas.
 */
function getEventCoords(e) {
  const canvas = activeChart.canvas;
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();

  let clientX;
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
  } else if (e.clientX != null) {
    clientX = e.clientX;
  } else {
    return null; // Tidak ada info koordinat
  }
  
  const x = clientX - rect.left;
  return { x };
}

/**
 * Mencari index data poin terdekat berdasarkan koordinat x.
 */
function findClosestPoint(x) {
  const { coords } = activeChart;
  if (!coords || !coords.length) return -1;

  let closestIdx = -1;
  let minDiff = Infinity;

  // Cari jarak horizontal terdekat
  for (let i = 0; i < coords.length; i++) {
    const diff = Math.abs(coords[i][0] - x);
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = i;
    }
  }
  return closestIdx;
}

/**
 * Handler untuk event mousemove dan touchmove di canvas.
 */
function handleChartMove(e) {
  if (e.cancelable) e.preventDefault(); // Mencegah scroll halaman saat drag di chart
  const { canvas, coords } = activeChart;
  if (!canvas || !coords.length) return;

  const pos = getEventCoords(e);
  if (pos === null) return;

  const newIdx = findClosestPoint(pos.x);

  if (newIdx !== activeChart.activeIdx) {
    activeChart.activeIdx = newIdx;
    redrawActiveChart(); // Gambar ulang dengan tooltip di posisi baru
  }
}

/**
 * Handler untuk event mouseleave dan touchend (saat user melepas jari).
 */
function handleChartLeave(e) {
  if (activeChart.activeIdx !== -1) {
    activeChart.activeIdx = -1; // Sembunyikan tooltip
    redrawActiveChart();
  }
}
// =================== END CHART INTERACTIVE HELPERS ===================

function drawLineChart(canvas, points) {
  // Reset state jika chart tidak valid
  if (!canvas || !points || points.length < 2) {
    activeChart = { canvas: null, ctx: null, points: [], coords: [], scale: {}, activeIdx: -1 };
    return;
  }

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || canvas.parentElement.clientWidth || 300;
  const cssH = 120;
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  ctx.scale(dpr, dpr);

  const valuesUSD = points.map((p) => p?.[1]).filter((v) => isFinite(v));
  // Poin data mentah (points) disimpan apa adanya [ts, usd]
  // scaleVals digunakan untuk menentukan min/max dalam mata uang pilihan
  const scaleVals = state.pref.ccy === "IDR" && state.fx.rate ? valuesUSD.map((v) => v * state.fx.rate) : valuesUSD;
  
  if (!scaleVals.length) return;

  const min = Math.min(...scaleVals),
    max = Math.max(...scaleVals);
  const pad = 8,
    W = cssW - pad * 2,
    H = cssH - pad * 2;

  // Fungsi skala
  const xScale = (i) => pad + (i / (scaleVals.length - 1)) * W;
  const yScale = (v) => pad + (1 - (v - min) / (max - min || 1)) * H;

  // Simpan semua state ke variabel global activeChart
  activeChart.canvas = canvas;
  activeChart.ctx = ctx;
  activeChart.points = points; // Simpan data mentah [ts, usd]
  activeChart.coords = scaleVals.map((v, i) => [xScale(i), yScale(v)]);
  activeChart.scale = { pad, W, H, min, max, xScale, yScale };
  activeChart.activeIdx = -1;

  // Gambar Awal
  redrawActiveChart();

  // Hapus listener lama jika ada (untuk mencegah duplikat)
  if (canvas._chartListenersAttached) {
    canvas.removeEventListener("mousemove", handleChartMove);
    canvas.removeEventListener("mouseleave", handleChartLeave);
    canvas.removeEventListener("touchmove", handleChartMove);
    canvas.removeEventListener("touchend", handleChartLeave);
    canvas.removeEventListener("touchcancel", handleChartLeave);
  }

  // Pasang listener baru
  canvas.addEventListener("mousemove", handleChartMove);
  canvas.addEventListener("mouseleave", handleChartLeave);
  canvas.addEventListener("touchmove", handleChartMove, { passive: false }); // 'passive: false' untuk e.preventDefault()
  canvas.addEventListener("touchend", handleChartLeave);
  canvas.addEventListener("touchcancel", handleChartLeave);
  canvas._chartListenersAttached = true; // Tandai bahwa listener sudah dipasang
}

function getGeckoIdFromTokenKeys(slug) {
  const keys = state.tokenKeys.get(slug) || [];
  const g = keys.find((k) => k.startsWith("coingecko:"));
  return g ? g.split(":")[1] : null;
}
function fmtDate(s) {
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(state.pref.lang === "id" ? "id-ID" : "en-US");
}

async function fetchWithTimeout(url, { timeoutMs = 6000, ...opt } = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { ...opt, signal: ctrl.signal });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return await r.json();
  } finally {
    clearTimeout(id);
  }
} // ===== Light cache for TVL 30D (per slug)
const TVL_CACHE_KEY = "tvl30d_cache_v1";
let tvlCache = {};
try {
  tvlCache = JSON.parse(localStorage.getItem(TVL_CACHE_KEY) || "{}");
} catch {
  tvlCache = {};
}
function saveTvlCache() {
  try {
    // keep cache small
    const keys = Object.keys(tvlCache);
    if (keys.length > 150) {
      // drop oldest ~50
      keys.slice(0, 50).forEach((k) => delete tvlCache[k]);
    }
    localStorage.setItem(TVL_CACHE_KEY, JSON.stringify(tvlCache));
  } catch {}
}
function cacheKeyFor(slug) {
  // rotate daily so grafik 30D ikut segar
  const d = new Date();
  const daily = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
  return `${slug}::${daily}`;
}

// ===== Load only what we need (last 30 points) with timeout + fallback
async function loadTvl30D(slug) {
  const key = cacheKeyFor(slug);
  if (tvlCache[key]) return tvlCache[key]; // [{date, totalLiquidityUSD}, ...]

  // 1) coba fetch cepat; kalau lambat -> abort (6s), UI tetap jalan
  let detail = null;
  try {
    detail = await fetchWithTimeout(`https://api.llama.fi/protocol/${encodeURIComponent(slug)}`, { timeoutMs: 6000 });
  } catch {
    // biar UI tidak nge-freeze—lempar null, nanti user bisa tap retry
    return null;
  }
  const tvlArr = Array.isArray(detail?.tvl) ? detail.tvl : [];
  const last30 = tvlArr.filter((r) => r && isFinite(r.totalLiquidityUSD)).slice(-30);
  tvlCache[key] = last30;
  saveTvlCache();
  return last30;
}

// ===== Small retry with exponential-ish backoff untuk chart
async function retryLoadTvl(slug, tries = 2) {
  for (let i = 0; i < tries; i++) {
    const res = await loadTvl30D(slug);
    if (Array.isArray(res) && res.length) return res;
    await new Promise((r) => setTimeout(r, 800 * (i + 1)));
  }
  return null;
}

// === DETAIL SHEET
async function openSheet(p) {
  lockUI(t("loading_details"));
  const sheet = $("#sheet");
  const c = $("#sheetContent");
  const logoSrc = p?.logo ? (p.logo.startsWith("http") ? p.logo : "https://icons.llama.fi/" + p.logo) : "";
  const priceNow = state.priceNow.get(p.slug);
  const priceChg = state.priceChg.get(p.slug);
  const tokenExists = hasToken(p);
  const chgVal = tokenExists && priceChg ? priceChg.change24h : null;
  const ov = state.feesOverview.get(p.slug) || {};
  const fee24 = Number.isFinite(ov.fees24h) ? ov.fees24h : null;
  const rev24 = Number.isFinite(ov.revenue24h) ? ov.revenue24h : null;

  c.innerHTML = `
          <div style="display:grid;grid-template-columns:56px 1fr;gap:12px;align-items:center;">
            <div class="logo">${logoSrc ? `<img alt="${p?.name || ""}" src="${logoSrc}" loading="lazy" decoding="async">` : ``}</div>
            <div><div class="title">${p?.name || ""}</div><div class="subtitle">${p?.category || ""} • ${(p?.chains || []).join(", ")}</div></div>
          </div>

          <div class="kvs" style="margin:12px 0;">
            <div class="kv"><div class="k">${t("tvl")}</div><div class="v">${formatMoney(p?.tvl)}</div></div>
            <div class="kv"><div class="k">${t("tvl_7d")}</div><div class="v ${p?.change_7d > 0 ? "pos" : p?.change_7d < 0 ? "neg" : ""}">${pctStr(p?.change_7d)}</div></div>
            <div class="kv"><div class="k">${t("price")}</div><div class="v">${tokenExists ? (priceNow ? formatMoney(priceNow.price) : "—") : t("no_token")}</div></div>
            <div class="kv"><div class="k">${t("price_chg_24h")}</div><div class="v ${chgVal > 0 ? "pos" : chgVal < 0 ? "neg" : ""}">${tokenExists ? (priceChg ? pctStr(chgVal) : "—") : "—"}</div></div>
            <div class="kv"><div class="k">${t("fees_24h")}</div><div class="v">${fee24 != null ? formatMoney(fee24) : "—"}</div></div>
            <div class="kv"><div class="k">${t("revenue_24h")}</div><div class="v">${rev24 != null ? formatMoney(rev24) : "—"}</div></div>
          </div>

          <div style="margin-top:6px;">
            <div class="label muted" style="margin-bottom:6px;">TVL 30D (${state.pref.ccy})</div>
            <canvas id="tvlChart" style="width:100%;height:120px;display:block;"></canvas>
          </div>

          <div class="kv" style="margin-top:12px;">
            <div class="k">Description</div>
            <div class="v" id="sheetDesc" style="white-space: pre-wrap; font-weight:400;">—</div>
          </div>

          <h4 id="marketHeader" style="margin:12px 0 6px;">${t("market_data")}</h4>
          <table id="mcapTable" class="mini-table"></table>

          <h4 style="margin:12px 0 6px;">${t("github")}</h4>
          <table id="ghTable" class="mini-table"></table>

          <div class="links" style="margin-top:10px;">
            ${p?.url ? `<a class="link" href="${p.url}" target="_blank" rel="noopener">${t("website")}</a>` : ""}
            <a class="link" href="https://defillama.com/protocol/${encodeURIComponent(p?.slug || "")}" target="_blank" rel="noopener">${t("view_llama")}</a>
          </div>
          <p class="muted" style="margin-top:10px;font-size:11px;">${t("source_note")}</p>
        `;
  $("#sheetTitle").textContent = p?.name || "Detail";
  sheet.classList.add("open");
  translateAndSet(document.getElementById("sheetDesc"), p?.description || "—");

  // TVL chart (deferred + timeout + cache + shimmer)
  const canvas = document.getElementById("tvlChart");
  if (canvas) {
    const shimmer = document.createElement("div");
    shimmer.className = "shimmer";
    shimmer.style.width = "100%";
    shimmer.style.height = "120px";
    canvas.replaceWith(shimmer);

    requestAnimationFrame(async () => {
      let last30 = await loadTvl30D(p.slug);
      if (!last30 || !last30.length) {
        last30 = await retryLoadTvl(p.slug, 2);
      }

      const newCanvas = document.createElement("canvas");
      newCanvas.id = "tvlChart";
      newCanvas.style.width = "100%";
      newCanvas.style.height = "120px";

      if (Array.isArray(last30) && last30.length) {
        const pts = last30.map((r) => [r.date, r.totalLiquidityUSD]);
        shimmer.replaceWith(newCanvas);
        drawLineChart(newCanvas, pts);
      } else {
        const box = document.createElement("div");
        box.style.display = "grid";
        box.style.placeItems = "center";
        box.style.height = "120px";
        box.style.background = "#0d121a";
        box.style.borderRadius = "12px";
        box.style.border = "1px solid rgba(255,255,255,.06)";
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = "Load TVL";
        btn.onclick = async () => {
          btn.disabled = true;
          btn.textContent = t("loading");
          const again = await retryLoadTvl(p.slug, 3);
          if (again && again.length) {
            const pts2 = again.map((r) => [r.date, r.totalLiquidityUSD]);
            box.replaceWith(newCanvas);
            drawLineChart(newCanvas, pts2);
          } else {
            btn.disabled = false;
            btn.textContent = "Retry";
          }
        };
        box.appendChild(btn);
        shimmer.replaceWith(box);
      }
    });
  }

  // CoinGecko
  const mcapTable = $("#mcapTable");
  const geckoId = getGeckoIdFromTokenKeys(p.slug);
  if (geckoId) {
    const cg = await safeFetchJSON(`https://api.coingecko.com/api/v3/coins/${encodeURIComponent(geckoId)}?localization=false&market_data=true`);
    const md = cg?.market_data;
    const capUSD = md?.market_cap?.usd,
      fdvUSD = md?.fully_diluted_valuation?.usd,
      ath = md?.ath?.usd,
      atl = md?.atl?.usd;
    const header = document.getElementById("marketHeader");
    header.innerHTML = `${t("market_data")} — <a class="link" href="https://www.coingecko.com/en/coins/${encodeURIComponent(geckoId)}" target="_blank" rel="noopener">CoinGecko</a>`;
    mcapTable.innerHTML = `<tr><th>${t("mcap")}</th><td style="text-align:right">${capUSD != null ? formatMoney(capUSD) : "—"}</td></tr>
             <tr><th>${t("fdv")}</th><td style="text-align:right">${fdvUSD != null ? formatMoney(fdvUSD) : "—"}</td></tr>
             <tr><th>${t("ath")}</th><td style="text-align:right">${ath != null ? formatMoney(ath) : "—"}</td></tr>
             <tr><th>${t("atl")}</th><td style="text-align:right">${atl != null ? formatMoney(atl) : "—"}</td></tr>`;
  } else {
    mcapTable.innerHTML = `<tr><td class="muted">—</td></tr>`;
  }

  // GitHub (deferred load)
  const ghTable = $("#ghTable");
  ghTable.innerHTML = `<tr><td class="muted">Loading…</td></tr>`;

  requestAnimationFrame(async () => {
    let detail = null;
    try {
      detail = await fetchWithTimeout(`https://api.llama.fi/protocol/${encodeURIComponent(p?.slug || "")}`, { timeoutMs: 6000 });
    } catch {
      ghTable.innerHTML = `<tr><td class="muted">Failed to load</td></tr>`;
      return;
    }

    const repos = Array.isArray(detail?.github) ? detail.github : [];
    if (repos && repos.length) {
      const first = repos.find((r) => /github\.com\/[^\/]+\/[^\/]+/i.test(r)) || repos[0];
      let ownerRepo = null;
      try {
        const m = first.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/i);
        if (m) ownerRepo = `${m[1]}/${m[2]}`.replace(/\.git$/, "");
      } catch {}
      if (ownerRepo) {
        const gh = await safeFetchJSON(`https://api.github.com/repos/${ownerRepo}`);
        if (gh) {
          ghTable.innerHTML = `
          <tr><th>Repo</th><td><a class="link" href="${gh.html_url}" target="_blank" rel="noopener">${ownerRepo}</a></td></tr>
          <tr><th>${t("stars")}</th><td>${gh.stargazers_count ?? "—"}</td></tr>
          <tr><th>${t("forks")}</th><td>${gh.forks_count ?? "—"}</td></tr>
          <tr><th>${t("last_push")}</th><td>${fmtDate(gh.pushed_at)}</td></tr>`;
        } else {
          ghTable.innerHTML = `<tr><td class="muted">No data</td></tr>`;
        }
      } else {
        ghTable.innerHTML = `<tr><td class="muted">No repo</td></tr>`;
      }
    } else {
      ghTable.innerHTML = `<tr><td class="muted">—</td></tr>`;
    }
  });

  unlockUI();
}
function closeSheet() {
  $("#sheet").classList.remove("open");
}
$("#sheet").addEventListener("click", (e) => {
  if (e.target.id === "sheet") closeSheet();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSheet();
    $("#prefsSheet").classList.remove("open");
    closeSortPopover();
  }
});

// ======= SORT POPOVER =======
const btnSort = document.getElementById("btnSort");
const popSort = document.getElementById("popSort");
function sortItems() {
  return [
    { key: "chg7d", label: t("sort_delta7d") },
    { key: "tvl", label: t("sort_tvl") },
    { key: "fees24h", label: t("sort_fees24h") },
    { key: "revenue24h", label: t("sort_revenue24h") },
    { key: "pricechg", label: t("sort_pricechg") },
  ];
}
function updateSortButtonLabel() {
  const curr = sortItems().find((i) => i.key === state.sortKey);
  document.getElementById("btnSortLabel").textContent = `${t("sort_label")}${curr ? curr.label : ""}`;
}
function buildSortPopoverOptions() {
  const items = sortItems();
  popSort.innerHTML = items
    .map(
      (i) => `
          <button class="pop-item ${i.key === state.sortKey ? "active" : ""}" data-key="${i.key}" role="menuitem">
            ${i.label}${i.key === state.sortKey ? '<span class="tick">✓</span>' : ""}
          </button>`
    )
    .join("");
}
function positionSortPopover() {
  const r = btnSort.getBoundingClientRect();
  popSort.style.visibility = "hidden";
  popSort.classList.remove("hidden");
  const pw = popSort.offsetWidth;
  const left = Math.min(Math.max(10, r.left), window.innerWidth - pw - 10);
  popSort.style.left = left + "px";
  popSort.style.top = r.bottom + 6 + "px";
  popSort.style.visibility = "visible";
}
function openSortPopover() {
  buildSortPopoverOptions();
  positionSortPopover();
  btnSort.setAttribute("aria-expanded", "true");
}
function closeSortPopover() {
  if (popSort.classList.contains("hidden")) return;
  popSort.classList.add("hidden");
  btnSort.setAttribute("aria-expanded", "false");
}
function toggleSortPopover() {
  if (popSort.classList.contains("hidden")) openSortPopover();
  else closeSortPopover();
}
btnSort.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleSortPopover();
});
window.addEventListener("resize", closeSortPopover);
document.addEventListener("click", (e) => {
  if (!popSort.classList.contains("hidden")) {
    if (!popSort.contains(e.target) && e.target !== btnSort) closeSortPopover();
  }
});
popSort.addEventListener("click", (e) => {
  const b = e.target.closest(".pop-item");
  if (!b) return;
  const key = b.dataset.key;
  if (!key) return;
  if (state.sortKey !== key) {
    lockUI(t("sorting"));
    state.sortKey = key;
    updateSortButtonLabel();
    $("#feed").scrollTo({ top: 0, behavior: "smooth" });
    $("#feed").innerHTML = "";
    state.page = 0;
    sortProtocols();
    renderPage();
    unlockUI();
  }
  closeSortPopover();
});


// ======= CHAIN SEARCHABLE DROPDOWN (ENHANCER) =======
let chainBtn = null;
let chainPop = null;
let chainSearchInput = null;
let chainListBox = null;

function getAllChains() {
  const chains = new Set();
  for (const p of state.protocolsRaw) {
    const arr = Array.isArray(p?.chains) ? p.chains : p?.chain ? [p.chain] : [];
    arr.forEach((c) => c && chains.add(c));
  }
  return Array.from(chains).sort();
}

// Create UI once
function ensureChainEnhancer() {
  if (chainBtn && chainPop) return;

  const sel = document.getElementById('selChain');
  if (!sel) return;

  // hide the native select but keep it for change events
  sel.style.display = 'none';

  // mount right after select
  let mount = document.getElementById('chainEnhanceMount');
  if (!mount) {
    mount = document.createElement('span');
    mount.id = 'chainEnhanceMount';
    sel.insertAdjacentElement('afterend', mount);
  }

  // button
  chainBtn = document.createElement('button');
  chainBtn.id = 'btnChain';
  chainBtn.type = 'button';
  chainBtn.className = 'btn'; // reuse existing .btn style
  chainBtn.style.maxWidth = '52%';
  chainBtn.style.whiteSpace = 'nowrap';
  chainBtn.style.overflow = 'hidden';
  chainBtn.style.textOverflow = 'ellipsis';
  chainBtn.setAttribute('aria-haspopup', 'menu');
  chainBtn.setAttribute('aria-expanded', 'false');
  chainBtn.innerHTML = `<span class="chip-icon">🧬</span> <span id="btnChainLabel">${state.chainFilter || t('all_chains')}</span>`;
  mount.replaceWith(chainBtn);

  // popover
  chainPop = document.createElement('div');
  chainPop.id = 'popChain';
  chainPop.className = 'popover hidden';
  chainPop.innerHTML = `
    <div style="padding:6px;border-bottom:1px solid rgba(255,255,255,.06);position:sticky;top:0;background:#0f151c;z-index:1;">
      <input id="chainSearch" type="search" placeholder="${t('search_placeholder')}" autocomplete="off"
        style="width:100%;border:1px solid rgba(255,255,255,.08);background:#121926;color:#e7edf3;padding:8px 10px;border-radius:10px;font-size:13px;outline:none;" />
    </div>
    <div id="chainList" style="max-height:320px;overflow:auto;"></div>
  `;
  document.body.appendChild(chainPop);

  chainSearchInput = chainPop.querySelector('#chainSearch');
  chainListBox = chainPop.querySelector('#chainList');

  chainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleChainPopover();
  });
  const onViewportChange = () => {
  if (!chainPop || chainPop.classList.contains('hidden')) return;
  positionChainPopover();
};

  window.addEventListener('resize', onViewportChange);

  if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', onViewportChange);
  window.visualViewport.addEventListener('scroll', onViewportChange);
}
  
  document.addEventListener('click', (e) => {
    if (!chainPop.classList.contains('hidden')) {
      if (!chainPop.contains(e.target) && e.target !== chainBtn) closeChainPopover();
    }
  });
  chainSearchInput.addEventListener('input', () => {
    buildChainList(chainSearchInput.value || '');
  });
  chainSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeChainPopover();
  });
}

// Build items (filtered)
function buildChainList(filterText = '') {
  const all = [''].concat(getAllChains()); // '' means All chains
  const f = (filterText || '').toLowerCase().trim();
  const items = f
    ? all.filter((c) => (c ? c.toLowerCase().includes(f) : t('all_chains').toLowerCase().includes(f)))
    : all;

  chainListBox.innerHTML = items.map((c) => {
    const isActive = (state.chainFilter || '') === c;
    const label = c || t('all_chains');
    return `
      <button class="pop-item ${isActive ? 'active' : ''}" data-chain="${c}">
        <span>${label}</span>
        ${isActive ? '<span class="tick">✓</span>' : ''}
      </button>
    `;
  }).join('');

  chainListBox.querySelectorAll('.pop-item').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const value = e.currentTarget.dataset.chain || '';
      const sel = document.getElementById('selChain');
      sel.value = value;
      document.getElementById('btnChainLabel').textContent = value || t('all_chains');
      closeChainPopover();
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
}

function positionChainPopover() {
  if (!chainBtn || !chainPop) return;
  const r = chainBtn.getBoundingClientRect();

  chainPop.style.visibility = 'hidden';
  chainPop.classList.remove('hidden');

  const popWidth = chainPop.offsetWidth || 280;
  let left = Math.min(Math.max(10, r.left), window.innerWidth - popWidth - 10);
  let top = r.bottom + 6;
  if (window.visualViewport) {
    const vv = window.visualViewport;
    const safeBottom = vv.height - 12;
    const approxPopHeight = Math.min(chainPop.scrollHeight || 360, 360); // guard
    if (top + approxPopHeight > safeBottom) {
      top = Math.max(10, safeBottom - approxPopHeight);
    }
    left = Math.min(Math.max(10, r.left), vv.width - popWidth - 10);
    chainPop.style.position = 'fixed';
  } else {
    chainPop.style.position = 'absolute';
  }

  chainPop.style.left = left + 'px';
  chainPop.style.top = top + 'px';
  chainPop.style.visibility = 'visible';
}


function openChainPopover() {
  ensureChainEnhancer();
  buildChainList('');
  positionChainPopover();
  chainBtn.setAttribute('aria-expanded', 'true');
  setTimeout(() => chainSearchInput?.focus(), 10);
}

function closeChainPopover() {
  if (!chainPop || chainPop.classList.contains('hidden')) return;
  chainPop.classList.add('hidden');
  chainBtn?.setAttribute('aria-expanded', 'false');
}

function toggleChainPopover() {
  if (!chainPop || chainPop.classList.contains('hidden')) openChainPopover();
  else closeChainPopover();
}

function syncChainButtonLabel() {
  const lbl = document.getElementById('btnChainLabel');
  if (lbl) lbl.textContent = state.chainFilter || t('all_chains');
}


// ======= EVENT FILTERS =======
$("#selChain").addEventListener("change", async () => {
  closeSortPopover();
  state.chainFilter = $("#selChain").value;
  lockUI(t("filtering"));
  $("#feed").scrollTo({ top: 0, behavior: "smooth" });
  await fetchFeesOverview(state.chainFilter || "");
  state.page = 0;
  $("#feed").innerHTML = "";
  applyFilters();
  await fetchPricesForList(state.protocols);
  sortProtocols();
  renderPage();
  unlockUI();
  // keep enhanced button label in sync
  syncChainButtonLabel();
});

$("#selHas").addEventListener("change", async () => {
  closeSortPopover();
  state.hasKey = $("#selHas").value;
  lockUI(t("filtering"));
  $("#feed").scrollTo({ top: 0, behavior: "smooth" });
  state.page = 0;
  $("#feed").innerHTML = "";
  applyFilters();
  sortProtocols();
  renderPage();
  unlockUI();
});

function runSearch() {
  closeSortPopover();
  state.searchQuery = String($("#searchInput").value || "");
  lockUI(t("searching"));
  $("#feed").scrollTo({ top: 0, behavior: "smooth" });
  $("#feed").innerHTML = "";
  state.page = 0;
  applyFilters();
  sortProtocols();
  renderPage();
  unlockUI();
}
$("#btnSearch").addEventListener("click", runSearch);
$("#searchInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") runSearch();
});

function normalizeNameToSlug(name = "") {
  return String(name)
    .toLowerCase()
    .replace(/\s*v[0-9]+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Prefs
function buildHasOptions() {
  const sel = $("#selHas");
  const curr = state.hasKey;
  sel.innerHTML = `
          <option value="any">${t("has_any")}</option>
          <option value="token">${t("has_token")}</option>
          <option value="fees">${t("has_fees")}</option>
          <option value="revenue">${t("has_revenue")}</option>`;
  sel.value = curr;
}
function buildChainOptions() {
  const chains = new Set();
  for (const p of state.protocolsRaw) {
    const arr = Array.isArray(p?.chains) ? p.chains : p?.chain ? [p.chain] : [];
    arr.forEach((c) => c && chains.add(c));
  }
  const sel = $("#selChain");
  sel.innerHTML =
    `<option value="">${t("all_chains")}</option>` +
    Array.from(chains)
      .sort()
      .map((c) => `<option value="${c}">${c}</option>`)
      .join("");
  sel.value = state.chainFilter || "";

  // NEW: ensure enhancer exists & label synced
  ensureChainEnhancer();
  syncChainButtonLabel();
}
function applyStaticTexts() {
  $("#searchInput").placeholder = t("search_placeholder");
  $("#prefsTitle").textContent = t("prefs");
  $("#lblLang").textContent = t("language");
  $("#lblCcy").textContent = t("currency");
  $("#btnPrefsApply").textContent = t("apply");
  $("#btnPrefsCancel").textContent = t("cancel");
  buildChainOptions();
  buildHasOptions();
  updateSortButtonLabel();
  buildSortPopoverOptions();

  // keep chain button text up to date when language changes
  ensureChainEnhancer();
  syncChainButtonLabel();
}
function openPrefs() {
  closeSortPopover();
  applyStaticTexts();
  $("#selLang").value = state.pref.lang;
  $("#selCcy").value = state.pref.ccy;
  $("#prefsSheet").classList.add("open");
}
$("#btnPrefs").addEventListener("click", openPrefs);
$("#btnPrefsCancel").addEventListener("click", () => $("#prefsSheet").classList.remove("open"));
$("#btnPrefsApply").addEventListener("click", async () => {
  const newLang = $("#selLang").value;
  const newCcy = $("#selCcy").value;
  const langChanged = newLang !== state.pref.lang;
  const ccyChanged = newCcy !== state.pref.ccy;
  $("#prefsSheet").classList.remove("open");
  if (!langChanged && !ccyChanged) return;
  lockUI(t("loading"));
  state.pref.lang = newLang;
  state.pref.ccy = newCcy;
  localStorage.setItem("pref_lang", newLang);
  localStorage.setItem("pref_ccy", newCcy);
  if (ccyChanged) await ensureFx();
  applyStaticTexts();
  $("#feed").scrollTo({ top: 0, behavior: "smooth" });
  $("#feed").innerHTML = "";
  state.page = 0;
  sortProtocols();
  renderPage();
  const openSheetEl = $("#sheet");
  if (openSheetEl.classList.contains("open")) {
    const descEl = $("#sheetDesc");
    if (descEl) translateAndSet(descEl, descEl.textContent);
  }
  unlockUI();
});

// RENDER
async function renderPage() {
  const start = state.page * state.pageSize;
  const slice = state.protocols.slice(start, start + state.pageSize);
  const feed = $("#feed");

  slice.forEach((p) => {
    const narratives = getNarratives(p);
    const wrap = document.createElement("div");
    wrap.className = "snap-wrap";
    const card = document.createElement("section");
    card.className = "card";
    card.dataset.slug = p.slug;
    const chains = Array.isArray(p?.chains) ? p.chains.slice(0, 2).join(", ") : "";
    const chainsMore = Array.isArray(p?.chains) && p.chains.length > 2 ? " +" : "";
    const chainBadge = p?.chain ? p.chain : Array.isArray(p?.chains) ? p.chains[0] : "Multi";
    const logoSrc = p?.logo ? (p.logo.startsWith("http") ? p.logo : "https://icons.llama.fi/" + p.logo) : "";
    const priceNow = state.priceNow.get(p.slug);
    const priceChg = state.priceChg.get(p.slug);
    const tokenExists = hasToken(p);
    const ov = state.feesOverview.get(p.slug) || {};
    const fees24h = Number.isFinite(ov.fees24h) ? ov.fees24h : null;
    const rev24h = Number.isFinite(ov.revenue24h) ? ov.revenue24h : null;
    const chgVal = tokenExists && priceChg ? priceChg.change24h : null;
    const descId = `desc-${p.slug}`;
    card.innerHTML = `
            <div class="header">
              <div class="logo">${logoSrc ? `<img alt="${p?.name || ""}" src="${logoSrc}" loading="lazy" decoding="async">` : ``}</div>
              <div><div class="title">${p?.name || ""}</div><div class="subtitle">${p?.category || ""} • ${chains}${chainsMore}</div></div>
              <span class="badge">${chainBadge || "—"}</span>
            </div>
            <div class="desc" id="${descId}">—</div>
            <div class="metrics" id="m-${p.slug}">
              <div class="metric"><div class="label">${t("tvl")}</div><div class="value">${formatMoney(p?.tvl)}</div></div>
              <div class="metric"><div class="label">${t("tvl_7d")}</div><div class="value ${p?.change_7d > 0 ? "pos" : p?.change_7d < 0 ? "neg" : ""}">${pctStr(p?.change_7d)}</div></div>
              <div class="metric"><div class="label">${t("price")}</div><div class="value">${tokenExists ? (priceNow ? formatMoney(priceNow.price) : "—") : t("no_token")}</div></div>
              <div class="metric"><div class="label">${t("price_chg_24h")}</div><div class="value ${chgVal > 0 ? "pos" : chgVal < 0 ? "neg" : ""}">${tokenExists ? (priceChg ? pctStr(chgVal) : "—") : "—"}</div></div>
              <div class="metric"><div class="label">${t("fees_24h")}</div><div class="value">${fees24h != null ? formatMoney(fees24h) : "—"}</div></div>
              <div class="metric"><div class="label">${t("revenue_24h")}</div><div class="value">${rev24h != null ? formatMoney(rev24h) : "—"}</div></div>
            </div>
            <div class="badges">${narratives.map((n) => `<span class="badge">${n}</span>`).join("")}</div>
            <div class="actions">
              <button class="btn btn-primary" data-action="detail">${t("detail")}</button>
              <button class="watch ${state.watchlist.has(p.slug) ? "active" : ""}" data-action="watch">${state.watchlist.has(p.slug) ? "★" : "☆"}</button>
            </div>`;
    wrap.appendChild(card);
    feed.appendChild(wrap);
    translateAndSet(document.getElementById(descId), p?.description || "—");
    card.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const action = btn.dataset.action;
      if (action === "detail") openSheet(p);
      if (action === "watch") toggleWatch(btn, p);
    });
  });

  await fetchPricesForSlice(start, start + slice.length);

  slice.forEach((p) => {
    const metricsEl = document.querySelector(`section.card[data-slug="${p.slug}"] .metrics`);
    if (!metricsEl) return;
    const priceNow = state.priceNow.get(p.slug);
    const priceChg = state.priceChg.get(p.slug);
    const tokenExists = hasToken(p);
    if (tokenExists && priceNow) {
      metricsEl.querySelector(".metric:nth-child(3) .value").textContent = formatMoney(priceNow.price);
    }
    if (tokenExists && priceChg) {
      const vEl = metricsEl.querySelector(".metric:nth-child(4) .value");
      const chg = priceChg.change24h;
      vEl.textContent = pctStr(chg);
      vEl.classList.toggle("pos", chg > 0);
      vEl.classList.toggle("neg", chg < 0);
    }
  });

  state.page++;
  maybeLoadMore();
}

// INFINITE SCROLL via scroll listener
function maybeLoadMore() {
  const feed = $("#feed");
  const canLoad = state.page * state.pageSize < state.protocols.length;
  if (!canLoad) return;
  const nearBottom = feed.scrollTop + feed.clientHeight >= feed.scrollHeight - 200;
  if (nearBottom) renderPage();
}
$("#feed").addEventListener("scroll", maybeLoadMore);

// ===== Swipe-down to close for #sheet (with pull-to-refresh prevention)
(function attachSheetGesture() {
  const sheet = document.getElementById('sheet');
  if (!sheet) return;

  let startY = 0;
  let lastY = 0;
  let startTime = 0;
  let dragging = false;
  const THRESHOLD = 80;
  const VELOCITY_CLOSE = 0.6;
  const MAX_PULL = 320;

  function setTranslateY(y) {
    sheet.style.transform = `translateY(${Math.max(0, y)}px)`;
  }
  function resetTransform() {
    sheet.style.transform = '';
  }

  const origOpen = window.openSheet;
  if (typeof origOpen === 'function') {
    window.openSheet = async function(p) {
      document.body.classList.add('no-ptr');
      return origOpen(p);
    }
  }
  const origClose = window.closeSheet;
  if (typeof origClose === 'function') {
    window.closeSheet = function() {
      document.body.classList.remove('no-ptr');
      resetTransform();
      return origClose();
    }
  }

  const observer = new MutationObserver(() => {
    if (sheet.classList.contains('open')) {
      document.body.classList.add('no-ptr');
    } else {
      document.body.classList.remove('no-ptr');
      resetTransform();
    }
  });
  observer.observe(sheet, { attributes: true, attributeFilter: ['class'] });

  function canDragDown(dy) {
    return dy > 0 && (sheet.scrollTop <= 0);
  }

  sheet.addEventListener('touchstart', (e) => {
    if (!sheet.classList.contains('open')) return;
    if (!e.touches || !e.touches.length) return;
    startY = lastY = e.touches[0].clientY;
    startTime = performance.now();
    dragging = false;
  }, { passive: true });

  sheet.addEventListener('touchmove', (e) => {
    if (!sheet.classList.contains('open')) return;
    if (!e.touches || !e.touches.length) return;

    const y = e.touches[0].clientY;
    const dy = y - startY;

    if (!dragging) {
      if (canDragDown(dy)) {
        dragging = true;
        sheet.classList.add('dragging');
      } else {
        return;
      }
    }

    e.preventDefault();
    lastY = y;

    const pull = Math.min(MAX_PULL, Math.max(0, dy));
    setTranslateY(pull);
  }, { passive: false });

  sheet.addEventListener('touchend', () => {
    if (!dragging) return;
    const totalDy = Math.max(0, lastY - startY);
    const dt = Math.max(1, performance.now() - startTime);
    const velocity = totalDy / dt;

    const shouldClose = totalDy > THRESHOLD || velocity > VELOCITY_CLOSE;

    sheet.style.transition = 'transform 180ms ease';
    requestAnimationFrame(() => {
      if (shouldClose) {
        setTranslateY(window.innerHeight * 0.75);
        setTimeout(() => {
          sheet.style.transition = '';
          resetTransform();
          if (typeof window.closeSheet === 'function') window.closeSheet();
          sheet.classList.remove('dragging');
        }, 160);
      } else {
        setTranslateY(0);
        setTimeout(() => {
          sheet.style.transition = '';
          resetTransform();
          sheet.classList.remove('dragging');
        }, 160);
      }
    });

    dragging = false;
  }, { passive: true });

  sheet.addEventListener('touchcancel', () => {
    if (!dragging) return;
    sheet.style.transition = 'transform 160ms ease';
    setTranslateY(0);
    setTimeout(() => {
      sheet.style.transition = '';
      resetTransform();
      sheet.classList.remove('dragging');
      dragging = false;
    }, 150);
  }, { passive: true });
})();


// INIT
async function init(force) {
  try {
    lockUI(t("loading"));
    skeleton(3);
    state.page = 0;
    state.protocols = [];
    state.protocolsRaw = [];
    state.priceNow.clear();
    state.priceChg.clear();
    state.tokenKeys.clear();
    if (force) {
      state.feesOverview.clear();
      state.chainFilter = "";
      state.searchQuery = "";
      $("#searchInput").value = "";
      state.sortKey = "chg7d";
      state.hasKey = "any";
    }
    applyStaticTexts();
    await fetchProtocols();
    buildChainOptions();
    buildHasOptions();
    await fetchFeesOverview("");
    applyFilters();
    await ensureFx();
    $("#feed").innerHTML = "";
    if (!state.protocols.length) {
      $("#feed").innerHTML = `<div style="padding:24px;">${t("no_data")}</div>`;
      unlockUI();
      return;
    }
    sortProtocols();
    renderPage();
    unlockUI();
  } catch {
    $("#feed").innerHTML = `<div style="padding:24px;">${t("no_data")}</div>`;
    unlockUI();
  }
}

init();

