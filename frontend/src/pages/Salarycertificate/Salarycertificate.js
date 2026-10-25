import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../components/title";
import "./Salarycertificate.css";
import { faMoneyBills } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";
import RegisterTextarea from "../../components/RegisterTextarea";

function Salarycertificate() {
  return (
    <>
      <div className="salarycertificate">
        <Title
          title="شهادة تعريف بالراتب"
          icon={<FontAwesomeIcon icon={faMoneyBills} />}
        />
        <div className="salarycertificate-con">
          <div className="salarycertificate-inputs">
            <div className="salarycertificate-date">
              <p className="cerdate">تاريخ التعريف</p>
              <RegisterTextbox
                parentStyle={{
                  width: "25%",
                }}
                id="certifcateDate"
                type="date"
                stylee={{
                  width: "30%",
                }}
                disabled={true}
              />
            </div>
            <div className="salarycertificate-input">
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="certifcateDate"
                type="name"
                label="إسم الموظف"
                stylee={{
                  width: "30%",
                }}
                disabled={true}
              />
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="certifcateDate"
                type="idnum"
                label="رقم الهوية"
                stylee={{
                  width: "30%",
                }}
                disabled={true}
              />
            </div>
            <div className="salarycertificate-input">
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="birhday"
                type="date"
                label="تاريخ الميلاد"
                stylee={{
                  width: "30%",
                }}
                disabled={true}
              />
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="startdate"
                type="date"
                label="تاريخ بداية الخدمة"
                stylee={{
                  width: "30%",
                }}
                disabled={true}
              />
            </div>
            <div className="salarycertificate-input">
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="mainsalary"
                type="number"
                label="الراتب الأساسي"
                stylee={{
                  width: "30%",
                }}
                disabled={true}
              />
              <RegisterTextbox
                parentStyle={{
                  width: "30%",
                }}
                id="allowances"
                type="number"
                label="إجمالي البدلات"
                stylee={{
                  width: "30%",
                }}
                disabled={true}
              />
            </div>

            <div className="salarycertificate-input">
              <RegisterTextarea
                id="payreport"
                label="إقرار الصرف"
                parentStyle={{
                  width: "65%",
                  marginBottom: "20px",
                }}
                stylee={{
                  height: "100px",
                }}
                disabled={true}
                rows={5}
              />
            </div>
            <button className="generalPrint" onClick={() => window.print()}>
              طباعة
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Salarycertificate;
