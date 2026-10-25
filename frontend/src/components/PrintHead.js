import Logo from "../logo-light.svg";

function PrintHead(props) {
  return (
    <>
      <div
        className="w-100 theader p-2"
        dir="ltr"
        style={{
          fontSize: "14px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div className="logo-box" style={{ width: "100px", height: "100px" }}>
            <img src={Logo} alt="Logo" width="50px" />
          </div>
        </div>
        <div className="text-end">
          <div className="d-flex justify-content-end gap-2">
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "18px",
              }}
            >
              تقرير المانحين
            </h2>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <p> jshjshsh </p>
            <span>: اسم الجمعية</span>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <p>978787</p>
            <span>: رقم الفاتورة</span>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <p>rgrgr fefeddd</p>
            <span>: العنوان</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrintHead;