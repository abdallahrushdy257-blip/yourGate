import { useState } from "react";
import API from "../../api/axiosConfig";

function CreateBeneficiaryLink() {
  const [name, setName] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const handleCreateLink = async () => {
    try {
      const res = await API.post("/hcform/request");

       if (res.status === 200) {
        const link = `${window.location.origin}/benefitadddetails/${res.data.code}`;
        setGeneratedLink(link);
       }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h3>إنشاء رابط إضافة بيانات المستفيد</h3>
      <input
        type="text"
        className="form-control"
        value={generatedLink}
        style={{
          background: "var(--background-color)",
          border: "3px solid var(--border-color) !important",
          color: "var(--text-color) !important",
          borderRadius: "18px",
            width: "450px",
          margin: "45px auto 10px",
              }}
              readOnly
              placeholder="اضغط على الزر لانشاء رابط خارجي"
      />
      <h6 style={{color:"red", display:`${generatedLink === "" ? "none" : "block"}`}}>هذا الرابط يستخدم مرة واحدة و صالح لمدة 24 ساعة</h6>
      <button className="btn btn-primary mt-3" onClick={handleCreateLink}>
        إنشاء رابط
      </button>
    </div>
  );
}

export default CreateBeneficiaryLink;
