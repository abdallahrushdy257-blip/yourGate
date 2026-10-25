import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import './ReviewData.css';
import RegisterTextbox from "../../components/RegisterTextBox";

function ReviewData() {
    const location = useLocation();

    const { representativeName, representativeEmail, representativePhone, representativeAddress, password, confirmPassword } = location.state || {};

    const [countdown, setCountdown] = useState(60);
    const [isCounting, setIsCounting] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);

    const [name, setName] = useState(representativeName || '');
    const [email, setEmail] = useState(representativeEmail || '');
    const [phone, setPhone] = useState(representativePhone || '');
    const [address, setAddress] = useState(representativeAddress || '');
    const [passwordValue, setPasswordValue] = useState(password || '');
    const [confirmPasswordValue, setConfirmPasswordValue] = useState(confirmPassword || '');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleResendCode = () => {
        const phoneNumberLength = phone.replace(/[^0-9]/g, '').length;
        if (phoneNumberLength !== 9) {
            setPhoneError('رقم الجوال يجب أن يتكون من 9 أرقام فقط');
            return;
        }

        setPhoneError('');

        if (passwordValue.length < 8) {
            setPasswordError('كلمة السر يجب أن تكون 8 أحرف على الأقل');
            return;
        }

        if (passwordValue !== confirmPasswordValue) {
            setPasswordError('كلمة السر وتأكيد كلمة السر يجب أن تكون متطابقة');
            return;
        }

        setPasswordError('');

        if (!validateEmail(email)) {
            setEmailError('البريد الإلكتروني غير صالح');
            return;
        }

        setEmailError('');

        if (!isCounting) {
            setIsCounting(true);
            setCountdown(60);
            const intervalId = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalId);
                        setIsCounting(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    const handleModifyData = () => {
        setIsDisabled(false);
    };

    return (
        <>
            <div className="review-form-conatiner">
                <h1 className="review-title">
                    مراجعة البيانات العامة
                </h1>
                <Form>
                    <Form.Group className="mb-3 text-left-important">
                        <Form.Label className="review-label">اسم ممثل الجمعية</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isDisabled}
                            className="review-textbox"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 text-left-important">
                        <Form.Label className="review-label">البريد الالكتروني لممثل الجمعية</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isDisabled}
                            className="review-textbox"
                        />
                    </Form.Group>

                    {emailError && <div style={{ color: 'red', fontSize: '12px' }}>{emailError}</div>}

                    <Form.Group className="mb-3 text-left-important">
                        <RegisterTextbox
                            type="text"
                            id="representativePhone"
                            label="رقم جوال ممثل الجمعية"
                            disabled={isDisabled}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="review-textbox"
                            prefix="+966"
                            align='left'
                        />
                    </Form.Group>

                    {phoneError && <div style={{ color: 'red', fontSize: '12px' }}>{phoneError}</div>}

                    <Form.Group className="mb-3 text-left-important">
                        <Form.Label className="review-label">عنوان ممثل الجمعية</Form.Label>
                        <Form.Control
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled={isDisabled}
                            className="review-textbox"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 text-left-important">
                        <Form.Label className="review-label">كلمة السر</Form.Label>
                        <Form.Control
                            type="password"
                            value={passwordValue}
                            onChange={(e) => setPasswordValue(e.target.value)}
                            disabled={isDisabled}
                            className="review-textbox"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 text-left-important">
                        <Form.Label className="review-label">تأكيد كلمة السر</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPasswordValue}
                            onChange={(e) => setConfirmPasswordValue(e.target.value)}
                            disabled={isDisabled}
                            className="review-textbox"
                        />
                    </Form.Group>

                    {passwordError && <div style={{ color: 'red', fontSize: '12px' }}>{passwordError}</div>}

                    <Button variant="primary" className="review-button" id="review-button2" onClick={handleModifyData}>
                        تعديل البيانات
                    </Button>

                    <Button
                        variant="primary"
                        className="review-button"
                        onClick={handleResendCode}
                        disabled={isCounting}
                    >
                        {isCounting ? `انتظر ${countdown} ثانية` : "إرسال رسالة تأكيد"}
                    </Button>

                    {isCounting && (
                        <div className="countdown-text">
                            إعادة الإرسال خلال {countdown} ثانية
                        </div>
                    )}
                </Form>
            </div>
        </>
    );
}

export default ReviewData;
