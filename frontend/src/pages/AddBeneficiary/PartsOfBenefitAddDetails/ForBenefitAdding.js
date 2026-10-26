import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import API from "../../../api/axiosConfig";
import "../BenefitAddDetailsUnified.css";

function ForBenefitAdding({ initialData, onNext, onSaved }) {
  const { id } = useParams();

  const [name, setName] = useState(() => initialData?.name || sessionStorage.getItem("bad_name") || "");
  const [gender, setGender] = useState(() => initialData?.gender ?? sessionStorage.getItem("bad_gender") ?? "0");
  const [humancasetype, setHumancasetype] = useState(() => initialData?.humancasetype ?? sessionStorage.getItem("bad_type") ?? "1");
  const [dob, setDob] = useState(() => initialData?.dob || sessionStorage.getItem("bad_dob") || "1995-01-01");
  const [status, setStatus] = useState(() => initialData?.status ?? sessionStorage.getItem("bad_status") ?? "1");
  const [nationality, setNationality] = useState(() => initialData?.nationality || sessionStorage.getItem("bad_nat") || "سعودي");
  const [idnumber, setIdnumber] = useState(() => initialData?.idnumber || sessionStorage.getItem("bad_idnum") || "");
  const [idsource, setIdsource] = useState(() => initialData?.idsource || sessionStorage.getItem("bad_idsrc") || "");
  const [iddate, setIddate] = useState(() => initialData?.iddate || sessionStorage.getItem("bad_iddate") || "2030-01-01");
  const [phonenum, setPhonenum] = useState(() => initialData?.phonenum || sessionStorage.getItem("bad_phone") || "");
  const [familycount, setFamilycount] = useState(() => initialData?.familycount ?? sessionStorage.getItem("bad_fam") ?? "1");
  const [email, setEmail] = useState(() => initialData?.email || sessionStorage.getItem("bad_email") || "");
  const [accnumber, setAccnumber] = useState(() => initialData?.accnumber || sessionStorage.getItem("bad_acc") || "");
  const [note, setNote] = useState(() => initialData?.note || sessionStorage.getItem("bad_note") || "");
  const [agree, setAgree] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    if (initialData) {
      if (initialData.name) setName(initialData.name);
      if (initialData.gender !== undefined) setGender(String(initialData.gender));
      if (initialData.humancasetype !== undefined) setHumancasetype(String(initialData.humancasetype));
      if (initialData.dob) setDob(initialData.dob);
      if (initialData.status !== undefined) setStatus(String(initialData.status));
      if (initialData.nationality) setNationality(initialData.nationality);
      if (initialData.idnumber) setIdnumber(initialData.idnumber);
      if (initialData.idsource) setIdsource(initialData.idsource);
      if (initialData.iddate) setIddate(initialData.iddate);
      if (initialData.phonenum) setPhonenum(initialData.phonenum);
      if (initialData.familycount !== undefined) setFamilycount(String(initialData.familycount));
      if (initialData.email) setEmail(initialData.email);
      if (initialData.accnumber) setAccnumber(initialData.accnumber);
      if (initialData.note) setNote(initialData.note);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError({ name: "يرجى إدخال اسم المستفيد الكامل" });
      return;
    }
    if (!agree) {
      alert("يرجى الإقرار بصحة البيانات المدخلة قبل المتابعة");
      return;
    }

    setIsSubmitting(true);
    setError({});

    const formData = new FormData();
    formData.append("name", name);
    formData.append("gender", gender);
    formData.append("humancasetype", humancasetype);
    formData.append("dob", dob);
    formData.append("status", status);
    formData.append("nationality", nationality);
    formData.append("idnumber", idnumber);
    formData.append("idsource", idsource);
    formData.append("iddate", iddate);
    formData.append("phonenum", phonenum);
    formData.append("familycount", familycount);
    formData.append("email", email);
    formData.append("accnumber", accnumber);
    formData.append("note", note);

    try {
      const res = await API.post(`/hcrequest/${id}/case`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        // Save to session
        sessionStorage.setItem("bad_name", name);
        sessionStorage.setItem("bad_gender", gender);
        sessionStorage.setItem("bad_dob", dob);
        sessionStorage.setItem("bad_status", status);
        sessionStorage.setItem("bad_nat", nationality);
        sessionStorage.setItem("bad_idnum", idnumber);
        sessionStorage.setItem("bad_phone", phonenum);

        if (onSaved) {
          onSaved({
            name,
            gender,
            humancasetype,
            dob,
            status,
            nationality,
            idnumber,
            idsource,
            iddate,
            phonenum,
            familycount,
            email,
            accnumber,
            note,
          });
        }

        onNext();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors || { general: err.response?.data?.message || "حدث خطأ أثناء الحفظ" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bad-card">
      <div className="bad-card-header">
        <div className="bad-card-header-icon">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div>
          <h3 className="bad-card-header-title">البيانات الأساسية للمستفيد</h3>
          <p className="bad-card-header-desc">
            يرجى إدخال المعلومات الشخصية للمستفيد ورقم الهوية بدقة لمطابقتها في سجلات الجمعية.
          </p>
        </div>
      </div>

      {error.general && (
        <div className="alert alert-danger mb-4" style={{ borderRadius: "12px", fontSize: "14px" }}>
          {error.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bad-grid">
          {/* الاسم الكامل */}
          <div className="bad-field bad-grid-full">
            <label className="bad-label">
              <span>الاسم الكامل</span>
              <span className="required">*</span>
            </label>
            <input
              type="text"
              className="bad-input"
              placeholder="الاسم الرباعي للمستفيد"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {error.name && <span className="bad-error">{error.name}</span>}
          </div>

          {/* نوع الجنس */}
          <div className="bad-field">
            <label className="bad-label">الجنس</label>
            <select
              className="bad-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="0">ذكر</option>
              <option value="1">أنثى</option>
            </select>
          </div>

          {/* الحالة الاجتماعية */}
          <div className="bad-field">
            <label className="bad-label">الحالة الاجتماعية</label>
            <select
              className="bad-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="1">أعزب / عزباء</option>
              <option value="2">متزوج / متزوجة</option>
              <option value="3">مطلق / مطلقة</option>
              <option value="4">أرمل / أرملة</option>
            </select>
          </div>

          {/* تاريخ الميلاد */}
          <div className="bad-field">
            <label className="bad-label">تاريخ الميلاد</label>
            <input
              type="date"
              className="bad-input"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          {/* الجنسية */}
          <div className="bad-field">
            <label className="bad-label">الجنسية</label>
            <input
              type="text"
              className="bad-input"
              placeholder="مثال: سعودي"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            />
          </div>

          {/* رقم الهوية / الإقامة */}
          <div className="bad-field">
            <label className="bad-label">
              <span>رقم الهوية الوطنية / الإقامة</span>
              <span className="required">*</span>
            </label>
            <input
              type="text"
              className="bad-input"
              placeholder="رقم الهوية (10 أرقام)"
              value={idnumber}
              onChange={(e) => setIdnumber(e.target.value)}
              maxLength={15}
            />
            {error.idnumber && <span className="bad-error">{error.idnumber}</span>}
          </div>

          {/* مصدر الهوية */}
          <div className="bad-field">
            <label className="bad-label">مصدر الهوية</label>
            <input
              type="text"
              className="bad-input"
              placeholder="مثال: أحوال الرياض"
              value={idsource}
              onChange={(e) => setIdsource(e.target.value)}
            />
          </div>

          {/* تاريخ انتهاء الهوية */}
          <div className="bad-field">
            <label className="bad-label">تاريخ انتهاء الهوية</label>
            <input
              type="date"
              className="bad-input"
              value={iddate}
              onChange={(e) => setIddate(e.target.value)}
            />
          </div>

          {/* رقم الجوال */}
          <div className="bad-field">
            <label className="bad-label">
              <span>رقم الجوال</span>
              <span className="required">*</span>
            </label>
            <input
              type="tel"
              className="bad-input"
              placeholder="05XXXXXXXX"
              value={phonenum}
              onChange={(e) => setPhonenum(e.target.value)}
              maxLength={15}
              required
            />
            {error.phonenum && <span className="bad-error">{error.phonenum}</span>}
          </div>

          {/* عدد أفراد الأسرة */}
          <div className="bad-field">
            <label className="bad-label">عدد أفراد الأسرة</label>
            <input
              type="number"
              className="bad-input"
              min="0"
              value={familycount}
              onChange={(e) => setFamilycount(e.target.value)}
            />
          </div>

          {/* نوع الحالة */}
          <div className="bad-field">
            <label className="bad-label">نوع الدعم / الحالة</label>
            <select
              className="bad-select"
              value={humancasetype}
              onChange={(e) => setHumancasetype(e.target.value)}
            >
              <option value="1">دائم</option>
              <option value="2">مؤقت / عاجل</option>
            </select>
          </div>

          {/* البريد الإلكتروني */}
          <div className="bad-field">
            <label className="bad-label">البريد الإلكتروني (اختياري)</label>
            <input
              type="email"
              className="bad-input"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* رقم الحساب / الآيبان البنكي */}
          <div className="bad-field">
            <label className="bad-label">رقم الآيبان (IBAN)</label>
            <input
              type="text"
              className="bad-input"
              placeholder="SA..."
              value={accnumber}
              onChange={(e) => setAccnumber(e.target.value)}
              style={{ direction: "ltr", textAlign: "right" }}
            />
          </div>

          {/* ملاحظات إضافية */}
          <div className="bad-field bad-grid-full">
            <label className="bad-label">ملاحظات إضافية (اختياري)</label>
            <textarea
              className="bad-textarea"
              placeholder="أي تفاصيل أو ملاحظات أخرى تود إرفاقها..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>

          {/* الإقرار */}
          <div className="bad-grid-full" style={{ marginTop: "10px" }}>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                fontSize: "13.5px",
                fontWeight: "700",
                color: "#4a3e2e",
              }}
            >
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "#b89358" }}
              />
              <span>أقر بأن جميع البيانات المدخلة صحيحة وأتحمل المسؤولية القانونية الكاملة عنها.</span>
            </label>
          </div>
        </div>

        {/* Action button */}
        <div className="bad-actions" style={{ justifyContent: "flex-end" }}>
          <button
            type="submit"
            className="bad-btn-submit"
            disabled={isSubmitting}
          >
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

export default ForBenefitAdding;
