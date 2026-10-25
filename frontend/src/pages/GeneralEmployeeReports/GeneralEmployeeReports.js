import "./generalEmployeeReports.css";
import Title from "../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import RegisterTextbox from "../../components/RegisterTextBox";

function GeneralEmployeeReports() {
  return ( 
    <>
      <div className="generalemployeereports">
        <Title
          title="عرض تقيم الاداء الوظيفي"
          icon={<FontAwesomeIcon icon={faPrint} />}
        />
        <div className="generalemployeereportsinputs">
          <div className="generalemployeereportsinput">
            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="إسم الموظف"
              type="text" 
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />

            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="رقم الهوية"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />
          </div>
          <div className="generalemployeereportsinput">
            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="تاريخ الميلاد"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />

            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="العنوان"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />
          </div>
          <div className="generalemployeereportsinput">
            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="رقم الجوال"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />

            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="البريد الإلكتروني"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />
          </div>
          <div className="generalemployeereportsinput">
            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="تاريخ انتهاء بطاقة الهوية"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />
            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="الجنسية"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />
          </div>
          <div className="generalemployeereportsinput">
            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="ساعات العمل"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />

            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="تاريخ الإلتحاق بالعمل"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />
          </div>
          <div className="generalemployeereportsinput">
            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="التأمين الإجتماعي"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />

            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="المسمي الوظيفي"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />
          </div>
          <div className="generalemployeereportsinput">
            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="الخصومات"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />

            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="عدد أيام العمل"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />
          </div>
          <div className="generalemployeereportsinput">
            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="عدد أيام الإجازات"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />

            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="التحقيقات"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />
          </div>
          <div className="generalemployeereportsinput">
            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="المسمي الوظيفي"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />

            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="الراتب الأساسي"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />
          </div>
          <div className="generalemployeereportsinput">
            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="الراتب الإضافي"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />

            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="الحوافز"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />
          </div>
          <div className="generalemployeereportsinput">
            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="التأمين الإجتماعي"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />

            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="التأمين الصحي"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />
          </div>
          <div className="generalemployeereportsinput">
            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="ضريبة الدخل"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />

            <RegisterTextbox
              parentStyle={{
                width: "80%",
              }}
              label="إجمالي المرتب"
              type="text"
              stylee={{
                width: "55%",
              }}
              disabled={true}
            />
          </div>
          <div className="generalemployeereportsinput generalemployeereportsinputlast">
            <div className=" genralrepoplacecont ">
              <p className="generalemployeereportstext">الصورة الشخصية</p>
              <div className="genralrepoplace"></div>
            </div>
            <div className=" genralrepoplacecont ">
              <p className="generalemployeereportstext">صورة الهوية</p>
              <div className="genralrepoplace"></div>
            </div>
            <div className=" genralrepoplacecont ">
              <p className="generalemployeereportstext">السيرة الذاتية</p>
              <div className="genralrepoplace"></div>
            </div>
            <div className=" genralrepoplacecont ">
              <p className="generalemployeereportstext">البيانات الاخري</p>
              <div className="genralrepoplace"></div>
            </div>
          </div>

          <button className="generalPrint" onClick={() => window.print()}>
            طباعة
          </button>
        </div>
      </div>
    </>
  );
}

export default GeneralEmployeeReports;
