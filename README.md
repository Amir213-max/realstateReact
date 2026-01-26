# موقع عقاراتي - MyRealEstate Platform

منصة عقارية متكاملة مشابهة لموقع ناوي، مبنية باستخدام Next.js مع دعم كامل للغة العربية والإنجليزية و RTL/LTR.

## 🚀 المميزات

- ✅ Next.js 16 (App Router)
- ✅ JavaScript
- ✅ Tailwind CSS مع دعم RTL كامل
- ✅ Mock Data جاهزة (JSON files)
- ✅ Context API للغة
- ✅ Hooks مخصصة
- ✅ جميع الصفحات والمكونات جاهزة
- ✅ Modals و Interactions
- ✅ Toast Notifications
- ✅ Image Gallery (Swiper)
- ✅ WhatsApp Integration
- ✅ Contact Forms (Mock)

## 📁 هيكل المشروع

```
real_estate_investment/
├── app/
│   ├── layout.js              # Root Layout مع LanguageProvider
│   ├── page.js                # الصفحة الرئيسية
│   ├── destinations/
│   │   ├── page.js            # قائمة الوجهات
│   │   └── [id]/page.js       # تفاصيل الوجهة
│   ├── developers/
│   │   └── [id]/page.js       # تفاصيل المطور
│   ├── projects/
│   │   └── [id]/page.js       # تفاصيل المشروع
│   └── units/
│       └── [id]/page.js       # تفاصيل الوحدة
├── components/
│   ├── Navbar.js              # شريط التنقل
│   ├── Footer.js              # التذييل
│   ├── Badge.js               # شارة Developer Me
│   ├── SectionHeader.js      # عنوان القسم
│   ├── ImageGallery.js        # معرض الصور
│   ├── Map.js                 # خريطة (Placeholder)
│   ├── Cards/
│   │   ├── DestinationCard.js
│   │   ├── DeveloperCard.js
│   │   ├── ProjectCard.js
│   │   └── UnitCard.js
│   └── Modals/
│       ├── ContactUsModal.js
│       └── WhatsAppConsultantModal.js
├── context/
│   └── LanguageContext.js     # Context للغة
├── hooks/
│   └── useModal.js            # Hook للـ Modals
├── lib/
│   └── utils.js               # Utilities (formatPrice, etc.)
└── data/
    ├── destinations.json       # بيانات الوجهات
    ├── developers.json        # بيانات المطورين
    ├── projects.json          # بيانات المشاريع
    └── units.json             # بيانات الوحدات
```

## 🛠️ التثبيت والتشغيل

### 1. تثبيت Dependencies

```bash
npm install
```

### 2. تشغيل المشروع في وضع التطوير

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

### 3. بناء المشروع للإنتاج

```bash
npm run build
npm start
```

## 📝 تعديل Mock Data

جميع البيانات موجودة في مجلد `data/`:

- **`data/destinations.json`**: بيانات الوجهات (الرياض، جدة، إلخ)
- **`data/developers.json`**: بيانات المطورين
- **`data/projects.json`**: بيانات المشاريع
- **`data/units.json`**: بيانات الوحدات العقارية

### مثال على تعديل بيانات الوجهة:

```json
{
  "id": 1,
  "name_ar": "الرياض",
  "name_en": "Riyadh",
  "image": "/destinations/riyadh.jpg",
  "description_ar": "وصف بالعربية",
  "description_en": "Description in English",
  "developersCount": 5,
  "projectsCount": 12
}
```

## 🔗 ربط Backend مستقبلاً

### 1. إنشاء API Routes

أنشئ ملفات API في `app/api/`:

```
app/api/
├── destinations/
│   └── route.js
├── developers/
│   └── route.js
├── projects/
│   └── route.js
└── units/
    └── route.js
```

### 2. استبدال Mock Data بـ API Calls

مثال في `app/page.js`:

```javascript
// قبل (Mock Data)
import destinationsData from '@/data/destinations.json';

// بعد (API Call)
const response = await fetch('/api/destinations');
const destinationsData = await response.json();
```

### 3. استخدام Server Components

يمكنك تحويل الصفحات إلى Server Components:

```javascript
// app/destinations/page.js
async function DestinationsPage() {
  const destinations = await fetchDestinations();
  return <div>...</div>;
}
```

### 4. إضافة Environment Variables

أنشئ ملف `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=your_database_url
```

## 🌐 دعم اللغات

المشروع يدعم العربية والإنجليزية مع تبديل تلقائي لـ RTL/LTR:

