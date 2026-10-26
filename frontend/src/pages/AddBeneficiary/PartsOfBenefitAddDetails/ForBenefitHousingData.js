import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseUser,
  faPlus,
  faTrashAlt,
  faArrowLeft,
  faArrowRight,
  faCloudArrowUp,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import API from "../../../api/axiosConfig";
import "../BenefitAddDetailsUnified.css";

function ForBenefitHousingData({ initialData, onNext, onPrev, onSaved }) {
  const { id } = useParams();

  const [homestate, setHomestate] = useState(initialData?.homestate || "");
  const [village, setVillage] = useState(initialData?.village || "");
  const [nationalAdress, setNationalAdress] = useState(initialData?.nationalAdress || "");
  const [summaryAdress, setSummaryAdress] = useState(initialData?.summaryAdress || "");
  const [homeType, setHomeType] = useState(initialData?.homeType || "شقة");
  const [homeOwnership, setHomeOwnership] = useState(initialData?.homeOwnership || "إيجار");
  const [rent, setRent] = useState(initialData?.rent || "");
  const [cars, setCars] = useState(initialData?.cars || "0");
  const [lands, setLands] = useState(initialData?.lands || "0");
  const [components, setComponents] = useState(initialData?.components || "");
  const [furniture, setFurniture] = useState(initialData?.furniture || "متوسط");
  const [cost, setCost] = useState(initialData?.cost || "");

  const [bills, setBills] = useState(
    initialData?.bills || [
      { name: "فاتورة الكهرباء", amount: "" },
      { name: "فاتورة المياه", amount: "" },
    ]
  );

  const [upload1, setUpload1] = useState(null);
  const [upload2, setUpload2] = useState(null);
  const [existingUpload1, setExistingUpload1] = useState(initialData?.upload1 || null);
  const [existingUpload2, setExistingUpload2] = useState(initialData?.upload2 || null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    if (initialData) {
      if (initialData.homestate) setHomestate(initialData.homestate);
      if (initialData.village) setVillage(initialData.village);
      if (initialData.nationalAdress) setNationalAdress(initialData.nationalAdress);
      if (initialData.summaryAdress) setSummaryAdress(initialData.summaryAdress);
      if (initialData.homeType) setHomeType(initialData.homeType);
      if (initialData.homeOwnership) setHomeOwnership(initialData.homeOwnership);
      if (initialData.rent !== undefined) setRent(String(initialData.rent));
      if (initialData.cars !== undefined) setCars(String(initialData.cars));
      if (initialData.lands !== undefined) setLands(String(initialData.lands));
      if (initialData.components) setComponents(initialData.components);
      if (initialData.furniture) setFurniture(initialData.furniture);
      if (initialData.cost !== undefined) setCost(String(initialData.cost));
      if (initialData.bills && initialData.bills.length > 0) setBills(initialData.bills);
      if (initialData.upload1) setExistingUpload1(initialData.upload1);
      if (initialData.upload2) setExistingUpload2(initialData.upload2);
    }
  }, [initialData]);

  const addBill = () => setBills([...bills, { name: "", amount: "" }]);
  const removeBill = (idx) => {
    if (bills.length > 1) {
      setBills(bills.filter((_, i) => i !== idx));
    }
  };
  const updateBill = (idx, field, val) => {
    const next = [...bills];
    next[idx][field] = val;
    setBills(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const formData = new FormData();
    formData.append("state", homestate);
    formData.append("village", village);
    formData.append("nationalAdress", nationalAdress);
    formData.append("summaryAdress", summaryAdress);
    formData.append("homeType", homeType);
    formData.append("homeOwnership", homeOwnership);
    formData.append("rent", rent);
    formData.append("cars", cars);
    formData.append("lands", lands);
    formData.append("components", components);
    formData.append("furniture", furniture);
    formData.append("cost", cost);

    const validBills = bills
      .filter((b) => b.name && b.amount)
      .map((b) => ({ bill: b.name, amount: b.amount }));
    formData.append("bill", JSON.stringify(validBills));

    if (upload1) formData.append("upload1", upload1);
    if (upload2) formData.append("upload2", upload2);

    try {
      const res = await API.post(`/hcrequest/${id}/homedetails`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        if (onSaved) {
          onSaved({
            homestate,
            village,
            nationalAdress,
            summaryAdress,
            homeType,
            homeOwnership,
            rent,
            cars,
            lands,
            components,
            furniture,
            cost,
            bills,
            upload1: existingUpload1,
            upload2: existingUpload2,
          });
        }
        onNext();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors || { general: "حدث خطأ أثناء حفظ بيانات السكن" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bad-card">
      <div className="bad-card-header">
        <div className="bad-card-header-icon">
          <FontAwesomeIcon icon={faHouseUser} />
        </div>
        <div>
          <h3 className="bad-card-header-title">بيانات السكن والمصروفات</h3>
          <p className="bad-card-header-desc">
            وصف حالة المسكن، الملكية، الإيجار، والمصروفات الدورية للأسرة.
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
          {/* ملكية السكن */}
          <div className="bad-field">
            <label className="bad-label">ملكية السكن</label>
            <select
              className="bad-select"
              value={homeOwnership}
              onChange={(e) => setHomeOwnership(e.target.value)}
            >
              <option value="ملك">ملك</option>
              <option value="إيجار">إيجار</option>
              <option value="وقف">وقف خيري</option>
              <option value="سكن مع العائلة">سكن مع العائلة</option>
              <option value="رهن">رهن</option>
            </select>
          </div>

          {/* نوع السكن */}
          <div className="bad-field">
            <label className="bad-label">نوع السكن</label>
            <select
              className="bad-select"
              value={homeType}
              onChange={(e) => setHomeType(e.target.value)}
            >
              <option value="شقة">شقة</option>
              <option value="فيلا">فيلا</option>
              <option value="بيت شعبي">بيت شعبي</option>
              <option value="ملحق">ملحق</option>
              <option value="غرفة مستقلة">غرفة مستقلة</option>
            </select>
          </div>

          {/* الإيجار الشهري للسكن */}
          <div className="bad-field">
            <label className="bad-label">الإيجار الشهري للسكن (ريال)</label>
            <input
              type="number"
              className="bad-input"
              placeholder="0.00"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
            />
          </div>

          {/* حالة الأثاث */}
          <div className="bad-field">
            <label className="bad-label">حالة الأثاث</label>
            <select
              className="bad-select"
              value={furniture}
              onChange={(e) => setFurniture(e.target.value)}
            >
              <option value="ممتاز">ممتاز</option>
              <option value="جيد">جيد</option>
              <option value="متوسط">متوسط</option>
              <option value="سيء">سيء / متهالك</option>
            </select>
          </div>

          {/* المنطقة / المحافظة */}
          <div className="bad-field">
            <label className="bad-label">المنطقة / المحافظة</label>
            <input
              type="text"
              className="bad-input"
              placeholder="مثال: الرياض"
              value={homestate}
              onChange={(e) => setHomestate(e.target.value)}
            />
          </div>

          {/* الحي / المدينة */}
          <div className="bad-field">
            <label className="bad-label">الحي أو المدينة</label>
            <input
              type="text"
              className="bad-input"
              placeholder="مثال: حي الرمال"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
            />
          </div>

          {/* العنوان الوطني */}
          <div className="bad-field">
            <label className="bad-label">العنوان الوطني (اختياري)</label>
            <input
              type="text"
              className="bad-input"
              placeholder="رمز العنوان الوطني"
              value={nationalAdress}
              onChange={(e) => setNationalAdress(e.target.value)}
            />
          </div>

          {/* عدد السيارات المملوكة */}
          <div className="bad-field">
            <label className="bad-label">عدد السيارات المملوكة</label>
            <input
              type="number"
              className="bad-input"
              min="0"
              value={cars}
              onChange={(e) => setCars(e.target.value)}
            />
          </div>

          {/* عدد الأراضي المملوكة */}
          <div className="bad-field">
            <label className="bad-label">عدد الأراضي أو العقارات المملوكة</label>
            <input
              type="number"
              className="bad-input"
              min="0"
              value={lands}
              onChange={(e) => setLands(e.target.value)}
            />
          </div>

          {/* مكونات السكن */}
          <div className="bad-field">
            <label className="bad-label">مكونات السكن</label>
            <input
              type="text"
              className="bad-input"
              placeholder="مثال: 3 غرف وصالة ودورتي مياه"
              value={components}
              onChange={(e) => setComponents(e.target.value)}
            />
          </div>

          {/* تفاصيل العنوان */}
          <div className="bad-field bad-grid-full">
            <label className="bad-label">وصف وتفاصيل العنوان</label>
            <input
              type="text"
              className="bad-input"
              placeholder="الشارع، رقم المبنى، علامة مميزة..."
              value={summaryAdress}
              onChange={(e) => setSummaryAdress(e.target.value)}
            />
          </div>

          {/* فواتير ومصروفات السكن */}
          <div className="bad-grid-full" style={{ marginTop: "12px" }}>
            <label className="bad-label" style={{ fontSize: "15px" }}>
              الفواتير والمصروفات الشهرية
            </label>
            {bills.map((b, idx) => (
              <div key={idx} className="bad-repeat-item">
                <div className="bad-repeat-header">
                  <span className="bad-repeat-title">مصروف / فاتورة #{idx + 1}</span>
                  {bills.length > 1 && (
                    <button
                      type="button"
                      className="bad-btn-remove"
                      onClick={() => removeBill(idx)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} /> حذف
                    </button>
                  )}
                </div>
                <div className="bad-grid">
                  <div className="bad-field">
                    <label className="bad-label">نوع الفاتورة أو المصروف</label>
                    <input
                      type="text"
                      className="bad-input"
                      placeholder="فاتورة كهرباء، مياه، غاز..."
                      value={b.name}
                      onChange={(e) => updateBill(idx, "name", e.target.value)}
                    />
                  </div>
                  <div className="bad-field">
                    <label className="bad-label">المبلغ الشهري التقريبي (ريال)</label>
                    <input
                      type="number"
                      className="bad-input"
                      placeholder="0.00"
                      value={b.amount}
                      onChange={(e) => updateBill(idx, "amount", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="bad-btn-add" onClick={addBill}>
              <FontAwesomeIcon icon={faPlus} />
              <span>إضافة فاتورة / مصروف آخر</span>
            </button>
          </div>

          {/* صورة فاتورة الكهرباء */}
          <div className="bad-field">
            <label className="bad-label">صورة فاتورة الكهرباء أو عداد (اختياري)</label>
            <label className={`bad-upload-card ${upload1 ? "has-file" : ""}`}>
              <div className="bad-upload-info">
                <FontAwesomeIcon
                  icon={upload1 ? faCheckCircle : faCloudArrowUp}
                  className="bad-upload-icon"
                  style={{ color: upload1 ? "#2e7d32" : "#b89358" }}
                />
                <div>
                  <p className="bad-upload-title">
                    {upload1 ? upload1.name : "صورة الفاتورة"}
                  </p>
                  <p className="bad-upload-sub">JPG, PNG, PDF</p>
                </div>
              </div>
              <span className="bad-upload-btn">{upload1 ? "تغيير" : "اختيار"}</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => e.target.files && setUpload1(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {/* صورة صك الملكية أو عقد الإيجار */}
          <div className="bad-field">
            <label className="bad-label">صورة عقد الإيجار أو صك الملكية (اختياري)</label>
            <label className={`bad-upload-card ${upload2 ? "has-file" : ""}`}>
              <div className="bad-upload-info">
                <FontAwesomeIcon
                  icon={upload2 ? faCheckCircle : faCloudArrowUp}
                  className="bad-upload-icon"
                  style={{ color: upload2 ? "#2e7d32" : "#b89358" }}
                />
                <div>
                  <p className="bad-upload-title">
                    {upload2 ? upload2.name : "صورة العقد / الصك"}
                  </p>
                  <p className="bad-upload-sub">JPG, PNG, PDF</p>
                </div>
              </div>
              <span className="bad-upload-btn">{upload2 ? "تغيير" : "اختيار"}</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => e.target.files && setUpload2(e.target.files[0])}
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

export default ForBenefitHousingData;
