import react, { useState, useEffect } from "react";
import RegisterTextbox from "../../../components/RegisterTextBox";
import RegisterSelect from "../../../components/RegisterSelect";
import API from "../../../api/axiosConfig";
import "./committee.css";
import CustomButton from "../../../components/CustomButton";
import { Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function AddCommittee() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [boardMembers, setBoardMembers] = useState([]);
  const [error, setError] = useState([]);
  const [message, setMessage] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
  const getBoardMembers = async () => {
    try {
      const res = await API.get("/associationcommittee/components/assemblymembers");
      const data = await res;
      setBoardMembers(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBoardMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("members", JSON.stringify(selectedMembers));

    try {
      setIsSubmitting(true);
      const res = await API.post("/associationcommittee/store", formData);
      const data = await res;
      if (data.status === 200) {
        setIsSubmitting(false);
        setMessage(data.data.message);
        setError([]);
        navigate("/committee");
        // Optionally, reset form fields here
      } else {
        setIsSubmitting(false);
        setError(data.data.errors);
      }
    } catch (error) {
        
        setIsSubmitting(false);
        setError(error.response.data.errors);
        setMessage(error.response.data.message);
        
      }
    // Submit form logic here
  };

  return (
    <div className="add-committee-form">
      <h2 style={{display: "flex" , justifyContent:"center" , alignItems:"center" , marginBottom:"20px"}}>تشكيل لجنة جديدة</h2>
      <form onSubmit={handleSubmit}>
        <RegisterTextbox
          id="name"
          label="اسم اللجنة"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <RegisterTextbox
          id="description"
          label="وصف اللجنة"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="committee-members">
        {boardMembers.map((member) => (
          <label key={member.id} style={{ display: "block" , marginBottom: "5px" , marginLeft:"10px" }}>
            <input
              type="checkbox"
              checked={selectedMembers.some((m) => m.id === member.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedMembers([
                    ...selectedMembers,
                    { id: member.id, name: member.name, role: "عضو" },
                  ]);
                } else {
                  setSelectedMembers(
                    selectedMembers.filter((m) => m.id !== member.id)
                  );
                }
              }}
              style={{ marginRight: "5px" }}
            />
            {member.name}
          </label>
        ))}

        {selectedMembers.map((member, index) => (
          <div key={member.id}>
            <p style={{ direction: "rtl", marginRight: "5px" , textDecoration:"underline" }}>{member.name}</p>

           
            <RegisterSelect
                id={`role-${member.id}`}
                label="الدور"
                options={[
                    { value: "رئيس اللجنة", label: "رئيس اللجنة" },
                    { value: "نائب رئيس", label: "نائب رئيس" },
                    { value: "عضو", label: "عضو" },
                ]}
                value={member.role}
                onChange={(e) => {
                    const updated = [...selectedMembers];
                    updated[index].role = e.target.value;
                    setSelectedMembers(updated);
                }}
            />
          </div>
        ))}
        </div>
        <div className="addClientBtn">
        {
        isSubmitting ? <Spinner animation="border" variant="primary" /> :
            <CustomButton
                text="حفظ"
                onClick={handleSubmit}
            />
        }
        </div>
      </form>
    </div>
  );
}

export default AddCommittee;
