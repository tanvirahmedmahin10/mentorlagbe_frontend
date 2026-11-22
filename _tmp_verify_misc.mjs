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

const token = ("tmp" + Math.random().toString(36).slice(2))
  .padEnd(32, "x")
  .slice(0, 32);
const tutor = await users.findOne({ role: "tutor", plan: "free" });
await sessions.insertOne({
  token,
  userId: tutor._id,
  expiresAt: new Date(Date.now() + 600_000),
  createdAt: new Date(),
  updatedAt: new Date(),
});
const sig = createHmac("sha256", env.BETTER_AUTH_SECRET).update(token).digest("base64");
const cookie = `better-auth.session_token=${token}.${sig}`;

let res = await fetch("http://localhost:3000/", { headers: { cookie } });
let body = await res.text();
console.log(`/ (signed in tutor) -> ${res.status}`);
console.log(`  role badge 'tutor' present  -> ${body.includes(">tutor<")}`);
console.log(`  pricing section present     -> ${body.includes("MentorLagbe Pro Plans")}`);
console.log(`  subscribe CTA present       -> ${body.includes("Subscribe with Stripe")}`);

res = await fetch("http://localhost:3000/_tmp_throw");
body = await res.text();
console.log(`/_tmp_throw -> ${res.status}`);
console.log(`  error boundary heading      -> ${body.includes("We hit an unexpected error")}`);
console.log(`  Try Again button            -> ${body.includes("Try Again")}`);

await sessions.deleteMany({ token });
await client.close();
