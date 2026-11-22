import { MongoClient, ObjectId } from "mongodb";
import { readFileSync } from "fs";
import { createHmac } from "crypto";

const env = Object.fromEntries(
  readFileSync("./.env", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [
        l.slice(0, i).trim(),
        l.slice(i + 1).trim().replace(/^["']|["']$/g, ""),
      ];
    })
);

const client = new MongoClient(env.MONGO_DB_URL);
await client.connect();
const db = client.db("mentorlagbe");
const sessions = db.collection("session");
const users = db.collection("user");

const stale = await sessions.find({ token: /^tmp/ }).toArray();
console.log("leftover tmp sessions:", stale.map((s) => s.token));
await sessions.deleteMany({ token: /^tmp/ });

const proStudent = await users.findOne({ role: "student", plan: "pro" });
const token = ("tmp" + Math.random().toString(36).slice(2)).padEnd(32, "x").slice(0, 32);
await sessions.insertOne({
  token,
  userId: proStudent._id,
  expiresAt: new Date(Date.now() + 600_000),
  createdAt: new Date(),
  updatedAt: new Date(),
});
const sig = createHmac("sha256", env.BETTER_AUTH_SECRET).update(token).digest("base64");
const cookie = `better-auth.session_token=${token}.${sig}`;

const res = await fetch("http://localhost:3000/payments", { headers: { cookie } });
const body = await res.text();
const idx = body.indexOf("Upgrade Your Account");
console.log("status:", res.status, "| length:", body.length, "| has heading:", idx >= 0);
console.log("contains 'Already':", body.includes("Already"));
console.log("contains 'You&#x27;re Already on':", body.includes("Already on"));
console.log("contains 'One-time upgrade':", body.includes("One-time upgrade"));
console.log("contains 'Signed in as':", body.includes("Signed in as"));
console.log("---- slice ----");
const at = body.indexOf("One-time upgrade");
console.log(body.slice(Math.max(0, at - 200), at + 900).replace(/></g, ">\n<"));

await sessions.deleteMany({ token });
await client.close();
