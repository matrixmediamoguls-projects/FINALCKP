// Temporary diagnostic: load the app in headless Edge via CDP and dump console + exceptions.
const TARGET_URL = process.argv[2] || "http://localhost:3000/";
const WAIT_MS = Number(process.argv[3] || 20000);

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9222/json/list");
      const targets = await res.json();
      const page = targets.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("Could not reach Edge CDP endpoint on :9222");
}

const wsUrl = await getWsUrl();
const ws = new WebSocket(wsUrl);
let id = 0;
const send = (method, params = {}) => ws.send(JSON.stringify({ id: ++id, method, params }));

const lines = [];
const record = (s) => {
  lines.push(s);
  console.log(s);
};

ws.addEventListener("open", () => {
  send("Runtime.enable");
  send("Log.enable");
  send("Page.enable");
  send("Network.enable");
  send("Page.navigate", { url: TARGET_URL });
});

ws.addEventListener("message", (ev) => {
  let msg;
  try {
    msg = JSON.parse(ev.data);
  } catch {
    return;
  }
  const { method, params } = msg;
  if (method === "Runtime.consoleAPICalled") {
    const text = (params.args || [])
      .map((a) => a.value ?? a.description ?? a.unserializableValue ?? JSON.stringify(a.preview ?? ""))
      .join(" ");
    if (params.type === "error" || params.type === "warning") {
      record(`[console.${params.type}] ${text}`);
    }
  } else if (method === "Runtime.exceptionThrown") {
    const d = params.exceptionDetails;
    const frames = (d.stackTrace?.callFrames || [])
      .slice(0, 8)
      .map((f) => `      at ${f.functionName || "<anon>"} (${f.url}:${f.lineNumber + 1}:${f.columnNumber})`)
      .join("\n");
    record(`[EXCEPTION] ${d.exception?.description || d.text}\n${frames}`);
  } else if (method === "Log.entryAdded") {
    const e = params.entry;
    if (e.level === "error") record(`[log.${e.source}] ${e.text} ${e.url || ""}`);
  } else if (method === "Network.loadingFailed") {
    record(`[net.failed] ${params.type} ${params.errorText}`);
  }
});

await new Promise((r) => setTimeout(r, WAIT_MS));

// Report what actually rendered into #root.
const evalId = ++id;
ws.send(
  JSON.stringify({
    id: evalId,
    method: "Runtime.evaluate",
    params: {
      expression: `JSON.stringify({
        url: location.href,
        rootChildren: document.getElementById('root')?.childElementCount ?? -1,
        rootHTML: (document.getElementById('root')?.innerHTML || '').slice(0, 400),
        bodyText: (document.body.innerText || '').slice(0, 300)
      })`,
      returnByValue: true,
    },
  })
);

const result = await new Promise((resolve) => {
  const onMsg = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id === evalId) {
      ws.removeEventListener("message", onMsg);
      resolve(msg.result?.result?.value);
    }
  };
  ws.addEventListener("message", onMsg);
  setTimeout(() => resolve("(evaluate timed out)"), 8000);
});

console.log("\n===== DOM STATE =====");
console.log(result);
console.log("\n===== ERROR COUNT: " + lines.length + " =====");
ws.close();
process.exit(0);
