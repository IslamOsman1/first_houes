import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { readDb, updateDb } from './store.js';
import { requireAuth, signToken } from './auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 5000);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = CLIENT_URL.split(',').map(v => v.trim());
app.use(cors({ origin(origin, cb) {
  if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
  cb(new Error('Origin not allowed by CORS'));
} }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => cb(null, /^image\//.test(file.mimetype))
});

function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const safeBaseName = path.parse(file.originalname).name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `image-${Date.now()}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'first-house',
        resource_type: 'image',
        public_id: `${safeBaseName}-${randomUUID()}`
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
}

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.get('/api/public', async (_, res, next) => {
  try {
    const db = await readDb();
    res.json({ settings: db.settings, services: db.services, projects: db.projects, banners: db.banners || [] });
  } catch (error) { next(error); }
});

app.post('/api/contact', async (req, res, next) => {
  try {
    const { name, phone, email = '', subject = '', message } = req.body;
    if (!name || !phone || !message) return res.status(400).json({ message: 'الاسم ورقم الهاتف والرسالة مطلوبة' });
    const item = { id: randomUUID(), name, phone, email, subject, message, createdAt: new Date().toISOString(), read: false };
    await updateDb(db => { db.messages.unshift(item); return db; });
    res.status(201).json({ message: 'تم إرسال رسالتك بنجاح وسنتواصل معك قريبًا' });
  } catch (error) { next(error); }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@firsthouse.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const valid = email?.toLowerCase() === adminEmail.toLowerCase() && await bcrypt.compare(password || '', passwordHash);
  if (!valid) return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
  res.json({ token: signToken({ email: adminEmail, role: 'admin' }), user: { email: adminEmail, role: 'admin' } });
});

app.get('/api/admin/data', requireAuth, async (_, res, next) => {
  try { res.json(await readDb()); } catch (error) { next(error); }
});

app.put('/api/admin/settings', requireAuth, async (req, res, next) => {
  try {
    const db = await updateDb(db => { db.settings = { ...db.settings, ...req.body }; return db; });
    res.json(db.settings);
  } catch (error) { next(error); }
});

app.post('/api/admin/services', requireAuth, async (req, res, next) => {
  try {
    const item = { id: randomUUID(), title: req.body.title, description: req.body.description, icon: req.body.icon || 'Building2' };
    const db = await updateDb(db => { db.services.push(item); return db; });
    res.status(201).json(db.services);
  } catch (error) { next(error); }
});
app.put('/api/admin/services/:id', requireAuth, async (req, res, next) => {
  try {
    const db = await updateDb(db => { db.services = db.services.map(item => item.id === req.params.id ? { ...item, ...req.body, id: item.id } : item); return db; });
    res.json(db.services);
  } catch (error) { next(error); }
});
app.delete('/api/admin/services/:id', requireAuth, async (req, res, next) => {
  try {
    const db = await updateDb(db => { db.services = db.services.filter(item => item.id !== req.params.id); return db; });
    res.json(db.services);
  } catch (error) { next(error); }
});

app.post('/api/admin/projects', requireAuth, async (req, res, next) => {
  try {
    const item = { id: randomUUID(), title: req.body.title, category: req.body.category, location: req.body.location, description: req.body.description, image: req.body.image || '/project-villa.svg', featured: Boolean(req.body.featured) };
    const db = await updateDb(db => { db.projects.unshift(item); return db; });
    res.status(201).json(db.projects);
  } catch (error) { next(error); }
});
app.put('/api/admin/projects/:id', requireAuth, async (req, res, next) => {
  try {
    const db = await updateDb(db => { db.projects = db.projects.map(item => item.id === req.params.id ? { ...item, ...req.body, id: item.id } : item); return db; });
    res.json(db.projects);
  } catch (error) { next(error); }
});
app.delete('/api/admin/projects/:id', requireAuth, async (req, res, next) => {
  try {
    const db = await updateDb(db => { db.projects = db.projects.filter(item => item.id !== req.params.id); return db; });
    res.json(db.projects);
  } catch (error) { next(error); }
});

app.post('/api/admin/banners', requireAuth, async (req, res, next) => {
  try {
    const item = { id: randomUUID(), title: req.body.title || '', link: req.body.link || '', image: req.body.image || '', active: req.body.active !== false };
    const db = await updateDb(db => { db.banners = db.banners || []; db.banners.unshift(item); return db; });
    res.status(201).json(db.banners);
  } catch (error) { next(error); }
});
app.put('/api/admin/banners/:id', requireAuth, async (req, res, next) => {
  try {
    const db = await updateDb(db => { db.banners = (db.banners || []).map(item => item.id === req.params.id ? { ...item, ...req.body, id: item.id } : item); return db; });
    res.json(db.banners);
  } catch (error) { next(error); }
});
app.delete('/api/admin/banners/:id', requireAuth, async (req, res, next) => {
  try {
    const db = await updateDb(db => { db.banners = (db.banners || []).filter(item => item.id !== req.params.id); return db; });
    res.json(db.banners);
  } catch (error) { next(error); }
});

app.post('/api/admin/upload', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'اختر صورة صالحة' });
    if (!hasCloudinaryConfig) {
      return res.status(500).json({ message: 'إعدادات Cloudinary غير مكتملة في الخادم' });
    }

    const result = await uploadToCloudinary(req.file);
    res.status(201).json({ url: result.secure_url });
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/messages/:id/read', requireAuth, async (req, res, next) => {
  try {
    const db = await updateDb(db => { db.messages = db.messages.map(item => item.id === req.params.id ? { ...item, read: true } : item); return db; });
    res.json(db.messages);
  } catch (error) { next(error); }
});
app.delete('/api/admin/messages/:id', requireAuth, async (req, res, next) => {
  try {
    const db = await updateDb(db => { db.messages = db.messages.filter(item => item.id !== req.params.id); return db; });
    res.json(db.messages);
  } catch (error) { next(error); }
});

const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('/{*splat}', (_, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.use((error, _, res, __) => {
  console.error(error);
  if (error instanceof multer.MulterError) return res.status(400).json({ message: 'الصورة أكبر من الحد المسموح (5MB)' });
  res.status(500).json({ message: 'حدث خطأ غير متوقع في الخادم' });
});

app.listen(PORT, () => console.log(`First House API running on http://localhost:${PORT}`));
