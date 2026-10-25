import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Title from '../../components/title'
import './paymentData.css'
import { faBagShopping } from '@fortawesome/free-solid-svg-icons'
import CustomTable from '../../components/CustomTable'
import { useEffect, useState } from 'react'
import TableComponent from '../../components/TableComponent'
import { useParams } from 'react-router-dom';
import API from '../../api/axiosConfig'

function PaymentData() {
    const columns = [
        { name: "رقم القرض", key: "loannumber" },
        { name: "إسم المستفيد", key: "membername" },
        { name: "قيمة القرض", key: "amount" },
        { name: "تاريخ الاستحقاق", key: "duedate" },
        { name: "حالة القرض", key: "loantype" },
        // { name: "ملاحظات", key: "notes" },
        { name: "", key: "actions" },
    ];
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);



    const dropdownOptions = [
        { label: "سند قبض", route: "/receiptvoucherloan/:id" },
    ];

    const modifyRow = (row) => {
        let newRow = { ...row };
        if (newRow.duedate < new Date().toISOString().split('T')[0]) {
            newRow.duedate = `<span style="color:red ; font-weight:bold">${newRow.duedate}</span>`;
        }
        return newRow;
    }



    const getWarrantor = async () => {
        try {
            const res = await API.get("/warrantor/" + id);
            const data = await res;
            if (data.status === 200) {
                setData(data.data);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getWarrantor();
    }, []);


    return (
        <>
            <Title
                title={`${data && data.warrantor && data.warrantor.name} - بيانات المدفوعات     `}
                icon={<FontAwesomeIcon icon={faBagShopping} />}
            />
            <div className='paymentdata'>

                <TableComponent
                    apiUrl={"/loans/payment/case"}
                    columns={columns}
                    dropdownOptions={dropdownOptions}
                    id={id}
                    transformRowFn={modifyRow}
                />
            </div>
        </>
    )
}

export default PaymentData