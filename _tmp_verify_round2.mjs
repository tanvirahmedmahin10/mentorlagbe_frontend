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

const makeCookies = async (userId) => {
  const token = ("tmp" + Math.random().toString(36).slice(2))
    .padEnd(32, "x")
    .slice(0, 32);
  await sessions.insertOne({
    token,
    userId: new ObjectId(userId),
    expiresAt: new Date(Date.now() + 600_000),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const sig = createHmac("sha256", env.BETTER_AUTH_SECRET)
    .update(token)
    .digest("base64");
  return {
    token,
    cookie: `better-auth.session_token=${token}.${sig}`,
  };
};

const proStudent = await users.findOne({ role: "student", plan: "pro" });
const freeTutor = await users.findOne({ role: "tutor", plan: "free" });
const proTutor = await users.findOne({ role: "tutor", plan: "pro" });

const proStudentAuth = await makeCookies(proStudent._id.toString());
const freeTutorAuth = await makeCookies(freeTutor._id.toString());
const proTutorAuth = await makeCookies(proTutor._id.toString());

const fe = "http://localhost:3000";
const html = async (res) => res.text();

let res = await fetch(`${fe}/`);
let body = await html(res);
console.log(`/ (anon)                      -> ${res.status}`);
for (const needle of [
  "MentorLagbe Pro Plans",
  "Free to start, Pro when you need more",
  "Student Pro",
  "Tutor Pro",
  "What students &amp; tutors say",
  "Active Tuitions",
  "Verified Tutors",
]) {
  console.log(`  contains ${JSON.stringify(needle).padEnd(42)} -> ${body.includes(needle)}`);
}

res = await fetch(`${fe}/api/auth/get-session`, {
  headers: { cookie: proStudentAuth.cookie },
});
const sessionJson = await res.json();
console.log(
  `/api/auth/get-session (pro)   -> ${res.status} | plan=${sessionJson?.user?.plan ?? "-"} | premium=${sessionJson?.user?.premium ?? "-"}`
);

res = await fetch(`${fe}/payments`, { headers: { cookie: proStudentAuth.cookie } });
body = await html(res);
console.log(`/payments (pro student)       -> ${res.status} | Already Subscribed=${body.includes("Already Subscribed")}`);

res = await fetch(`${fe}/payments`, { headers: { cookie: freeTutorAuth.cookie } });
body = await html(res);
console.log(`/payments (free tutor)        -> ${res.status} | Pay $15 & Upgrade=${body.includes("Pay $15 &amp; Upgrade") || body.includes("Pay $15 & Upgrade")}`);

res = await fetch(`${fe}/`);
body = await html(res);
console.log(`/ (anon again, role badge absent) -> ${res.status}`);

res = await fetch(`${fe}/dashboard/admin/users`, {
  headers: { cookie: (await makeCookies((await users.findOne({ role: "admin" }))._id.toString())).cookie },
});
body = await html(res);
console.log(`/dashboard/admin/users        -> ${res.status} | Pro label present=${body.includes(">Pro<")}`);

await sessions.deleteMany({
  token: { $in: [proStudentAuth.token, freeTutorAuth.token, proTutorAuth.token] },
});
console.log("temp sessions cleaned:", (await sessions.countDocuments({ token: /^tmp/ })) === 0);
await client.close();
