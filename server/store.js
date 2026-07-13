import fs from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is required to run the server');
}

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
    services: { type: [mongoose.Schema.Types.Mixed], default: [] },
    projects: { type: [mongoose.Schema.Types.Mixed], default: [] },
    team: { type: [mongoose.Schema.Types.Mixed], default: [] },
    messages: { type: [mongoose.Schema.Types.Mixed], default: [] },
    banners: { type: [mongoose.Schema.Types.Mixed], default: [] }
  },
  {
    versionKey: false
  }
);

const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', siteContentSchema);

let connectPromise;

function normalizeDb(doc) {
  return {
    settings: doc?.settings || {},
    services: Array.isArray(doc?.services) ? doc.services : [],
    projects: Array.isArray(doc?.projects) ? doc.projects : [],
    team: Array.isArray(doc?.team) ? doc.team : [],
    messages: Array.isArray(doc?.messages) ? doc.messages : [],
    banners: Array.isArray(doc?.banners) ? doc.banners : []
  };
}

async function seedFromFile() {
  const raw = await fs.readFile(DB_PATH, 'utf8');
  const fileData = JSON.parse(raw);

  await SiteContent.create({
    key: 'primary',
    ...normalizeDb(fileData)
  });
}

export async function connectDb() {
  if (!connectPromise) {
    connectPromise = mongoose.connect(MONGODB_URI).then(async () => {
      const existing = await SiteContent.findOne({ key: 'primary' }).lean();
      if (!existing) {
        await seedFromFile();
      }
      return mongoose.connection;
    });
  }

  return connectPromise;
}

export async function readDb() {
  await connectDb();
  const doc = await SiteContent.findOne({ key: 'primary' }).lean();
  return normalizeDb(doc);
}

export async function writeDb(data) {
  await connectDb();
  const normalized = normalizeDb(data);

  await SiteContent.findOneAndUpdate(
    { key: 'primary' },
    { $set: normalized, $setOnInsert: { key: 'primary' } },
    { upsert: true, new: true }
  );

  return normalized;
}

export async function updateDb(mutator) {
  const db = await readDb();
  const draft = structuredClone(db);
  const updated = await mutator(draft) || draft;
  return writeDb(updated);
}
