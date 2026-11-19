# Project Rules & Instructions

قبل تنفيذ أو كتابة أي كود في الـ Backend، يجب الالتزام الصارم والدائم بجميع القواعد المحددة في:
[ARCHITECTURE_RULES.md](file:///d:/work/yourGates/backend/ARCHITECTURE_RULES.md)

## ملخص القواعد الإلزامية في كل طلب:

1. **Form Requests**: عزل الـ Validation داخل `app/Http/Requests` (وارثة من `BaseApiRequest`) ومنع `$request->validate()` في الـ Controller.
2. **Services**: وضع كافة الـ Business Logic واستعلامات قواعد البيانات والـ Transactions داخل `app/Services`.
3. **Controllers**: متحكمات خفيفة (Skinny Controllers) تستخدم `ApiResponse` trait لإرجاع الـ JSON الموحد.
4. **API Resources**: تحويل كافة مخرجات الـ API عبر `app/Http/Resources` ومنع إرجاع الـ Models مباشرة.
5. **Multi-Tenancy (Single DB)**: جميع الـ Models التابعة لمتجر **يجب** أن تستخدم Trait `BelongsToStore` لعزل البيانات تلقائياً بـ `store_id`.
6. **التطابق 1:1 مع الـ Frontend**: فحص مكونات الـ React واستدعاءات الـ Axios في `frontend/` أولاً، ومطابقة المسارات (Endpoints)، ومفاتيح الـ Payload، ومفاتيح الـ Resource تماماً.
7. **تعدد اللغات**: دعم العربية والإنجليزية (`ar`/`en`) عبر `SetLocale`.
8. **الأدوار والصلاحيات**: استخدام `Spatie Permission` مع دعم الـ Teams المرتبط بـ `store_id`.
9. **الاختبار الإلزامي**: تشغيل `php artisan test` بعد كل إضافة والتأكد من خلو المشروع من أي أخطاء.

# قواعد العمل والصلاحيات لمشروع yourGates

## 1. أسلوب التفكير والتخطيط

- استخدم `@brainstorming` و `@writing-plans` للتخطيط العميق قبل تعديل أي ملف.
- عند مراجعة أو ربط أي شاشة بين `frontend` و `backend`، التزم بقواعد `@api-design-principles` وراجع ملفات `axiosConfig.js` والـ Services المقابلة في PHP لضمان تطابق المسارات (Endpoints) والبيانات (Payloads).

## 2. التعامل مع ملفات البيانات (Excel)

- لقراءة وتحليل ملف `الشجرة.xlsx`، اكتب سكريبت Python سريع (باستخدام `pandas` أو `openpyxl`) في الـ Terminal لاستخراج البيانات بدقة، ولا تحاول تخمين محتوى الملف.

## 3. توحيد التصميم (UI/UX)

- التزم بمعايير `@frontend-design` لتوحيد الألوان، الخطوط، رسائل الخطأ (مثل `showError` في `axiosConfig.js`)، وتوزيع العناصر في كل الشاشات.

## 4. الاختبار وضمان الجودة (Testing)

- بعد الانتهاء من أي ربط أو تعديل، استخدم `@systematic-debugging` و `@test-driven-development` لعمل اختبار فعلي للـ API والواجهة والتأكد من عدم وجود أخطاء 404 أو 500.

## 5. التعامل مع الملفات المتعددة (Media & Files)

- **Excel (`.xlsx`)**: يتم قتحها وتحليلها باستخدام سكريبت Python ومكتبات `pandas` و `openpyxl`.
- **الملفات الصوتية**: يتم تحويلها إلى نصوص (Transcripts) باستخدام `openai-whisper` عبر الـ Terminal قبل تحليلها.
- **الفيديوهات**: يتم الاعتماد على النصوص المستخرجة منها أو لقطات الشاشة (Screenshots) لتحليل محتواها البرمجي أو التمويلي.

## 6. البحث الخارجي والمصادر الحديثة (External Research)

- عند الحاجة لأي معلومة برمجية جديدة، أو توثيق (Documentation) لمكتبة في Laravel أو React، استخدم أداة الـ `fetch` أو متصفح الـ `playwright` لجلب أحدث الحلول والممارسات من الإنترنت مباشرة وعدم الاعتماد على التخمين.

## 7. قاعدة الاختبار والتصحيح التلقائي (Self-Healing & TDD)

- **التطوير الموجه بالـ Test (TDD)**: قبل كتابة أي كود في الـ Backend، يجب كتابة أو التفكير في اختبارات الوحدة (Unit/Feature Tests) للتأكد من صحة المتطلبات.
- **التصحيح المنهجي (Systematic Debugging)**: عند ظهور أي خطأ (Error 500، فشل في الاختبارات، أو مشكلة في الاتصال)، يُحظر تماماً التخمين العشوائي؛ ويجب تحليل الـ Stack Trace، تتبع مصدر الخطأ في الـ Services أو الـ Form Requests، وإصلاحه جذرياً.
- **الاختبار الإلزامي**: بعد أي تعديل، قم بتشغيل `php artisan test` في الـ Terminal وتأكد من خلو المشروع تماماً من الأخطاء قبل اعتبار المهمة مكتملة.
