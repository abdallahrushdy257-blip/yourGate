import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsersBetweenLines } from "@fortawesome/free-solid-svg-icons";
import { useState  } from "react";
import TableComponent from "../../components/TableComponent";
import { useParams } from "react-router";
import API from "../../api/axiosConfig";
import { useEffect } from "react";


function CommiteeMembers() {

    const columns = [
        { name: " اسم العضو", key: "name" },
        { name: "دور العضو", key: "role" },
          ];

  

    const { id } = useParams();
    const [name, setName] = useState('');

    const getcommitteeName = async () => {
        try {
            const response = await API.get(`/associationcommittee/${id}`);
            const data = response.data;
            setName(data.name);
        } catch (error) {
            console.error("خطأ في جلب اسم اللجنة");
        }
    };

    useEffect(() => {
        getcommitteeName();
    }, []);

    return (
        <>
            <div className="printcasedata-container">
               
                <TableComponent
                    apiUrl={`/associationcommittee/${id}/members`}
                    columns={columns}
                    title={"تقرير أعضاء لجنة - " + name}
                    titleIcon={<FontAwesomeIcon icon={faUsersBetweenLines} />}
                    searchDate={false}
                />
            </div>
        </>
    );
}
export default CommiteeMembers
