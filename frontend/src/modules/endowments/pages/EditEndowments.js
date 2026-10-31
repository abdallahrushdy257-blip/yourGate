import React, { useEffect, useState } from 'react';
import "../../../pages/CreateLoan/createLoan.css"
import Title from '../../../components/title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPen } from '@fortawesome/free-solid-svg-icons';
import "../../../pages/AddBeneficiary/addBeneficiary.css"
import './endowments.css'
import RegisterTextbox from '../../../components/RegisterTextBox';
import RegisterSelect from '../../../components/RegisterSelect';
import UploadInput from '../../../components/UploadInput';
import { useNavigate, useParams } from 'react-router';
import API from "../../../api/axiosConfig";
import TestPreLoader from '../../../pages/TestPreLoader/TestPreLoader'


function EditEndowments() {


    const allowedTypes = ["عقار", "أرض", "سوق", "مزرعة"];
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);


    const [formData, setFormData] = useState({
        id: "",
        organization_id: "",
        account_id: "",
        name: "",
        description: "",
        number: "",
        date: "",
        ownership_type: "",
        ownership_source: "",
        type: "",
        type_details: "",
        type_note: "",
        remainedfees: "",
        totalfees: "",
        yearlyfees: "",
        yearlyincome: "",
        status: "",
        attachment: "",
        space: "",
        units_count: "",
        building_number: "",
        street_name: "",
        district_name: "",
        city: "",
        country: "",
        postal_code: "",
        address_coordinates: "",
        lat: "",
        lng: "",
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await API.get(`/endowments/${id}`);
                if (res.status === 200) {
                    setFormData(res.data);
                }
            } catch (error) {
                console.error("خطأ في جلب البيانات:", error);
            } finally {
                setLoading(false);
                
            }
        };
        fetchData();

    }, [id]);

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({
    //         ...prev,
    //         [name]: value
    //     }));
    // };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const mFormData = new FormData();
            mFormData.append("id", formData.id);
            mFormData.append("organization_id", formData.organization_id);
            mFormData.append("account_id", formData.account_id);
            mFormData.append("name", formData.name);
            mFormData.append("description", formData.description);
            mFormData.append("number", formData.number);
            mFormData.append("date", formData.date);
            mFormData.append("ownership_type", formData.ownership_type);
            mFormData.append("ownership_source", formData.ownership_source);
            mFormData.append("type", formData.type);
            mFormData.append("type_details", formData.type_details);
            mFormData.append("type_note", formData.type_note);
            mFormData.append("remainedfees", formData.remainedfees);
            mFormData.append("totalfees", formData.totalfees);
            mFormData.append("yearlyfees", formData.yearlyfees);
            mFormData.append("yearlyincome", formData.yearlyincome);
            mFormData.append("status", formData.status);
            mFormData.append("attachment", formData.attachment);
            mFormData.append("area", formData.area);
            mFormData.append("units_count", formData.units_count);
            mFormData.append("building_number", formData.building_number);
            mFormData.append("street_name", formData.street_name);
            mFormData.append("district_name", formData.district_name);
            mFormData.append("city", formData.city);
            mFormData.append("country", formData.country);
            mFormData.append("postal_code", formData.postal_code);
            mFormData.append("address_coordinates", formData.address_coordinates);
            mFormData.append("latitude", formData.latitude);
            mFormData.append("longitude", formData.longitude);
            mFormData.append("status", formData.status);

            const res = await API.post("/endowments/update", mFormData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 200) {
                navigate("/endowments");
            }
        } catch (error) {
            console.error("خطأ في التحديث:", error);
        }
    };




    const tabs = ['one', 'two', 'three'];
    const [activeTab, setActiveTab] = useState('one');

    const handleNext = () => {
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1]);
        }
    };

    const handleBack = () => {
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1]);
        }
    };


    const renderContent = () => {
        switch (activeTab) {
            case 'one':
                return (
                    <>
                        <div className="endowments">
                            <div className="endowmentsRow">
                                <RegisterTextbox
                                    parentStyle={{ width: "40%" }}
                                    label="إسم الوقف"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                />

                                <RegisterTextbox
                                    parentStyle={{ width: "40%" }}
                                    label="وصف الوقف"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                />
                            </div>

                            <div className="endowmentsRow">
                                <RegisterTextbox
                                    parentStyle={{ width: "40%" }}
                                    label="رقم الصك"
                                    type="number"
                                    stylee={{ width: "55%" }}
                                    value={formData.number}
                                    onChange={(e) =>
                                        setFormData({ ...formData, number: e.target.value })
                                    }
                                />

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "right",
                                        width: "40%",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <p style={{ marginBottom: "10px" }}>تاريخ انشاء الصك</p>
                                    <input
                                        type="date"
                                        name="date"
                                        className="custom-datepicker"
                                        style={{ width: "100%" }}
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData({ ...formData, date: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="endowmentsRow">
                                <RegisterTextbox
                                    parentStyle={{ width: "40%" }}
                                    label="طريقة التملك"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    value={formData.ownership_type}
                                    onChange={(e) =>
                                        setFormData({ ...formData, ownership_type: e.target.value })
                                    }
                                />

                                <RegisterTextbox
                                    parentStyle={{ width: "40%" }}
                                    label="جهة اصدار الوقف"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    value={formData.ownership_source}
                                    onChange={(e) =>
                                        setFormData({ ...formData, ownership_source: e.target.value })
                                    }
                                />
                            </div>

                            <div className="endowmentsRow">
                                <RegisterSelect
                                    label="نوع الوقف"
                                    stylee={{ width: "55% !important" }}
                                    parentStyle={{ width: "40%" }}
                                    options={[
                                        { value: "", label: "إختر النوع" },
                                        { value: "أرض", label: "أرض" },
                                        { value: "عقار", label: "عقار" },
                                        { value: "سيارة", label: "سيارة" },
                                        { value: "معدات", label: "معدات" },
                                        { value: "سوق", label: "سوق" },
                                        { value: "مزرعة", label: "مزرعة" },
                                        { value: "تقنيات الكترونية", label: "تقنيات الكترونية" },
                                        { value: "اخري", label: "اخري" },
                                    ]}
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData({ ...formData, type: e.target.value })
                                    }
                                />

                                <RegisterSelect
                                    label="الحساب الفرعي"
                                    stylee={{ width: "55% !important" }}
                                    parentStyle={{ width: "40%" }}
                                    options={[
                                        { value: "", label: "إختر النوع" },
                                        {
                                            value: "9e5000d7-6017-4785-b46c-8805d241d1c4",
                                            label: "استثمارات وقفية عقارية - اراضي",
                                        },
                                        {
                                            value: "9e5000d7-7c3d-4a2d-a45b-91dec8e85ad6",
                                            label: "اسثمارات وقفية عقارية - مباني",
                                        },
                                        {
                                            value: "9e5000d7-b02c-4e99-9e23-e030a7118503",
                                            label: " الأصول الثابتة الوقفية - أراضي",
                                        },
                                        {
                                            value: "9e5000d8-3cad-42e3-a5ef-7da2ad630e7a",
                                            label: " الأصول الثابتة الوقفية - مباني",
                                        },
                                        {
                                            value: "9e5000d8-7da3-4133-907d-3eecd5a07310",
                                            label: "الأصول الثابتة الوقفية - اللات و معدات",
                                        },
                                        {
                                            value: "9e5000d9-400c-4cb5-9eaa-5086c84af5e1",
                                            label: "الاصول غير الملموسة - اوقاف",
                                        },
                                        {
                                            value: "9e5000d9-6b43-4eda-a210-1bc075a5fe02",
                                            label: "اعمال رأسمالية تحت الانشاء",
                                        },
                                        {
                                            value: "9e5000d9-d772-47e2-977b-dc39597de56c",
                                            label: " الموجودات الحيوية - أوقاف.",
                                        },
                                    ]}
                                    value={formData.account_id}
                                    onChange={(e) =>
                                        setFormData({ ...formData, account_id: e.target.value })
                                    }
                                />

                                {formData.type === "اخري" && (
                                    <RegisterTextbox
                                        parentStyle={{ width: "40%" }}
                                        label="ادخل النوع"
                                        type="text"
                                        stylee={{ width: "55%" }}
                                        value={formData.customType || ""}
                                        onChange={(e) =>
                                            setFormData({ ...formData, customType: e.target.value })
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </>
                );


            case 'two':
                if (!allowedTypes.includes(formData.type)) {
                    return <p style={{ textAlign: "center", margin: "20px" }}>هذا التبويب غير متاح لهذا النوع</p>;
                }
                return (
                    
                    <>
                        <div className="endowments">
                            <div className="endowmentsRow">
                                <RegisterTextbox
                                    parentStyle={{ width: "40%" }}
                                    label="مساحة الوقف"
                                    type="number"
                                    stylee={{ width: "55%" }}
                                    value={formData.type_details.area || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, type_details: { ...formData.type_details, area : e.target.value }})
                                    }
                                />

                                <RegisterTextbox
                                    parentStyle={{ width: "40%" }}
                                    label="عدد الوحدات السكنية"
                                    type="number"
                                    stylee={{ width: "55%" }}
                                    value={formData.houseamount || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, houseamount : e.target.value })
                                    }
                                />
                            </div>

                            <div className="endowmentsRow">
                                <RegisterTextbox
                                    parentStyle={{ width: "40%" }}
                                    label="رقم المبني"
                                    type="number"
                                    stylee={{ width: "55%" }}
                                    value={formData.buildnumber || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData,buildnumber : e.target.value })
                                    }
                                />

                                <RegisterTextbox
                                    parentStyle={{ width: "40%" }}
                                    label="إسم الشارع"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    value={formData.streetname || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData,streetname : e.target.value })
                                    }
                                />
                            </div>

                            <div className="endowmentsRow">
                                <RegisterTextbox
                                    parentStyle={{ width: "40%" }}
                                    label="إسم الحي"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    value={formData.state || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, state: e.target.value })
                                    }
                                />

                                <RegisterTextbox
                                    parentStyle={{ width: "40%" }}
                                    label="المدينة"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    value={formData.city || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData,city : e.target.value })
                                    }
                                />
                            </div>

                            <div className="endowmentsRow">
                                <RegisterTextbox
                                    parentStyle={{ width: "40%" }}
                                    label="البلد"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    value={formData.country || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, country: e.target.value })
                                    }
                                />
                                <RegisterTextbox
                                    parentStyle={{ width: "40%" }}
                                    label="الرمز البريدي"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    value={formData.zipcode || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData,zipcode : e.target.value })
                                    }
                                />
                            </div>

                            <div className="endowmentsRow endowmentsRow2">
                                <RegisterTextbox
                                    parentStyle={{ width: "40%" }}
                                    label="احداثيات العنوان"
                                    type="text"
                                    stylee={{ width: "55%" }}
                                    value={formData.geolocation || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData,geolocation : e.target.value })
                                    }
                                />
                                <div className="locCon">
                                    <RegisterTextbox
                                        parentStyle={{ width: "40%" }}
                                        label="رأسي"
                                        type="text"
                                        stylee={{ width: "55%" }}
                                        prefix={<FontAwesomeIcon icon={faLocationDot} />}
                                        value={formData.latitude || ""}
                                        onChange={(e) =>
                                            setFormData({ ...formData,latitude : e.target.value })
                                        }
                                    />

                                    <RegisterTextbox
                                        parentStyle={{ width: "40%" }}
                                        label="افقي"
                                        type="text"
                                        stylee={{ width: "55%" }}
                                        prefix={<FontAwesomeIcon icon={faLocationDot} />}
                                        value={formData.longitude || ""}
                                        onChange={(e) =>
                                            setFormData({ ...formData,longitude : e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="endowmentsRow">
                                <RegisterSelect
                                    label="الحالة"
                                    stylee={{ width: "55% !important" }}
                                    parentStyle={{ width: "40%" }}
                                    options={[
                                        { value: "", label: "إختر الحالة" },
                                        { value: "مؤجر", label: "مؤجر" },
                                        { value: "غير مؤجر", label: "غير مؤجر" },
                                        { value: "تشغيل ذاتي", label: "تشغيل ذاتي" },
                                        { value: "قيد الإنشاء", label: "قيد الإنشاء" },
                                        { value: "الصيانة", label: "الصيانة" },
                                    ]}
                                    value={formData.status || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, status: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </>
                );


            case 'three':
                return (
                    <>
                        <div className='endowments'>

                            <div className='endowmentsRow'>
                                <RegisterSelect
                                    label="مسؤل الوقف"
                                    stylee={{
                                        width: "55% !important",
                                    }}
                                    parentStyle={{
                                        width: "40%",
                                    }}
                                    options={[
                                        { value: "", label: "إختر الحالة" },
                                        { value: "1", label: "مسؤل 1" },
                                        { value: "2", label: "مسؤل 2" },
                                    ]}
                                    value={formData.response}
                                    onChange={(e) =>
                                        setFormData({ ...formData,response : e.target.value })
                                    }
                                />

                                <RegisterTextbox
                                    parentStyle={{
                                        width: "40%",
                                    }}
                                    label="مصاريف الوقف"
                                    type="number"
                                    stylee={{
                                        width: "55%",
                                    }}
                                    value={formData.amount}
                                    onChange={(e) =>
                                        setFormData({ ...formData, amount: e.target.value })
                                    }
                                />
                                <div className='locCon'></div>
                            </div>

                            <div className='endowmentsRow'>
                                <RegisterTextbox
                                    parentStyle={{
                                        width: "40%",
                                    }}
                                    label="تكلفة التشغيل السنوية"
                                    type="number"
                                    stylee={{
                                        width: "55%",
                                    }}
                                    value={formData.yearlyfees}
                                    onChange={(e) =>
                                        setFormData({ ...formData, yearlyfees: e.target.value })
                                    }
                                />
                                <RegisterTextbox
                                    parentStyle={{
                                        width: "40%",
                                    }}
                                    label="الربح السنوي"
                                    type="number"
                                    stylee={{
                                        width: "55%",
                                    }}
                                    value={formData.yearlyincome}
                                    onChange={(e) =>
                                        setFormData({ ...formData, yearlyincome: e.target.value })
                                    }
                                />
                            </div>

                            <div className='endowmentsRow'>
                                <UploadInput
                                    parentStyle={{
                                        marginBottom: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                        width: "40%",
                                    }}
                                    label="مرفقات اخري"
                                    // onChange={(file) =>
                                    //     setFormData({ ...formData, : file })
                                    // }
                                />
                            </div>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };



    return (
        loading ? <TestPreLoader /> :
        <div className='createloan'>
            <Title
                title="تعديل وقف"
                icon={<FontAwesomeIcon icon={faPen} />}
            />
            <form onSubmit={handleSubmit}>
                <div className='divre'>
                    <div className='myTabs myTabs2 myTabs3'>
                        {tabs.map((tab, index) => (
                            <button
                                key={tab}
                                className={`loantab ${activeTab === tab ? 'active' : ''} loantab2`}
                                onClick={() => setActiveTab(tab)}
                                type="button"
                            >
                                {tab === 'one' ? '1' : tab === 'two' ? '2' : '3'}
                            </button>
                        ))}
                    </div>
                    <div className='line'></div>

                </div>
                <div className='tabContent'>{renderContent()}</div>

                <div className='navigationButtons'>

                    {activeTab !== 'three' ? (
                        <button className=' loanbtn nextButton' onClick={handleNext} disabled={tabs.indexOf(activeTab) === tabs.length - 1} type="button">
                            التالي
                        </button>
                    ) : (
                        <button type="submit" className=' loanbtn saveButton'>
                            حفظ
                        </button>
                    )}
                    {activeTab !== 'one' && (
                        <button className=' loanbtn backButton' onClick={handleBack} type="button">
                            السابق
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default EditEndowments;
