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
