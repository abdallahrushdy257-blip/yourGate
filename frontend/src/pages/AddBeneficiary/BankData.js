import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Title from '../../components/title'
import './addBeneficiary.css'
import { faBank } from '@fortawesome/free-solid-svg-icons'
import RegisterTextbox from '../../components/RegisterTextBox'
import CustomButton from '../../components/CustomButton'
import { Form, Spinner, Button, Row, Col } from 'react-bootstrap'
import { useNavigate , useParams } from 'react-router'
import UploadInput from '../../components/UploadInput'
import API from '../../api/axiosConfig'
import { useEffect, useState } from 'react'
function BankData(props) {
    const navigate = useNavigate();
    const params = useParams();
    const id = props?.id || params?.id;
    const [name , setName] = useState('');
    const [branch , setBranch] = useState('');
    const [iban , setIban] = useState('');
    const [upload , setUpload] = useState('');
    const [isSubmitting , setIsSubmitted] = useState(false);
    const [error , setError] = useState('');
    const [rows , setRows] = useState([]);


    const getBankDetails = async () => {
        try {
            const res = await API.get(`/humancasedetails/get/${id}`);
            const data = await res;
            if (data.status === 200) {
                setRows(data.data);
            }
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.errors);
        }
    }

    useEffect(() => {
        if (id) {
            getBankDetails();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        const formData = new FormData();
        formData.append('id' , id);
        formData.append('name' , rows.details && rows.details.bankdetails && rows.details.bankdetails.name ? rows.details.bankdetails.name : '');
        formData.append('branch' , rows.details && rows.details.bankdetails && rows.details.bankdetails.branch ? rows.details.bankdetails.branch : '');
        formData.append('iban' , rows.details && rows.details.bankdetails && rows.details.bankdetails.iban ? rows.details.bankdetails.iban : '');
        formData.append('upload' , upload);
        try {
            const res = await API.post(`/humancasedetails/update/banks` , formData , {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const data = await res;
            if (data.status === 200) {
                if (props?.onClose) {
                    props.onClose();
                } else {
                    navigate('/beneficiary');
                }
            }
        } catch (error) {
            console.error(error);
            setIsSubmitted(false);
            setError(error.response?.data?.errors);
        }
        
    };


    const formContent = (
        <Form onSubmit={handleSubmit} encType='multipart/form-data'>
            <Row>
                <Col md={6}>
                    <RegisterTextbox
                        id="bankName"
                        label="إسم البنك"
                        type="text"
                        name="bankName"
                        onChange={(e) => setRows({ ...rows, details: { ...(rows.details || {}), bankdetails: { ...(rows.details?.bankdetails || {}), name: e.target.value } } })} 
                        value={rows.details?.bankdetails?.name || ''}
                        error={error?.name}
                    />
                </Col>
                <Col md={6}>
                    <RegisterTextbox
                        id="branch"
                        label="الفرع"
                        type="text"
                        name="branch"
                        value={rows.details?.bankdetails?.branch || ''}
                        onChange={(e) => setRows({ ...rows, details: { ...(rows.details || {}), bankdetails: { ...(rows.details?.bankdetails || {}), branch: e.target.value } } })}
                        error={error?.branch}
                    />
                </Col>
            </Row>

            <Row className="mt-3">
                <Col md={6}>
                    <RegisterTextbox
                        id="ibanNum"
                        label="رقم IBAN"
                        type="text"
                        name="iban"
                        value={rows.details?.bankdetails?.iban || ''}
                        onChange={(e) => setRows({ ...rows, details: { ...(rows.details || {}), bankdetails: { ...(rows.details?.bankdetails || {}), iban: e.target.value } } })}
                        error={error?.iban}
                    />
                </Col>
                <Col md={6}>
                    <UploadInput
                        id="chieftain"
                        label="صورة رقم IBAN"
                        defaultUrl={rows?.details?.bankdetails_upload || rows?.details?.bankdetails?.upload}
                        onChange={(e) => setUpload(e.target.files[0])}
                        name="upload"
                    />
                </Col>
            </Row>

            <div
                className="modal-footer-custom mt-4 pt-3"
                style={{
                    borderTop: "1px solid var(--border-color, #eee)",
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "12px",
                    direction: "rtl",
                }}
            >
                {isSubmitting ? (
                    <Button
                        variant="primary"
                        disabled
                        style={{
                            backgroundColor: "var(--primary-color, #c29a64)",
                            borderColor: "var(--primary-color, #c29a64)",
                            borderRadius: "22px",
                            padding: "8px 30px",
                            fontWeight: "600",
                            minWidth: "100px",
                        }}
                    >
                        <Spinner animation="border" size="sm" />
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        type="submit"
                        style={{
                            backgroundColor: "var(--primary-color, #c29a64)",
                            borderColor: "var(--primary-color, #c29a64)",
                            borderRadius: "22px",
                            padding: "8px 30px",
                            fontWeight: "600",
                            minWidth: "100px",
                        }}
                    >
                        حفظ
                    </Button>
                )}
                {props?.onClose && (
                    <Button
                        variant="secondary"
                        onClick={props.onClose}
                        type="button"
                        style={{
                            borderRadius: "22px",
                            padding: "8px 24px",
                            fontWeight: "600",
                            backgroundColor: "transparent",
                            color: "var(--text-color, #666)",
                            border: "1.5px solid var(--border-color, #ccc)",
                        }}
                    >
                        إغلاق
                    </Button>
                )}
            </div>
        </Form>
    );

    if (props?.isModal) {
        return formContent;
    }

    return (
        <div className='AddBeneficiary'>
            <Title
                title="البيانات البنكية"
                icon={<FontAwesomeIcon icon={faBank} />}
            />
            <div className="global-form-container" style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
                {formContent}
            </div>
        </div>
    );
}

export default BankData;