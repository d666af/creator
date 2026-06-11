// Webhook listener — pure Node.js, zero dependencies
// Listens on port 3002, verifies GitHub HMAC signature, runs deploy.sh

const http = require("http");
const crypto = require("crypto");
const { exec } = require("child_process");
const path = require("path");

const SECRET = process.env.WEBHOOK_SECRET;
const PORT = process.env.WEBHOOK_PORT || 3002;
const BRANCH = "refs/heads/claude/minimal-design-platform-jhzm4d";
const DEPLOY_SCRIPT = path.join(__dirname, "deploy.sh");

if (!SECRET) {
  console.error("WEBHOOK_SECRET env var is required");
  process.exit(1);
}

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/deploy") {
    res.writeHead(404).end("Not found");
    return;
  }

  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const body = Buffer.concat(chunks);

    // Verify signature
    const sig = req.headers["x-hub-signature-256"];
    const expected = "sha256=" + crypto.createHmac("sha256", SECRET).update(body).digest("hex");
    if (!sig || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      console.warn("[webhook] Invalid signature");
      res.writeHead(401).end("Unauthorized");
      return;
    }

    // Parse payload
    let payload;
    try {
      payload = JSON.parse(body.toString());
    } catch {
      res.writeHead(400).end("Bad JSON");
      return;
    }

    // Only deploy for the target branch
    if (payload.ref !== BRANCH) {
      res.writeHead(200).end("Skipped — not target branch");
      return;
    }

    res.writeHead(200).end("Deploy started");
    console.log(`[webhook] Deploying commit ${payload.after?.slice(0, 7)}`);

    exec(`bash ${DEPLOY_SCRIPT}`, (err, stdout, stderr) => {
      if (err) {
        console.error("[webhook] Deploy failed:", stderr);
      } else {
        console.log("[webhook] Deploy OK");
      }
    });
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Webhook listener running on 127.0.0.1:${PORT}`);
});
