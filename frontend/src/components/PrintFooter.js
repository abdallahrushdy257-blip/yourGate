function PrintFooter(params) {
  return (
    <div
      className="tfooter p-2"
      style={{
        fontSize: "12px",
        display: "flex",
        justifyContent: "space-between",
      }}
      dir="ltr"
    >
      <div className="text-end">
        <div className="d-flex justify-content-end gap-2">
          <p>{new Date().toLocaleDateString()}</p>
          <span>: تاريخ الطباعة</span>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <p>978787</p>
          <span>: الرقم الضريبي</span>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <p>978514875787</p>
          <span>: رقم الجوال</span>
        </div>
      </div>

      <div className="">
        <div className="d-flex justify-content-end gap-2">
          <p>example@example.com</p>
          <span>: البريد الإلكتروني</span>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <p>025487872</p>
          <span>: رقم الواتساب</span>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <p>www.example.com</p>
          <span>: الموقع الإلكتروني</span>
        </div>
      </div>
    </div>
  );
}

export default PrintFooter;