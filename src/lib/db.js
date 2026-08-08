// All reads/writes are scoped under users/{uid}/... so a person only ever
// touches their own data. See firestore.rules for the matching security rules.

import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

const userCol = (uid, name) => collection(db, "users", uid, name);

/* ----------------------------- tasks ----------------------------- */
export function watchTasks(uid, cb) {
  const q = query(userCol(uid, "tasks"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}
export function addTask(uid, task) {
  return addDoc(userCol(uid, "tasks"), {
    title: task.title,
    course: task.course || "",
    due: task.due || null,
    isHomework: Boolean(task.isHomework),
    done: false,
    proof: "",
    createdAt: serverTimestamp(),
  });
}
export function updateTask(uid, id, patch) {
  return updateDoc(doc(db, "users", uid, "tasks", id), patch);
}
export function deleteTask(uid, id) {
  return deleteDoc(doc(db, "users", uid, "tasks", id));
}

/* --------------------------- schedules --------------------------- */
export function watchSchedules(uid, cb) {
  const q = query(userCol(uid, "schedules"), orderBy("start", "asc"));
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}
export function addSchedule(uid, s) {
  return addDoc(userCol(uid, "schedules"), {
    label: s.label,
    days: s.days || [], // e.g. ["Mon","Wed"]
    start: s.start, // "16:00"
    durationMin: s.durationMin || 25,
    blocklistId: s.blocklistId || null,
    enabled: true,
    createdAt: serverTimestamp(),
  });
}
export function updateSchedule(uid, id, patch) {
  return updateDoc(doc(db, "users", uid, "schedules", id), patch);
}
export function deleteSchedule(uid, id) {
  return deleteDoc(doc(db, "users", uid, "schedules", id));
}

/* --------------------------- blocklists -------------------------- */
export function watchBlocklists(uid, cb) {
  const q = query(userCol(uid, "blocklists"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}
export function addBlocklist(uid, name) {
  return addDoc(userCol(uid, "blocklists"), {
    name,
    items: [], // [{ kind:"App"|"Site"|"URL", value:"Steam", locked:true }]
    createdAt: serverTimestamp(),
  });
}
export function updateBlocklist(uid, id, patch) {
  return updateDoc(doc(db, "users", uid, "blocklists", id), patch);
}
export function deleteBlocklist(uid, id) {
  return deleteDoc(doc(db, "users", uid, "blocklists", id));
}

/* ---------------------------- devices ---------------------------- */
export function watchDevices(uid, cb) {
  const q = query(userCol(uid, "devices"), orderBy("lastSeen", "desc"));
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}
export function renameDevice(uid, id, name) {
  return updateDoc(doc(db, "users", uid, "devices", id), { name });
}
export function removeDevice(uid, id) {
  return deleteDoc(doc(db, "users", uid, "devices", id));
}

/* ------------------------ browser pairing ------------------------ *
 * The web app creates a short-lived pairing code. The extension reads the
 * code the user types into it, finds this doc, and claims it by writing the
 * device back under the owner's uid. Codes live in a top-level collection so
 * the extension can look them up before it knows the uid.
 * ---------------------------------------------------------------- */
function randomCode(len = 6) {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let out = "";
  for (let i = 0; i < len; i++)
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export async function createPairingCode(uid) {
  const code = randomCode();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  await setDoc(doc(db, "pairingCodes", code), {
    uid,
    claimed: false,
    createdAt: serverTimestamp(),
    expiresAt,
  });
  return { code, expiresAt };
}

export function watchPairingCode(code, cb) {
  return onSnapshot(doc(db, "pairingCodes", code), (snap) =>
    cb(snap.exists() ? snap.data() : null)
  );
}

export async function getBrowsers(uid) {
  const snap = await getDocs(userCol(uid, "browsers"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
export function watchBrowsers(uid, cb) {
  return onSnapshot(userCol(uid, "browsers"), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}
export function removeBrowser(uid, id) {
  return deleteDoc(doc(db, "users", uid, "browsers", id));
}

/* ---------------------- account deletion ------------------------- *
 * Deletes every subcollection document we know about for this user.
 * Firestore has no recursive client delete, so we clear each collection.
 * ---------------------------------------------------------------- */
export async function deleteAllUserData(uid) {
  const collections = [
    "tasks",
    "schedules",
    "blocklists",
    "devices",
    "browsers",
  ];
  for (const name of collections) {
    const snap = await getDocs(userCol(uid, name));
    if (snap.empty) continue;
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
  const profile = doc(db, "users", uid);
  if ((await getDoc(profile)).exists()) await deleteDoc(profile);
}
