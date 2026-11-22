import { MongoClient, ObjectId } from "mongodb";
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
const sessions = db.collection("session");
const tuitions = db.collection("tuitions");
const applications = db.collection("applications");

const makeToken = async (userId) => {
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
  return token;
};

const be = "http://localhost:8000";
const req = async (path, token, body) => {
  const r = await fetch(`${be}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return { status: r.status, body: await r.json().catch(() => null) };
};

const tokens = [];

// ---- tutor limits ----
const tutor = await users.findOne({ role: "tutor", plan: "free" });
const tutorId = tutor._id.toString();
await tuitions.deleteMany({ title: /^TMP_LIMIT_/ });
const tutorExisting = await tuitions.countDocuments({ teacher_id: tutorId });
console.log(
  `free tutor: ${tutor.name} | existing posts=${tutorExisting} | plan=${tutor.plan} premium=${Boolean(tutor.premium)}`
);

const tutorToken = await makeToken(tutorId);
tokens.push(tutorToken);

const tuitionBody = {
  title: "TMP_LIMIT_TUITION",
  subject: "Mathematics",
  classLevel: "Class 6-8",
  teachingMode: "Online",
  monthlyFee: 1000,
  daysPerWeek: 2,
  location: "Online",
  bannerImage: "",
  description: "limit test",
  teacher_name: tutor.name,
  teacher_email: tutor.email,
  teacher_id: tutorId,
  status: "approved",
  createdAt: new Date(),
};

let successes = 0;
let blocked = null;
for (let i = 1; i <= 5; i++) {
  const r = await req("/tuitions", tutorToken, tuitionBody);
  if (r.status === 200) {
    successes++;
    console.log(`  tuition post #${i} -> 200`);
  } else {
    blocked = r;
    console.log(`  tuition post #${i} -> ${r.status} | ${r.body?.message}`);
    break;
  }
}
console.log(
  `tutor free-limit result: existing=${tutorExisting} inserted=${successes} finalCount=${await tuitions.countDocuments(
    { teacher_id: tutorId }
  )}`
);

// upgrade simulation -> pro bypass
await users.updateOne(
  { _id: new ObjectId(tutorId) },
  { $set: { plan: "pro", premium: true } }
);
const proRes = await req("/tuitions", tutorToken, {
  ...tuitionBody,
  title: "TMP_LIMIT_PRO_TUITION",
});
console.log(
  `after plan=pro: post -> ${proRes.status} ${proRes.status === 200 ? "(allowed)" : `| ${proRes.body?.message}`}`
);
await users.updateOne(
  { _id: new ObjectId(tutorId) },
  { $set: { plan: "free", premium: false } }
);

// ---- student limits ----
const student = await users.findOne({ role: "student", plan: "free" });
const studentId = student._id.toString();
await applications.deleteMany({ note: "TMP_LIMIT_APPLICATION" });
const studentExisting = await applications.countDocuments({
  student_id: studentId,
});
console.log(
  `free student: ${student.name} | existing applications=${studentExisting}`
);

const studentToken = await makeToken(studentId);
tokens.push(studentToken);

const applyBody = {
  tuition_id: "tmp-limit-tuition",
  tuition_title: "TMP_LIMIT_TUITION",
  teacher_id: tutorId,
  teacher_name: tutor.name,
  student_name: student.name,
  student_email: student.email,
  student_id: studentId,
  status: "pending",
  note: "TMP_LIMIT_APPLICATION",
  createdAt: new Date(),
};

let applySuccesses = 0;
let applyBlocked = null;
for (let i = 1; i <= 5; i++) {
  const r = await req("/applications", studentToken, applyBody);
  if (r.status === 200) {
    applySuccesses++;
    console.log(`  application #${i} -> 200`);
  } else {
    applyBlocked = r;
    console.log(`  application #${i} -> ${r.status} | ${r.body?.message}`);
    break;
  }
}
console.log(
  `student free-limit result: existing=${studentExisting} inserted=${applySuccesses} finalCount=${await applications.countDocuments(
    { student_id: studentId }
  )}`
);

await users.updateOne(
  { _id: new ObjectId(studentId) },
  { $set: { plan: "pro", premium: true } }
);
const proApply = await req("/applications", studentToken, applyBody);
console.log(
  `after plan=pro: application -> ${proApply.status} ${proApply.status === 200 ? "(allowed)" : `| ${proApply.body?.message}`}`
);
await users.updateOne(
  { _id: new ObjectId(studentId) },
  { $set: { plan: "free", premium: false } }
);

// ---- cleanup ----
const delT = await tuitions.deleteMany({ title: /^TMP_LIMIT_/ });
const delA = await applications.deleteMany({ note: "TMP_LIMIT_APPLICATION" });
await sessions.deleteMany({ token: { $in: tokens } });
console.log(
  `cleanup: tuitions=${delT.deletedCount} applications=${delA.deletedCount} sessions=${tokens.length}`
);
console.log(
  `post-cleanup counts -> tutor tuitions=${await tuitions.countDocuments({
    teacher_id: tutorId,
  })} | student applications=${await applications.countDocuments({
    student_id: studentId,
  })}`
);

await client.close();
