import { spawn } from "child_process";

console.log("=== STARTING NEXT DEV SERVER TEST ===");

const PORT = 3010;
const child = spawn("cmd.exe", ["/c", "npx", "next", "dev", "-p", String(PORT)], {
  cwd: "c:\\Users\\lenovo\\OneDrive\\Desktop\\Projects\\NewProject\\Frontend\\pictures",
  env: { ...process.env, PORT: String(PORT) },
});

let logs = "";

child.stdout.on("data", (d) => {
  const text = d.toString();
  logs += text;
  process.stdout.write(text);
});

child.stderr.on("data", (d) => {
  const text = d.toString();
  logs += text;
  process.stderr.write(text);
});

// Wait up to 15 seconds for server ready
let ready = false;
for (let i = 0; i < 30; i++) {
  if (logs.includes("Ready in")) {
    ready = true;
    break;
  }
  await new Promise((r) => setTimeout(r, 500));
}

if (!ready) {
  console.log("Server did not report ready within 15 seconds, checking logs...");
}

// Give 2 extra seconds
await new Promise((r) => setTimeout(r, 2000));

async function probe(path) {
  const url = `http://localhost:${PORT}${path}`;
  console.log(`\n>>> [GET] ${url}`);
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log(`<<< [STATUS] ${res.status} (Length: ${text.length} bytes)`);
    return { status: res.status, text };
  } catch (err) {
    console.log(`<<< [ERROR] ${err.message}`);
    return { error: err.message };
  }
}

const termsRes = await probe("/terms");
const adminRes = await probe("/admin");
const footerPagesRes = await probe("/admin/footer-pages");
const newPageRes = await probe("/admin/footer-pages/new");

// Wait 4 seconds for any async segment validation or compiler warnings
await new Promise((r) => setTimeout(r, 4000));

// Stop child process cleanly
try {
  spawn("taskkill", ["/pid", String(child.pid), "/f", "/t"]);
} catch (e) {}

console.log("\n================ DEV LOGS VERIFICATION RESULTS ================");
const hasInstantWarn =
  logs.includes("Could not validate that a segment in your UI has instant navigation") ||
  logs.includes("Dropped segment during validation");

const hasUncachedWarn =
  logs.includes("Next.js encountered uncached data during prerendering or a navigation") ||
  logs.includes("Backend fetch is accessed outside the required Suspense");

console.log("1. 'Instant navigation / dropped segment' warning present?:", hasInstantWarn);
console.log("2. 'Uncached data outside Suspense boundary' warning present?:", hasUncachedWarn);
console.log("3. /terms response status:", termsRes.status);
console.log("4. /admin response status:", adminRes.status);
console.log("5. /admin/footer-pages response status:", footerPagesRes.status);
console.log("6. /admin/footer-pages/new response status:", newPageRes.status);
console.log("================================================================");

process.exit(0);
