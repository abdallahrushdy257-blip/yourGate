import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Title from '../../components/title'
import '../PaymentData/paymentData.css'
import { faBagShopping } from '@fortawesome/free-solid-svg-icons'
import CustomTable from '../../components/CustomTable'
import TableComponent from '../../components/TableComponent'
import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import RegisterSelect from '../../components/RegisterSelect'
import API from '../../api/axiosConfig'
import { useNavigate } from 'react-router'

function Feasibility() {
    const columns = [
        { name: "رقم المشروع", key: "serial" },
        { name: "اسم المستفيد", key: "name" },
        // { name: "تحميل", key: "upload" },
        // { name: "إرفاق", key: "upload2" },
        { name: "حالة المشروع", key: "status" },
        { name: "", key: "actions" },
    ];

    const [rows, setRows] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const [status, setStatus] = useState("");
    const [id, setId] = useState("");
    const navigate = useNavigate();
    const [currentStatus, setCurrentStatus] = useState("");




    const dropdownOptions = [
      
        { label: "سند صرف", action: (id, record) => { 
            if (record.status !== 'تم الموافقه') {
                alert("لا يمكن صرف اي مبلغ حتى تتم الموافقة على القرض");
            } else {
                navigate(`/paymentvoucherloan/${id}`);
            }
         } },

        {
            label: "القرار", action: (id, record) => {

                if (record.status !== 'تحت المراجعة') {
                    alert("لا يمكن تغيير الحالة");
                } else {
                    setShowModel(true);
                    setId(id);
                }
            }
        },
        { label: "التفاصيل", action: (id, record) => { navigate(`/fstudy/${id}`) } }
    ];
    const handleDecission = async (e) => {
        e.preventDefault();
        setShowModel(false);
        const mForm = new FormData();
        mForm.append("status", status);
        mForm.append("id", id);
        try {
            const res = await API.post(`loans/update/status`, mForm);
            const data = await res;
            navigate("/loansData");
        } catch (error) {
            console.error(error);
        }


    }

    const handleDownload = (selectedRows) => {
        const selectedData = rows.filter((row) => selectedRows.includes(row.id));
        if (selectedData.length === 0) {
            alert("Please select at least one row.");
            return;
        }

        const csvHeader = columns
            .filter((col) => col.key !== "actions")
            .map((col) => col.name)
            .join(",");

        const csvRows = selectedData.map((row) =>
            columns
                .filter((col) => col.key !== "actions")
                .map((col) => `"${row[col.key] || ""}"`)
                .join(",")
        );

        const csvContent = `${csvHeader}\n${csvRows.join("\n")}`;

        const bom = "\uFEFF";
        const finalContent = bom + csvContent;

        const blob = new Blob([finalContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "selected_rows_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <>
            <Title
                title="دراسة الجدوي للمشاريع"
                icon={<FontAwesomeIcon icon={faBagShopping} />}
            />
            <div className='paymentdata'>
                {/* <CustomTable
                    columns={columns}
                    data={rows}
                    onDownload={handleDownload}
                    dropdownOptions={dropdownOptions}
                /> */}
                <TableComponent
                    apiUrl={`/feasibilitystudies`}
                    columns={columns}
                    data={rows}
                    onDownload={handleDownload}
                    dropdownOptions={dropdownOptions}
                    searchDate = {false}
                />
            </div>
            {
                showModel && (
                    <Modal show={showModel} onHide={() => setShowModel(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>قرار</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="decision">قرار</label>
                                    <select className="form-control" id="decision" value={status} onChange={(e) => setStatus(e.target.value)} style={{ direction: "rtl" }}>
                                        <option value="">اختر قرار</option>
                                        <option value="1"> موافقة</option>
                                        <option value="2"> رفض</option>
                                    </select>
                                    <input type="hidden" name="id" value={id} />
                                    <button type="submit" className="btn btn-primary mt-3" onClick={handleDecission}>حفظ</button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>
                )
            }
        </>
    )
}

export default Feasibility