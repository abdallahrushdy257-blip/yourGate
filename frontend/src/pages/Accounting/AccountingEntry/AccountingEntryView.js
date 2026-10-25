import  { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
import API from "../../../api/axiosConfig";
import Title from "../../../components/title";
import TestPreLoader from "../../TestPreLoader/TestPreLoader";
import RegisterTextbox from "../../../components/RegisterTextBox";


function AccountingEntryView() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    
    const getEntriesone = async () => {
        try {
        const response = await API.get(`/transactions/${id}`);
        const data = response.data;
        setLoading(false);
        setEntries(data);
        } catch (error) {
        console.error("Error fetching entries:", error);
        }
    };



    useEffect(() => {
        getEntriesone();
    }, []);

    console.log(entries);

    return (
        loading ? (
            <div style={{ height: "100vh" }}>
                <TestPreLoader />
            </div>
        ) :
        <>
        <div className="container">
            {/* <Title title=" عرض القيد" icon={faFileInvoice} /> */}
            <Title
                        
                        title="القيد المحاسبي"
                        icon={<FontAwesomeIcon icon={faTable} />}
                      />
           <div className="row" style={{ marginTop: "50px" }}>
                <div className="col-6">
                    <RegisterTextbox
                        label="رقم القيد"
                        value={entries && entries.registration_number && entries.registration_number}
                        disabled={true}
                        type="text"
                        />
                </div>
                <div className="col-6">
                    <RegisterTextbox
                        label="تاريخ القيد"
                        value={entries && entries.date && entries.date}
                        disabled={true}
                        type="text"
                        />
                </div>

            </div>
            <table className="table table-bordered table-striped" style={{ marginTop: "30px"  , direction: "rtl" , backgroundColor: 'var(--background-color) !important' }}>
                <thead>
                    <tr>
                        <th> اسم الحساب</th>
                        <th>رقم الحساب</th>
                        <th>مدين</th>
                        <th>دائن</th>
                    </tr>
                </thead>
                <tbody>
                   
                        <tr>
                            <td>{entries && entries.debitaccount && entries.debitaccount.name}</td>
                            <td>{entries && entries.debitaccount && entries.debitaccount.code}</td>
                            <td>{entries && entries.debt_amount && entries.debt_amount}</td>
                            <td>---</td>
                           
                        </tr>
                        <tr >
                            <td>{entries && entries.creditaccount && entries.creditaccount.name}</td>
                            <td>{entries && entries.creditaccount && entries.creditaccount.code}</td>
                            <td>---</td>
                            <td>{entries && entries.credit_amount && entries.credit_amount}</td>
                           
                        </tr>
                 
                </tbody>
            </table>

      
        </div>
        </>
        
    );
}
export default AccountingEntryView;