import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsersBetweenLines, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import TableComponent from "../../components/TableComponent";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axiosConfig";
import "./committee.css";

function CommiteeMembers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const columns = [
    { name: "اسم العضو", key: "name" },
    { name: "دور العضو باللجنة", key: "role_badge" },
  ];

  const getcommitteeName = async () => {
    try {
      const response = await API.get(`/associationcommittee/${id}`);
      const data = response.data?.data || response.data;
      setName(data?.name || "");
    } catch (error) {
      console.error("خطأ في جلب اسم اللجنة", error);
    }
  };

  useEffect(() => {
    getcommitteeName();
  }, [id]);

  const transformRowFn = (record) => {
    const role = record.role || "عضو";
    let badgeClass = "badge-role-member";
    if (role.includes("رئيس") && !role.includes("نائب")) {
      badgeClass = "badge-role-head";
    } else if (role.includes("نائب")) {
      badgeClass = "badge-role-deputy";
    }

    return {
      ...record,
      role_badge: `<span class="${badgeClass}">${role}</span>`,
    };
  };

  return (
    <div className="committee-page-container">
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "flex-start" }}>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/committee")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "13px",
            padding: "8px 18px",
          }}
        >
          <FontAwesomeIcon icon={faArrowRight} />
          <span>العودة لتقرير اللجان</span>
        </button>
      </div>

      <TableComponent
        apiUrl={`/associationcommittee/${id}/members`}
        columns={columns}
        title={`تقرير أعضاء ${name ? `(${name})` : "اللجنة"}`}
        titleIcon={<FontAwesomeIcon icon={faUsersBetweenLines} />}
        transformRowFn={transformRowFn}
        searchDate={false}
      />
    </div>
  );
}

export default CommiteeMembers;
