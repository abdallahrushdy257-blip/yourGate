import { useState } from "react";
import TableComponent from "../../../../components/TableComponent";
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
        title="الحضور والانصراف"
        addBtn={true}
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
