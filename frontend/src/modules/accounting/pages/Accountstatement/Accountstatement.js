import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../../components/title";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./accountstatement.css";

function Accountstatement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState("accounts");

  useEffect(() => {
    if (location.pathname.includes("accounts")) {
      setSelectedOption("accounts");
    } else if (location.pathname.includes("humancase")) {
      setSelectedOption("humancase");
    } else if (location.pathname.includes("donors")) {
      setSelectedOption("donors");
    } else if (location.pathname.includes("warrantors")) {
      setSelectedOption("warrantors");
    } else if (location.pathname.includes("assemblymembers")) {
      setSelectedOption("assemblymembers");
    } else if (location.pathname.includes("managementmembers")) {
      setSelectedOption("managementmembers");
    } else if (location.pathname.includes("customers")) {
      setSelectedOption("customers");
    } else if (location.pathname.includes("suppliers")) {
      setSelectedOption("suppliers");
    }
  }, [location.pathname]);

  const handleRadioChange = (route, option) => {
    setSelectedOption(option);
    navigate(route);
  };

  return (
    <>
      <Title title="كشف الحساب" icon={<FontAwesomeIcon icon={faFileInvoiceDollar} />} />
      <div className="Accountstatement">
        <div className="type-user d-flex flex-wrap justify-content-center gap-3">
          <Form.Check
            inline
            label="الحسابات المالية"
            type="radio"
            className="createManage-redio"
            name="accountType"
            checked={selectedOption === "accounts"}
            onChange={() => handleRadioChange("/accountstatement/accounts", "accounts")}
          />
          <Form.Check
            inline
            label="مستفيدون"
            type="radio"
            className="createManage-redio"
            name="accountType"
            checked={selectedOption === "humancase"}
            onChange={() => handleRadioChange("/accountstatement/humancase", "humancase")}
          />
          <Form.Check
            inline
            label="مانحون"
            type="radio"
            className="createManage-redio"
            name="accountType"
            checked={selectedOption === "donors"}
            onChange={() => handleRadioChange("/accountstatement/donors", "donors")}
          />
          <Form.Check
            inline
            label="كفلاء"
            type="radio"
            className="createManage-redio"
            name="accountType"
            checked={selectedOption === "warrantors"}
            onChange={() => handleRadioChange("/accountstatement/warrantors", "warrantors")}
          />
          <Form.Check
            inline
            label="أعضاء مجلس إدارة"
            type="radio"
            className="createManage-redio"
            name="accountType"
            checked={selectedOption === "managementmembers"}
            onChange={() => handleRadioChange("/accountstatement/managementmembers", "managementmembers")}
          />
          <Form.Check
            inline
            label="أعضاء جمعية عمومية"
            type="radio"
            className="createManage-redio"
            name="accountType"
            checked={selectedOption === "assemblymembers"}
            onChange={() => handleRadioChange("/accountstatement/assemblymembers", "assemblymembers")}
          />
        </div>
      </div>
    </>
  );
}

export default Accountstatement;
