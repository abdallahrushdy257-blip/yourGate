import { faPlaneSlash, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import Title from "../../../components/title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./AddSupplier.css";
import RegisterTextbox from "../../../components/RegisterTextBox";
import CustomButton from "../../../components/CustomButton";

function AddSupplier() {



  const handleSubmit = async (e) => {
    e.preventDefault();




  };

  return (
    <>
      <Title
        title="إضافة مورد جديد"
        icon={<FontAwesomeIcon icon={faPlusSquare} />}
        style={{ width: "unset" }}
      />
      <div className="AddSupplier">
        <form className="input-AddSupplier" onSubmit={handleSubmit}>
          <RegisterTextbox
            parentStyle={{
              width: "30%",
            }}
            id="name"
            label="إسم المورد"
            type="text"
            stylee={{
              width: "30%",
            }}
          />
          <RegisterTextbox
            parentStyle={{
              width: "30%",
            }}
            id="phone"
            label="رقم الجوال"
            type="number"

            stylee={{
              width: "30%",
            }}
          />
          <RegisterTextbox
            parentStyle={{
              width: "30%",
            }}
            id="email"
            label="البريد الإلكتروني"
            type="email"

            stylee={{
              width: "30%",
            }}
          />
          <RegisterTextbox
            parentStyle={{
              width: "30%",
            }}
            id="balance"
            label="الرصيد الافتتاحي"
            type="number"

            stylee={{
              width: "30%",
            }}
          />
          <RegisterTextbox
            parentStyle={{
              width: "30%",
            }}
            id="description"
            label="الوصف"
            type="text"

            stylee={{
              width: "30%",
            }}
          />
          <div className="addclint-Button-con">
            <CustomButton
              text="حفظ"
              type="submit"
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default AddSupplier;
