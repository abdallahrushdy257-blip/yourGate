import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignsPost } from "@fortawesome/free-solid-svg-icons";
import TableComponent from "../../../../components/TableComponent";
import "./DesignsDetails.css";

function DesignsDetailsshop() {
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
      <TableComponent
        apiUrl="/shopdetails/designs"
        columns={columns}
        title="التصميمات"
        titleIcon={<FontAwesomeIcon icon={faSignsPost} />}
        transformRowFn={modifyRow}
        searchDate={false}
      />
    </div>
  );
}

export default DesignsDetailsshop;

