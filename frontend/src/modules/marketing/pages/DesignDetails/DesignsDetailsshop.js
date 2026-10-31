import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import TableComponent from "../../../../components/TableComponent";
import "./DesignsDetails.css";

function MarketingDetailsshop() {
  const columns = [
    { name: "إسم الحالة", key: "title" },
    { name: "التاريخ", key: "date" },
    { name: "المتطلبات", key: "description" },
    { name: "حالة الطلب", key: "status" },
    { name: "المرفقات", key: "upload" },
    { name: "الملاحظات", key: "note" },
  ];

  const modifyRow = (row) => {
    let newRow = { ...row };
    let transStatus = (status) => {
      if (status == 0) {
        return '<span style="border-radius:5px; border:1px solid blue; padding:2px ">قيد التصميم</span>';
      } else if (status == 1) {
        return '<span style="border-radius:5px; border:1px solid red; padding:2px ">قيد التنفيذ</span>';
      } else {
        return '<span style="border-radius:5px; border:1px solid green; padding:2px ">مكتمل</span>';
      }
    };
    let showPhoto = (photo) => {
      if (photo) {
        return `<a href="${photo}" target="_blank">👁️</a>`;
      } else {
        return '<button class="btn btn-danger" >لا يوجد</button>';
      }
    };

    newRow.status = transStatus(newRow.status);
    newRow.upload = showPhoto(newRow.upload);
    return newRow;
  };

  return (
    <div className="designsdetails">
      <div className="designsdetails-table">
        <TableComponent
          apiUrl="/shopdetails/marketing"
          columns={columns}
          title="عمليات التسويق"
          titleIcon={<FontAwesomeIcon icon={faBullhorn} />}
          transformRowFn={modifyRow}
          searchDate={false}
        />
      </div>
    </div>
  );
}

export default MarketingDetailsshop;

