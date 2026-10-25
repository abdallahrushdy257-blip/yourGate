# Backend Architecture & Coding Standards

قواعد ومعايير هيكلة الكود للمشروع لضمان تنظيم واحترافية الـ Backend.

---

## 1. الهيكل العام (Layered Architecture)

يتبع المشروع نمط **Skinny Controller / Fat Service** مع عزل كامل للمدخلات والمخرجات:

```
Request (FormRequest) 
   ──> Controller 
      ──> Service (Business Logic & Transactions) 
         ──> Model / DB 
      <── Service 
   <── Response (API Resource)
```

---

## 2. القواعد الأساسية الإلزامية

### 1) التحقق من البيانات (Form Requests)
- **المسار**: `app/Http/Requests/{Module}/`
- **القاعدة**: يمنع منعاً باتاً استخدام `$request->validate()` داخل الـ Controllers.
- **التسمية**:
  - `Store{Entity}Request` (للإضافة)
  - `Update{Entity}Request` (للتعديل)
- **الصلاحيات**: تخصيص دالة `authorize()` بناءً على السياسات (Policies).

### 2) منطق الأعمال (Services)
- **المسار**: `app/Services/{Module}/`
- **القاعدة**: الـ Controller لا يحتوي على أي Business Logic أو استعلامات DB معقدة؛ كل شيء يتم داخل الـ Service.
- **المسؤوليات**:
  - تنفيذ العمليات الحسابية ومنطق التطبيق.
  - إدارة العمليات المتعددة بالـ Database عبر `DB::transaction()`.
  - إرجاع Models أو DTOs أو رمي Custom Exceptions.
- **التسمية**: `{Entity}Service.php` (مثل `UserService.php`, `InvoiceService.php`).

### 3) المتحكمات (Controllers)
- **المسار**: `app/Http/Controllers/Api/{Module}/`
- **القاعدة**: الـ Controller مقتصر فقط على:
  1. استقبال الطلب عبر الـ `FormRequest`.
  2. استدعاء الدالة المناسبة من الـ `Service`.
  3. إرجاع النتيجة مغلفة بـ `API Resource`.
- **التسمية**: `{Entity}Controller.php` (مثل `AuthController.php`).

### 4) تحويل المخرجات (API Resources)
- **المسار**: `app/Http/Resources/{Module}/`
- **القاعدة**: يمنع إرجاع Eloquent Model أو Array مباشر للمستخدم.
- **الأهداف**:
  - إخفاء الحقول الحساسة وضمان أمان البيانات.
  - توحيد تنسيق الحقول والتواريخ (ISO format).
- **التسمية**:
  - `{Entity}Resource.php` (للعنصر الواحد)
  - `{Entity}Collection.php` (للقوائم إذا تطلبت Metadata خاصة).

---

## 3. التنسيق الموحد للـ API Response

جميع الـ Endpoints يجب أن ترجع استجابة موحدة بصيغة JSON:

### في حالة النجاح (Success):
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

### في حالة الفشل (Error):
```json
{
  "success": false,
  "message": "Error description.",
  "errors": {}
}
```

---

## 4. قواعد إضافية للجودة (Best Practices)

1. **معاملات قواعد البيانات (Transactions)**:
   - أي عملية كتابة تؤثر على أكثر من جدول يجب إحاطتها بـ `DB::beginTransaction()` أو `DB::transaction()`.
2. **الاستثناءات (Exceptions)**:
   - استخدام Custom Exceptions عند الحاجة وتجنب `try/catch` الفارغة أو غير المعالجة.
3. **تسمية المتغيرات والحقول**:
   - أسماء الجداول والأعمدة في الـ DB: `snake_case`.
   - مفاتيح الـ JSON في الـ Requests والـ Resources: `snake_case`.
   - أسماء الدوال والمتغيرات في PHP: `camelCase`.
   - أسماء الـ Classes والـ Files: `PascalCase`.
4. **العلاقات والـ Eager Loading**:
   - استخدام `with()` دائماً لتفادي مشكلة الـ `N+1 Query`.

---

## 5. نظام الـ SaaS Multi-Tenancy (عزل بيانات المتاجر)

يعتمد النظام على أسلوب **Single Database Multi-Tenancy** عبر ربط البيانات بـ `store_id`:

### 1) معايير قواعد البيانات (Migrations):
- كل جدول تابع لمتجر **يجب** أن يحتوي على:
  ```php
  $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
  ```
- إضافة Indexes للأعمدة التي يُبحث عنها كثيراً مدمجة مع `store_id` (Composite Index) مثل:
  ```php
  $table->index(['store_id', 'created_at']);
  ```

### 2) الـ Trait الإلزامي للموديلز (`BelongsToStore`):
- مساره: `App\Traits\BelongsToStore`
- أي Model يحتوي على `store_id` **يجب** أن يستخدم هذا الـ Trait:
  ```php
  use App\Traits\BelongsToStore;

  class Product extends Model
  {
      use BelongsToStore;
      ...
  }
  ```
