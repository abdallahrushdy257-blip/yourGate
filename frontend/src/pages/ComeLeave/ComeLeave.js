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

  const dummyData = [
    {
      id: 1,
      name: "أحمد السالم",
      att: "08:00",
      dateleave: "16:00",
      recorddate: "2026-07-23",
    },
    {
      id: 2,
      name: "سارة محمد",
      att: "07:50",
      dateleave: "15:30",
      recorddate: "2026-07-23",
    },
    {
      id: 3,
      name: "خالد إبراهيم",
      att: "08:30",
      dateleave: "17:00",
      recorddate: "2026-07-24",
    },
  ];

  return (
    <div className="ComeLeave">
      <TableComponent
        apiUrl="/attendances"
        data={dummyData}
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
