import { MongoClient } from "mongodb";
import { readFileSync } from "fs";

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
const users = db.collection("user");

const missing = await users.updateMany(
  { $or: [{ plan: { $exists: false } }, { plan: null }, { plan: "" }] },
  { $set: { plan: "free" } }
);
console.log(`plan missing -> free        : matched=${missing.matchedCount} modified=${missing.modifiedCount}`);

const toPro = await users.updateMany(
  { premium: true, plan: { $ne: "pro" } },
  { $set: { plan: "pro" } }
);
console.log(`premium true -> plan pro    : matched=${toPro.matchedCount} modified=${toPro.modifiedCount}`);

const rows = await users
  .find({}, { projection: { name: 1, role: 1, plan: 1, premium: 1 } })
  .toArray();
console.log("---- users ----");
for (const u of rows) {
  console.log(
    `${(u.name ?? "-").padEnd(18)} role=${String(u.role).padEnd(8)} plan=${String(u.plan).padEnd(5)} premium=${Boolean(u.premium)}`
  );
}

await client.close();