- **المزايا التلقائية**:
  - **فلترة تلقائية آمنة (Global Scope)**: أي استعلام `Product::all()` أو `Product::where(...)` يضيف تلقائياً شرط المتجر الحالي لمنع تسريب البيانات بين المشتركين.
  - **حقن المتجر تلقائياً (Auto Fill)**: عند عمل `Product::create([...])` يتم إسناد `store_id` الحالي تلقائياً بدون تمريره يدوياً.
  - **علاقة جاهزة**: يوفر دالة `$product->store` تلقائياً.

### 3) كشف المتجر الحالي (`IdentifyStore` Middleware):
- مساره: `App\Http\Middleware\IdentifyStore`
- يتم كشف وتحديد المتجر النشط في كل Request عبر:
  1. Header: `X-Store-ID` أو `X-Store-Slug`.
  2. أو بيانات المستخدم المسجل: `$user->store_id`.
- يُحقن المتجر في الـ Service Container باسم `current_store` و `current_store_id`.

### 4) الاستثناءات وتخطي العزل (Super Admin Bypass):
- لعمليات لوحة تحكم المنصة الرئيسية (Platform Super Admin) أو المهام الخلفية المجمعة (Background Jobs):
  ```php
  Product::withoutGlobalScope(\App\Models\Scopes\StoreScope::class)->get();
  ```

---

## 6. التحقق والاختبار الإلزامي (Testing & Verification)

- **القاعدة**: بعد كل إضافة أو تعديل برمجي، يجب إجراء فحص واختبار كامل للتأكد من عمل الميزة بدون أي أخطاء أو Bugs قبل الاعتماد:
  1. **تشغيل الاختبارات الآلية (Automated Tests)**:
     ```bash
     php artisan test
     ```
     - يجب التأكد من مرور جميع الاختبارات (Pass) بنسبة 100%.
  2. **اختبارات الميزات (Feature Tests)**:
     - كتابة Feature Test لكل Endpoint جديد للتحقق من:
       - صحة الـ Validation ومخرجات الـ Resource.
       - عزل بيانات المتاجر (التأكد من أن المتجر لا يرى بيانات متجر آخر).
       - استجابة الـ HTTP Status Codes المتوقعة (200, 201, 422, 403, 401).
  3. **التحقق من سلامة البناء والأخطاء اللحظية**:
     - مراجعة الـ Syntax وعدم وجود تعارضات أو استدعاءات مفقودة.
     - فحص ملف السجلات في حال حدوث خطأ غير متوقع: `storage/logs/laravel.log`.

---

## 7. تعدد اللغات والترجمة (Localization - ar / en)

- **اللغة الافتراضية**: العربية (`ar`)، مع دعم كامل للإنجليزية (`en`).
- **تحديد اللغة ديناميكياً**:
  - عبر Header الطلب: `X-Locale: ar` أو `X-Locale: en`.
  - معالج تلقائياً بواسطة Middleware: [[SetLocale.php](file:///d:/work/yourGates/backend/app/Http/Middleware/SetLocale.php)].
- **رسائل التحقق والأخطاء**:
  - تترجم رسائل الـ Validation تلقائياً بحسب لغة الطلب عبر حزم `laravel-lang`.
  - في الرسائل المخصصة، استخدم دائماً دالة `__('messages.key')`.

---

## 8. الصلاحيات والأدوار (Roles & Permissions)

- **الحزمة المستخدمة**: `spatie/laravel-permission` مهيأة بنظام **Teams** المرتبط بـ `store_id`.
- **العزل داخل المتجر**: كل متجر له أدواره وصلاحياته المعزولة عن باقي المتاجر.
- **تحديد المتجر للصلاحيات**:
  ```php
  setPermissionsTeamId($store->id);
  $user->hasRole('admin');
  ```
- **حماية المسارات**: عبر Middleware `role:admin` أو `permission:edit_products`.

---

## 9. المزامنة والتطابق الإلزامي مع الـ Frontend (Frontend-Backend Alignment)

- **القاعدة الذهبية**: قبل كتابة أي Feature في الـ Backend، يجب مراجعة كود الـ Frontend المقابل في مجلد `frontend/` لضمان العمل الفوري (Plug & Play):
  1. **مطابقة المسارات (Endpoints)**:
     - يجب أن تتطابق مسارات الـ Routes (في `routes/api.php`) بدقة 100% مع الـ URLs المستدعاة في `frontend/src/api/` ومكونات React.
  2. **مفاتيح الـ Payload (Request Keys)**:
     - مطابقة أسماء الحقول في الـ `FormRequest` مع الـ Payload المرسل من الفورمات والـ State في الـ Frontend بدون تعديل مسميات.
  3. **تطابق الـ Response Keys في الـ Resources**:
     - مخرجات الـ `API Resource` يجب أن تحمل نفس أسماء المفاتيح (Keys) وأنواع البيانات (Types) التي ينتظرها الـ Frontend لعرضها مباشرة.
  4. **بروتوكول الفحص المسبق**:
     - الخطوة الأولى لأي مهمة: قراءة الـ Component والـ API Call المقابل بالـ Frontend، ثم بناء الـ Migration والـ Request والـ Service والـ Resource والـ Controller بناءً عليه.