- **Context**: `context/LanguageContext.js`
- **Hook**: `useLanguage()`
- **Toggle**: زر في Navbar

### استخدام Hook اللغة:

```javascript
import { useLanguage } from '@/context/LanguageContext';

function MyComponent() {
  const { language, toggleLanguage, t } = useLanguage();
  
  return (
    <div>
      <h1>{t({ ar: 'مرحباً', en: 'Hello' })}</h1>
      <button onClick={toggleLanguage}>Toggle</button>
    </div>
  );
}
```

## 🎨 التصميم

- **Colors**: ألوان مستوحاة من موقع ناوي (أزرق #2563EB)
- **Layout**: max-w-7xl mx-auto
- **Cards**: shadow-md مع hover:shadow-xl
- **Buttons**: تصميم عصري مع transitions

## 📱 المكونات الرئيسية

### Navbar
- شريط تنقل مع دعم RTL
- زر تبديل اللغة
- روابط للصفحات الرئيسية

### Cards
- `DestinationCard`: بطاقة الوجهة
- `DeveloperCard`: بطاقة المطور مع Badge
- `ProjectCard`: بطاقة المشروع
- `UnitCard`: بطاقة الوحدة العقارية

### Modals
- `ContactUsModal`: نموذج الاتصال (Mock API)
- `WhatsAppConsultantModal`: فتح واتساب للاستشارة القانونية

### ImageGallery
- معرض صور مع Swiper
- Navigation و Pagination
- Thumbnail selection

## 🔧 Utilities

### formatPrice()
تنسيق الأسعار:

```javascript
import { formatPrice } from '@/lib/utils';

formatPrice(950000); // "950,000 ر.س"
```

### formatNumber()
تنسيق الأرقام:

```javascript
import { formatNumber } from '@/lib/utils';

formatNumber(1234567); // "1,234,567"
```

## 📦 Dependencies

- `next`: 16.0.3
- `react`: 19.2.0
- `react-dom`: 19.2.0
- `react-hot-toast`: 2.4.1 (Toast notifications)
- `swiper`: 11.1.15 (Image gallery)
- `clsx`: 2.1.1 (Class names utility)
- `tailwindcss`: ^4

## 🚧 Placeholders جاهزة للربط

### 1. API Calls
جميع استدعاءات API جاهزة كـ placeholders:

```javascript
// في components/Modals/ContactUsModal.js
const handleSubmit = async (e) => {
  e.preventDefault();
  // TODO: Replace with actual API call
  const response = await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify({ phone, comment }),
  });
};
```

### 2. Map Integration
مكون `Map.js` جاهز لربط Mapbox أو Google Maps:

```javascript
// استبدل placeholder بـ Mapbox
import mapboxgl from 'mapbox-gl';
```

### 3. Image Upload
جاهز لإضافة رفع الصور في Admin Panel.

## 📄 الصفحات المتاحة

1. **`/`** - الصفحة الرئيسية
   - Hero section مع بحث
   - قائمة الوجهات
   - قائمة المطورين
   - المشاريع المميزة

2. **`/destinations`** - قائمة الوجهات

3. **`/destinations/[id]`** - تفاصيل الوجهة
   - معلومات الوجهة
   - قائمة المطورين

4. **`/developers/[id]`** - تفاصيل المطور
   - معلومات المطور
   - قائمة المشاريع

5. **`/projects/[id]`** - تفاصيل المشروع
   - معرض الصور
   - الوصف
   - الخريطة
   - قائمة الوحدات
   - زر Legal Consultant

6. **`/units/[id]`** - تفاصيل الوحدة
   - معرض الصور
   - التفاصيل (السعر، المساحة، إلخ)
   - الخريطة
   - زر Contact Us
   - زر WhatsApp Legal Consultant

## 🐛 حل المشاكل

### المشكلة: الصور لا تظهر
**الحل**: تأكد من وجود الصور في مجلد `public/` أو استخدم placeholder images.

### المشكلة: RTL لا يعمل
**الحل**: تأكد من أن `language` في `LanguageContext` مضبوط على `'ar'` افتراضياً.

### المشكلة: Swiper لا يعمل
**الحل**: تأكد من استيراد CSS:
```javascript
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
```

## 📞 الدعم

لأي استفسارات أو مشاكل، يرجى فتح Issue في المشروع.

## 📄 الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام الحر.

---

**تم التطوير بواسطة**: AI Assistant  
**التاريخ**: 2024
