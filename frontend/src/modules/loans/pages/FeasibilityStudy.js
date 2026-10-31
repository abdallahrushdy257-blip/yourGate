import React, { useState, useEffect } from 'react';
import "../../../pages/CreateLoan/createLoan.css"
import Title from '../../../components/title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPlus } from '@fortawesome/free-solid-svg-icons';
import "../../../pages/AddBeneficiary/addBeneficiary.css"
import './endowments.css'

import API from '../../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router';
import { Spinner, Form } from 'react-bootstrap';
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";
import ProjectData from "../../../pages/Feasibility/Allitems/ProjectData";
import Swot from './Allitems/Swot';
import TechnicalSide from './Allitems/TechnicalSide';
import OrganizationChart from './Allitems/OrganizationChart';
import ProjectSteps from './Allitems/ProjectSteps';
import EstablishmentFees from './Allitems/EstablishmentFees';
import Assests from './Allitems/Assests';
import MonthlyWorking from './Allitems/MonthlyWorking';
import ProductsIncome from './Allitems/ProductsIncome';
import { use } from 'react';




function FeasibilityStudy() {

    const tabsBase = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const [activeTab, setActiveTab] = useState('one');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const { id } = useParams();
    const [data , setData] = useState([]);
    

    const tabs = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']; // Add the new tab here
    const [error, setError] = useState({});
    

    const handleNext = () => {
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1]);
        }
    };

    const getLoanData = async () => {
        try {
            const res = await API.get('/loans/' + id);
            const responseData = await res.data;
            setData(responseData);
            // Process the responseData as needed
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.errors);
            }
        }
    };

    useEffect(() => {
        getLoanData();
    }, []);




    const handleBack = () => {
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1]);
        }
    };





    
    //     e.preventDefault();
    //     setIsSubmitting(true);
    //     const technical_side_array = formData.license.map((item, index) => ({
    //         'license': item,
    //         'from': formData.from[index],
    //         'cost': formData.cost[index],
    //     }));
    //     const organization_chart_array = formData.job.map((item, index) => ({
    //         'job': item,
    //         'sallary': formData.sallary[index],
    //         'empcount': formData.empcount[index],
    //     }));
    //     const project_steps_array = formData.monthcount.map((item, index) => ({
    //         'monthcount': item,
    //         'projectplace': formData.projectplace[index],
    //         'fesibility': formData.fesibility[index],
    //         'establishment': formData.establishment[index],
    //         'marketing': formData.marketing[index],
    //         'steps': formData.steps[index],
    //         'openning': formData.openning[index],
    //     }));

    //     const establishment_fees_array = formData.establishmentstatment.map((item, index) => ({
    //         'establishmentstatment': item,
    //         'establishmentfees': formData.establishmentfees[index],
    //     }));

    //     const assets_array = formData.assetname.map((item, index) => ({
    //         'assetname': item,
    //         'assetvalue': formData.assetvalue[index],
    //         'assetcount': formData.assetcount[index],
    //     }));
    //     const monthly_working_array = formData.pname.map((item, index) => ({
    //         'paymentname': item,
    //         'paymentfees': formData.paymentfees[index],
    //     }));
    //     const products_income_array = formData.productname.map((item, index) => ({
    //         'productname': item,
    //         'productcost': formData.productcost[index],
    //         'sell': formData.sell[index],
    //         'productphone': formData.productphone[index],

    //         'income': formData.income[index],
    //         'netincome': formData.netincome[index],
    //     }));
    //     const data = {
    //         id: formData.id,
    //         project_data: {
    //             'address': formData.address,
    //             'phone': formData.phone,
    //             'type': formData.type,
    //             'description': formData.description,
    //             'contact': formData.contact,
    //         },
    //         swot: {
    //             'strength': formData.strength,
    //             'weaknesses': formData.weaknesses,
    //             'opportunities': formData.opportunities,
    //             'threats': formData.threats,
    //         },
    //         technical_side: {
    //             technical_side_array,
    //             'upload': formData.upload,
    //         },
    //         organization_chart: organization_chart_array,
    //         project_steps: {
    //             project_steps_array,
    //             'upload2': formData.upload2,
    //         },
    //         establishment_fees: establishment_fees_array,
    //         assets: assets_array,
    //         monthly_working: monthly_working_array,
    //         products_income: products_income_array,
    //     }
    //     try {
    //         const res = await API.post('/feasibilitystudies/store', data);
    //         const responseData = await res.data;
    //         navigate('/loansData');

    //     } catch (error) {
    //         if (error.response && error.response.data) {
    //             setError(error.response.data.errors);
    //             setMessage(error.response.data.message);
    //             setIsSubmitting(false);
    //         }
    //     }
    //     //console.log("formData:", formData);


    // };
    const renderContent = () => {
        switch (activeTab) {
            case 'one':
                return (
                    <>
                        <ProjectData goNextTab={handleNext}/>
                    </>
                );

            case 'two':
                return (
                    <>
                        <Swot goNextTab={handleNext}/>
                    </>
                );
            case 'three':
                return (
                    <>
                        <TechnicalSide goNextTab={handleNext}/>
                    </>
                );
            case 'four':
                return (
                    <>
                        <OrganizationChart goNextTab={handleNext} />
                    </>
                );
            case 'five':
                return (
                    <>
                        <ProjectSteps goNextTab={handleNext} />
                    </>
                );
            case 'six':
                return (
                    <>
                        <EstablishmentFees goNextTab={handleNext} />
                    </>
                );
            case 'seven':
                return (
                    <>
                        <Assests goNextTab={handleNext} />
                    </>
                );
            case 'eight':
                return (
                    <>
                        <MonthlyWorking goNextTab={handleNext} />
                    </>
                );
            case 'nine':
                return (
                    <>
                        <ProductsIncome  />
                    </>
                );
            default:
                return null;
        }
    };

    


    return (
        <div className='createloan'>
            <Title
                title={`إضافة دراسة جدوى لمشروع ${data && data.human_case && data.human_case.name} رقم الطلب ${data && data.serial}`}
                
                icon={<FontAwesomeIcon icon={faPlus} />}
            />
            <Form >
                <div className='divre'>
                    <div className='myTabs myTabs2' style={{ marginBottom: '20px', direction: 'rtl' }}>
                        {tabs.map((tab, index) => (
                            <button
                                key={tab}
                                className={`loantab ${activeTab === tab ? 'active' : ''} loantab2`}
                                //onClick={() => setActiveTab(tab)}
                                type="button"
                            >
                                {/* {tab === 'one' ? '1' : tab === 'two' ? '2' : '3'} */}
                                {tab === 'one' ? '1' : index + 1}
                            </button>
                        ))}
                    </div>
                    <div className='line' style={{ width: '67%', right: '16%' }}></div>

                </div>
                <div className='tabContent'>{renderContent()}</div>


            </Form>
            {/* <div className='navigationButtons'>

                {activeTab !== 'nine' ? (
                    <button className=' loanbtn nextButton' onClick={handleNext} disabled={tabs.indexOf(activeTab) === tabs.length - 1} type="button">
                        التالي
                    </button>
                ) : (
                    isSubmitting ? <Spinner animation="border" variant="primary" /> :
                        <button type="submit" className=' loanbtn saveButton' >
                            حفظ
                        </button>
                )}
                {activeTab !== 'one' && (
                    <button className=' loanbtn backButton' onClick={handleBack} type="button">
                        السابق
                    </button>
                )}
            </div> */}
        </div>
    );
}

export default FeasibilityStudy;
