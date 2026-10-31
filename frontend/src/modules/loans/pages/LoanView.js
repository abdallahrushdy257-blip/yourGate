import "../../../pages/AddDonor/addDonor.css"
import Title from "../../../components/title";
import RegisterTextbox from "../../../components/RegisterTextBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import './loanView.css' 
import API from '../../../api/axiosConfig';


function LoanView() {



    const { id } = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);


    const getLoans = async () => {
        try {
            const res = await API.get("/loans/" + id);
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
        getLoans();
    }, []);


    return (
        <>
            <Title title="عرض القرض" className="marketingtitle" icon={<FontAwesomeIcon icon={faHandHoldingDollar} />} />
            <div className="addDonorContainer">
                <div className="donorForm donorForm2">
                    <div className='donorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            label='إسم المستفيد'
                            value={data.human_case?.name || ""}
                            type="text"
                            stylee={{ width: "45%" }}
                        />
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            label='إسم الكفيل'
                            value={data.warrantor?.name || ""}
                            type="text"
                            stylee={{ width: "45%" }}
                        />
                    </div>
                    <div className='donorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            label='قيمة القرض'
                            type="number"
                            value={data.amount || ""}
                            stylee={{ width: "45%" }}
                        />
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            label='قيمة القسط الشهري'
                            value={data.payments?.[0]?.amount || ""}
                            type="number"
                            stylee={{ width: "45%" }}
                        />
                    </div>

                    <div className='donorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            label='عدد الاقساط'
                            value={data.payments?.length || 0}
                            type="number"
                            stylee={{ width: "45%" }}
                        />
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            label='المسؤل عن القرض'
                            type="text"
                            value={data.user?.name || ""}
                            stylee={{ width: "45%" }}
                        />
                    </div>
                    <div className='donorRow'>
                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            label='نهاية الاستحقاق'
                            value={data.payments?.[data.payments.length - 1]?.date || ""}
                            type="text"
                            stylee={{ width: "45%" }}
                        />

                        <RegisterTextbox
                            parentStyle={{ width: "45%" }}
                            label='بداية الاستحقاق'
                            type="text"
                            value={data.responsedate || ""}
                            stylee={{ width: "45%" }}
                        />

                    </div>


                </div>
            </div>
        </>
    )
}

export default LoanView;
