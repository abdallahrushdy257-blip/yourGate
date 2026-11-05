import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Title from "../../../../components/title";
import "./VacationDetails.css";
import { faList } from "@fortawesome/free-solid-svg-icons";
import CustomTable from "../../../../components/CustomTable";
import { useEffect, useState } from "react";
import API from "../../../../api/axiosConfig";

function VacationDetails() {
  const VacationDetailscolumns = [
    { name: "", key: "id", type: "hidden" },
    { name: "نوع الإجازة", key: "type", type: "text" },
    { name: "عدد أيام الإجازة", key: "duration", type: "text" },
  ];

  const [vacationDetailsrows, setVacationDetailsRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const res = await API.post("/vacations");
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        const formatted = list.map((item) => ({
          id: item.id,
          type: item.name,
          duration: `${item.days} يوم`,
        }));
        setVacationDetailsRows(formatted);
      } catch (err) {
        console.error("Error loading vacations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVacations();
  }, []);

  return (
    <>
      <div className="VacationDetails">
        <Title
          title="تفاصيل الإجازات"
          icon={<FontAwesomeIcon icon={faList} />}
        />
        <div className="VacationDetailsTabel">
          <CustomTable
            columns={VacationDetailscolumns}
            data={vacationDetailsrows}
            add={true}
          />
        </div>
      </div>
    </>
  );
}

export default VacationDetails;
