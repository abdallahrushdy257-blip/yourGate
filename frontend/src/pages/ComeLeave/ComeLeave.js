import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import TableComponent from "../../components/TableComponent";
import ComeLeaveModal from "./ComeLeaveModal";
import "./ComeLeave.css";

function ComeLeave() {
  const [showModal, setShowModal] = useState(false);
  const [triggerReload, setTriggerReload] = useState(0);

  const columns = [
    { name: "إسم الموظف", key: "name" },
    { name: "وقت الحضور", key: "att" },
    { name: "وقت الانصراف", key: "dateleave" },
    { name: "التاريخ", key: "recorddate" },
  ];

  const handleSuccess = () => {
    setTriggerReload((prev) => prev + 1);
  };

  return (
    <div className="ComeLeave">
      <TableComponent
        apiUrl="/attendances"
        columns={columns}
        titleIcon={<FontAwesomeIcon icon={faTable} />}
        title="إدارة الحضور والانصراف"
        addBtn={true}
        addBtnName="حضور/انصراف"
        onAddClick={() => setShowModal(true)}
        triggerReload={triggerReload}
      />

      <ComeLeaveModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default ComeLeave;
