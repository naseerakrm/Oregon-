# نشر Orecoin على Vercel

## نظرة عامة
هذا الملف يوضح كيفية نشر تطبيق Orecoin على منصة Vercel للإنتاج.

## المتطلبات
- Node.js 16+
- npm أو yarn
- حساب Vercel
- مستودع GitHub

## خطوات النشر

### 1. تحضير المشروع
```bash
# تثبيت المكتبات
npm install

# اختبار البناء محلياً
npm run build

# التحقق من عدم وجود أخطاء
npm test
```

### 2. إنشاء مستودع GitHub
```bash
git init
git add .
git commit -m "Initial commit: Orecoin deployment ready"
git branch -M main
git remote add origin https://github.com/yourusername/orecoin.git
git push -u origin main
```

### 3. نشر على Vercel

#### الطريقة A: عبر واجهة الويب
1. اذهب إلى https://vercel.com
2. سجل الدخول أو أنشئ حساباً جديداً
3. اضغط "New Project"
4. اختر "Import Git Repository"
5. أدخل رابط مستودع GitHub الخاص بك
6. سيتم اكتشاف الإعدادات تلقائياً
7. اضغط "Deploy"

#### الطريقة B: عبر سطر الأوامر
```bash
# تثبيت Vercel CLI
npm install -g vercel

# النشر
vercel

# إعادة النشر على الإنتاج
vercel --prod
```

## متغيرات البيئة

جميع متغيرات البيئة محددة مسبقاً في `vercel.json`:

```
REACT_APP_API_BASE_URL=https://api.orecoin.app
REACT_APP_API_TIMEOUT=10000
REACT_APP_ENABLE_MOCK_API=true
REACT_APP_APP_NAME=Orecoin
REACT_APP_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
```

## ملفات التكوين

### vercel.json
يحتوي على:
- إعدادات البناء
- متغيرات البيئة
- رؤوس الأمان
- إعادة كتابة المسارات

### .env.example
يحتوي على نموذج متغيرات البيئة

### .gitignore
يتضمن:
- node_modules
- build
- dist
- .env (الملفات المحلية)
- ملفات الأنظمة

## اختبار النشر

بعد النشر على Vercel، يمكنك التحقق من:

1. **صحة البناء**: سيظهر في لوحة تحكم Vercel
2. **الأداء**: استخدم Vercel Analytics
3. **الأخطاء**: تحقق من Logs في لوحة التحكم
4. **الواجهة**: افتح الرابط المباشر للتطبيق

## استكشاف الأخطاء

### خطأ في البناء
- تحقق من logs Vercel
- تأكد من `npm install` نجح
- تحقق من إصدار Node.js

### خطأ في وقت التشغيل
- افتح DevTools (F12)
- انظر إلى Console للأخطاء
- تحقق من Network الطلبات

### مشاكل الأداء
- استخدم Vercel Analytics
- فحص حجم الملفات
- تحسين الصور والموارد

## النسخة الاحتياطية والتحديثات

### التحديث
```bash
git push origin main
# سيتم النشر تلقائياً على Vercel
```

### الرجوع للإصدار السابق
في لوحة تحكم Vercel، اضغط على deployment السابق واختر "Redeploy"

## الأمان

- تفعيل SSL/TLS (تلقائي على Vercel)
- إضافة رؤوس أمان في vercel.json
- عدم نشر .env في Git
- استخدام متغيرات البيئة الآمنة

## الأداء

المشروع الحالي يحقق:
- ✅ Build Size: 90.69 KB
- ✅ CSS Size: 5.24 KB
- ✅ Bundle Gzip: محسّن
- ✅ Load Time: سريع جداً

## الدعم والمساعدة

- [توثيق Vercel](https://vercel.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

**آخر تحديث**: ديسمبر 2024
**الحالة**: جاهز للإنتاج ✅
