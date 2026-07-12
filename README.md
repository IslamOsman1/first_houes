# فرست هاوس للمقاولات

موقع عربي متكامل لشركة مقاولات، يحتوي على:

- واجهة عامة للموقع
- لوحة تحكم للإدارة
- إدارة خدمات ومشروعات ورسائل العملاء
- بنرات رئيسية قابلة للتعديل

## التقنيات

- Frontend: React + Vite
- Backend: Node.js + Express
- التخزين: MongoDB
- Authentication: JWT
- رفع الصور: Multer + Cloudinary

## التشغيل المحلي

يشترط Node.js 20 أو أحدث.

```bash
npm install
npm run install:all
npm run dev
```

ثم افتح:

- الواجهة: `http://localhost:5173`
- لوحة التحكم: `http://localhost:5173/admin/login`

## بيانات دخول لوحة التحكم

- Email: `admin@firsthouse.com`
- Password: `Admin@123`

انسخ ملف:

`server/.env.example`

إلى:

`server/.env`

ثم عدل القيم قبل العمل أو النشر.

## أوامر مهمة

```bash
npm run dev
npm run build
npm start
```

## النشر على Vercel

الواجهة الأمامية موجودة داخل مجلد `client`.

إعدادات Vercel:

- Framework Preset: `Vite`
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`

متغيرات البيئة المطلوبة في Vercel:

- `VITE_API_URL=https://your-render-service.onrender.com`

تمت إضافة ملف:

- `client/vercel.json`

وتمت إضافة ملف مثال للمتغيرات:

- `client/.env.example`

## النشر على Render

الخادم موجود داخل مجلد `server`.

تمت إضافة ملف جاهز:

- `render.yaml`

يمكنك إنشاء Web Service على Render من نفس المستودع أو استخدام `Blueprint`.

إعدادات الخدمة:

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

متغيرات البيئة المطلوبة في Render:

- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CLIENT_URL`
- `MONGODB_URI`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

مثال `CLIENT_URL`:

- `https://your-project.vercel.app`

## ملاحظات النشر

- إذا كانت الواجهة على Vercel والخادم على Render، يجب ضبط:
  - `VITE_API_URL` في Vercel
  - `CLIENT_URL` في Render
- غير `JWT_SECRET` وبيانات الأدمن قبل النشر الفعلي.
- الصور الجديدة التي تُرفع من لوحة التحكم تُحفظ على Cloudinary مباشرة.
- عند أول تشغيل مع MongoDB، سيتم نقل البيانات الابتدائية تلقائيًا من الملف `server/data/db.json` إلى قاعدة البيانات إذا كانت القاعدة فارغة.
- المسار المحلي `server/uploads` ما زال موجودًا فقط لدعم الصور القديمة المخزنة سابقًا داخل المشروع.
