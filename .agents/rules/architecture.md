---
description: "Strict Backend Architecture & Frontend Alignment Rules"
globs: ["backend/**", "frontend/**"]
---

قبل البدء في أي ميزة أو تعديل، يجب قراءة وتطبيق القواعد الموثقة في:
[ARCHITECTURE_RULES.md](file:///d:/work/yourGates/backend/ARCHITECTURE_RULES.md)

1. الالتزام بطبقات: `FormRequest` -> `Controller` -> `Service` -> `Resource`.
2. عزل المتاجر (Multi-Tenancy) تلقائياً عبر `BelongsToStore`.
3. فحص الـ Frontend أولاً ومطابقة الـ Endpoints والـ Keys.
4. إرجاع الـ JSON دائماً عبر `ApiResponse`.
5. تشغيل `php artisan test` بعد كل إضافة.
