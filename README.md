# YouTube Downloader – تعليمات التشغيل والنشر

## المتطلبات الأساسية
- Python 3.8+
- Node.js 18+
- npm

## تشغيل المشروع محليًا

1. تثبيت متطلبات الواجهة الأمامية:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. تثبيت متطلبات بايثون:
   ```bash
   pip install -r requirements.txt
   ```
3. تشغيل السيرفر:
   ```bash
   python backend/backend.py
   ```

## النشر على منصات مثل Railway أو Render

1. تأكد أن ملف `Procfile` موجود ويحتوي:
   ```
   web: python backend/backend.py
   ```
2. تأكد من وجود `requirements.txt` في الجذر.
3. في إعدادات المنصة:
   - **Build Command:**
     ```bash
     cd frontend && npm install && npm run build
     ```
   - **Start Command:**
     ```bash
     python backend/backend.py
     ```
4. المنفذ الافتراضي هو 5000. إذا تطلبت المنصة متغير PORT، يمكنك تعديله في الكود.

## ملاحظات
- يتم تقديم ملفات React تلقائيًا من Flask بعد البناء.
- إذا كنت تستخدم برامج تحميل خارجية (IDM)، قد تفتح نافذة جديدة وهذا خارج سيطرة الموقع.
- جميع إعدادات CORS مفعلة افتراضيًا.

## دعم تحميل الفيديوهات المحمية (YouTube Cookies)

إذا واجهت رسالة خطأ من يوتيوب أو لم يعمل التحميل لبعض الفيديوهات:
1. يمكنك استخراج ملف cookies.txt من متصفحك (مثلاً عبر إضافة [Get cookies.txt](https://chrome.google.com/webstore/detail/get-cookiestxt/)
2. ضع الملف في مجلد backend باسم `cookies.txt`
3. سيستخدمه السيرفر تلقائيًا لتجاوز بعض الحمايات

**تحذير:** لا تشارك ملف الكوكيز مع أي شخص آخر!
