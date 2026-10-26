import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faPlus,
  faTrashAlt,
  faArrowLeft,
  faArrowRight,
  faCloudArrowUp,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import API from "../../../api/axiosConfig";
import "../BenefitAddDetailsUnified.css";

function ForBenefitQualificationPosition({ initialData, onNext, onPrev, onSaved }) {
  const { id } = useParams();

  const [level, setLevel] = useState(initialData?.level || "ثانوي");
  const [canwork, setCanwork] = useState(initialData?.canwork || "1");
  const [job, setJob] = useState(initialData?.job || "");
  const [notes, setNotes] = useState(initialData?.note || "");

  const [sources, setSources] = useState(initialData?.sources || [{ name: "", amount: "" }]);
  const [sourceFile, setSourceFile] = useState(null);
  const [existingSourceUpload, setExistingSourceUpload] = useState(initialData?.sourceupload || null);

  const [courses, setCourses] = useState(initialData?.courses || [{ title: "", address: "" }]);
  const [courseFile, setCourseFile] = useState(null);
  const [existingCourseUpload, setExistingCourseUpload] = useState(initialData?.courseupload || null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    if (initialData) {
      if (initialData.level) setLevel(initialData.level);
      if (initialData.canwork !== undefined) setCanwork(String(initialData.canwork));
      if (initialData.job) setJob(initialData.job);
      if (initialData.note) setNotes(initialData.note);
      if (initialData.sources && initialData.sources.length > 0) setSources(initialData.sources);
      if (initialData.courses && initialData.courses.length > 0) setCourses(initialData.courses);
      if (initialData.sourceupload) setExistingSourceUpload(initialData.sourceupload);
      if (initialData.courseupload) setExistingCourseUpload(initialData.courseupload);
    }
  }, [initialData]);

  // Dynamic Sources
  const addSource = () => setSources([...sources, { name: "", amount: "" }]);
  const removeSource = (idx) => {
    if (sources.length > 1) {
      setSources(sources.filter((_, i) => i !== idx));
    }
  };
  const updateSource = (idx, field, val) => {
    const next = [...sources];
    next[idx][field] = val;
    setSources(next);
  };

  // Dynamic Courses
  const addCourse = () => setCourses([...courses, { title: "", address: "" }]);
  const removeCourse = (idx) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== idx));
    }
  };
  const updateCourse = (idx, field, val) => {
    const next = [...courses];
    next[idx][field] = val;
    setCourses(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const formData = new FormData();
    formData.append("level", level);
    formData.append("canwork", canwork);
    formData.append("job", job);
    formData.append("note", notes);

    const mergedSources = sources
      .filter((s) => s.name || s.amount)
      .map((s) => ({ sourcename: s.name, sourceamount: s.amount }));
    formData.append("source", JSON.stringify(mergedSources));

    const mergedCourses = courses
      .filter((c) => c.title || c.address)
      .map((c) => ({ coursetitle: c.title, courseaddress: c.address }));
    formData.append("course", JSON.stringify(mergedCourses));

    if (sourceFile) formData.append("sourceupload", sourceFile);
    if (courseFile) formData.append("courseupload", courseFile);

    try {
      const res = await API.post(`/hcrequest/${id}/qualifications`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        if (onSaved) {
          onSaved({
            level,
            canwork,
            job,
            note: notes,
            sources,
            courses,
            sourceupload: existingSourceUpload,
            courseupload: existingCourseUpload,
          });
        }
        onNext();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors || { general: "حدث خطأ أثناء حفظ المؤهلات" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bad-card">
      <div className="bad-card-header">
        <div className="bad-card-header-icon">
          <FontAwesomeIcon icon={faGraduationCap} />
        </div>
        <div>
          <h3 className="bad-card-header-title">المؤهل العلمي والوظيفة ومصادر الدخل</h3>
          <p className="bad-card-header-desc">
            تحديد المستوى التعليمي، القدرة على العمل، ومصادر الدخل الشهري للأسرة.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bad-grid">
          {/* المستوى التعليمي */}
          <div className="bad-field">
            <label className="bad-label">المؤهل التعليمي</label>
            <select
              className="bad-select"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="أمي">أمي / بدون مؤهل</option>
              <option value="ابتدائي">ابتدائي</option>
              <option value="متوسط">متوسط</option>
              <option value="ثانوي">ثانوي</option>
              <option value="دبلوم">دبلوم</option>
              <option value="بكالوريوس">بكالوريوس</option>
              <option value="ماجستير">ماجستير</option>
              <option value="دكتوراه">دكتوراه</option>
            </select>
          </div>

          {/* القدرة على العمل */}
          <div className="bad-field">
            <label className="bad-label">القدرة على العمل</label>
            <select
              className="bad-select"
              value={canwork}
              onChange={(e) => setCanwork(e.target.value)}
            >
              <option value="1">قادر على العمل</option>
              <option value="0">غير قادر على العمل / عاجز</option>
            </select>
          </div>

          {/* المهنة الحالية */}
          <div className="bad-field">
            <label className="bad-label">الوظيفة / المهنة الحالية</label>
            <input
              type="text"
              className="bad-input"
              placeholder="مثال: بدون عمل / متقاعد / موظف قطاع خاص"
              value={job}
              onChange={(e) => setJob(e.target.value)}
            />
          </div>

          {/* ملاحظات */}
          <div className="bad-field">
            <label className="bad-label">ملاحظات العمل والدخل</label>
            <input
              type="text"
              className="bad-input"
              placeholder="أي تفاصيل حول طبيعة العمل أو الدخل"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* مصادر الدخل المتعددة */}
          <div className="bad-grid-full" style={{ marginTop: "12px" }}>
            <label className="bad-label" style={{ fontSize: "15px" }}>
              مصادر الدخل الشهري للأسرة
            </label>
            {sources.map((src, idx) => (
              <div key={idx} className="bad-repeat-item">
                <div className="bad-repeat-header">
                  <span className="bad-repeat-title">مصدر دخل #{idx + 1}</span>
                  {sources.length > 1 && (
                    <button
                      type="button"
                      className="bad-btn-remove"
                      onClick={() => removeSource(idx)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} /> حذف
                    </button>
                  )}
                </div>
                <div className="bad-grid">
                  <div className="bad-field">
                    <label className="bad-label">جهة الدخل</label>
                    <input
                      type="text"
                      className="bad-input"
                      placeholder="مثال: الضمان الاجتماعي / حساب المواطن / تقاعد"
                      value={src.name}
                      onChange={(e) => updateSource(idx, "name", e.target.value)}
                    />
                  </div>
                  <div className="bad-field">
                    <label className="bad-label">المبلغ الشهري (ريال)</label>
                    <input
                      type="number"
                      className="bad-input"
                      placeholder="0.00"
                      value={src.amount}
                      onChange={(e) => updateSource(idx, "amount", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="bad-btn-add" onClick={addSource}>
              <FontAwesomeIcon icon={faPlus} />
              <span>إضافة مصدر دخل آخر</span>
            </button>
          </div>

          {/* ملف إثبات الدخل */}
          <div className="bad-field bad-grid-full" style={{ marginTop: "12px" }}>
            <label className="bad-label">مستند إثبات الدخل (اختياري)</label>
            <label className={`bad-upload-card ${sourceFile ? "has-file" : ""}`}>
              <div className="bad-upload-info">
                <FontAwesomeIcon
                  icon={sourceFile ? faCheckCircle : faCloudArrowUp}
                  className="bad-upload-icon"
                  style={{ color: sourceFile ? "#2e7d32" : "#b89358" }}
                />
                <div>
                  <p className="bad-upload-title">
                    {sourceFile ? sourceFile.name : "شهادة راتب، مشهد ضمان، أو كشف حساب"}
                  </p>
                  <p className="bad-upload-sub">صيغ مقبولة: JPG, PNG, PDF</p>
                </div>
              </div>
              <span className="bad-upload-btn">{sourceFile ? "تغيير الملف" : "اختيار ملف"}</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => e.target.files && setSourceFile(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bad-actions">
          {onPrev ? (
            <button type="button" className="bad-btn-prev" onClick={onPrev}>
              <FontAwesomeIcon icon={faArrowRight} />
              <span>السابق</span>
            </button>
          ) : <div />}

          <button type="submit" className="bad-btn-submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <span>حفظ ومتابعة</span>
                <FontAwesomeIcon icon={faArrowLeft} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForBenefitQualificationPosition;
