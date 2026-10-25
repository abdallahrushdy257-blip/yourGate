import { useState } from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPercent,
    faPlus,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";
import RegisterTextbox from "./RegisterTextBox";
import KpiTextbox from "./KpiTextbox";
import RegisterSelect from "./RegisterSelect";
import CustomButton from "./CustomButton";
import RegisterRadio from "./Radio";

// كاش 0 
// آجل 1
function InvoiceBody() {
    const [discount, setDiscount] = useState({ value: "", percentage: "" });
    const [tax, setTax] = useState({ value: "", percentage: "" });
    const [finalTotal, setFinalTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("كاش");
    const [payment, setPayment] = useState(0);

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);

        if (method === "كاش") {
            setPayment(finalTotal || calculateTotal());
        } else if (method === "آجل") {
            setPayment(0);
        }
    };

    const handlePaymentChange = (value) => {
        if (paymentMethod === "آجل") {
            setPayment(value);
        }
    };
    const updateFinalTotal = (total, discountValue, taxValue) => {
        const final = total - (discountValue || 0) - (taxValue || 0);
        setFinalTotal(final.toFixed(2));
    };

    const handleDiscountChange = (field, value) => {
        const total = calculateTotal();
        let discountValue = 0;
        let discountPercentage = 0;

        if (value !== "") {
            if (field === "value") {
                discountValue = parseFloat(value);
                discountPercentage = ((discountValue / total) * 100).toFixed(2);
            } else {
                discountPercentage = parseFloat(value);
                discountValue = ((discountPercentage / 100) * total).toFixed(2);
            }
        }

        setDiscount({
            value: discountValue || "",
            percentage: discountPercentage || "",
        });
        updateFinalTotal(total, discountValue, tax.value || 0);
    };

    const handleTaxChange = (field, value) => {
        const total = calculateTotal();
        let taxValue = 0;
        let taxPercentage = 0;

        if (value !== "") {
            if (field === "value") {
                taxValue = parseFloat(value);
                taxPercentage = ((taxValue / total) * 100).toFixed(2);
            } else {
                taxPercentage = parseFloat(value);
                taxValue = ((taxPercentage / 100) * total).toFixed(2);
            }
        }

        setTax({ value: taxValue || "", percentage: taxPercentage || "" });
        updateFinalTotal(total, discount.value || 0, taxValue);
    };

    const [products] = useState([
        { code: "P1", name: "Product 1", price: 50 },
        { code: "P2", name: "Product 2", price: 100 },
        { code: "P3", name: "Product 3", price: 150 },
    ]);

    const [tableData, setTableData] = useState([
        {
            code: null,
            name: null,
            price: 0,
            quantity: "",
            total: 0,
            description: "",
        },
    ]);

    const findProduct = (value, field) => {
        return products.find((product) => product[field] === value);
    };

    const handleProductChange = (index, field, value) => {
        const updatedData = [...tableData];
        let selectedProduct = null;

        if (field === "code") {
            selectedProduct = findProduct(value?.value, "code");
        } else if (field === "name") {
            selectedProduct = findProduct(value?.value, "name");
        }

        updatedData[index] = {
            ...updatedData[index],
            code: { value: selectedProduct.code, label: selectedProduct.code },
            name: { value: selectedProduct.name, label: selectedProduct.name },
            price: selectedProduct.price,
        };

        const quantity = updatedData[index].quantity || 0;
        updatedData[index].total = quantity * selectedProduct.price;
        if (field === "quantity") {
            const quantity = value || 0;
            updatedData[index].total = quantity * updatedData[index].price;
        }

        setTableData(updatedData);
    };

    const handleInputChange = (index, field, value) => {
        const updatedData = [...tableData];
        updatedData[index] = {
            ...updatedData[index],
            [field]: value,
        };

        if (field === "quantity" && value !== "") {
            updatedData[index].total = value * updatedData[index].price;
        }

        setTableData(updatedData);
    };

    const handleAddRow = () => {
        setTableData([
            ...tableData,
            {
                code: null,
                name: null,
                price: 0,
                quantity: "",
                total: 0,
                description: "",
            },
        ]);
    };

    const customStyles = {
        menu: (provided) => ({
            ...provided,
            backgroundColor: "#ffff",
            borderRadius: "5px",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "#000"
                : state.isFocused
                    ? "#e0e0e0"
                    : "white",
            color: state.isSelected ? "#fff" : "#333",
        }),
        control: (provided) => ({
            ...provided,
            backgroundColor: "var(--card--background)",
            borderRadius: "5px",
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#000",
        }),
    };

    const handleClearRow = (index) => {
        const confirmClear = window.confirm("هل أنت متأكد أنك تريد مسح هذا السطر؟");
        if (confirmClear) {
            const updatedData = [...tableData];
            updatedData.splice(index, 1);
            setTableData(updatedData);
        }
    };

    const calculateTotal = () => {
        return tableData.reduce((sum, row) => sum + row.total, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault()
    }
    return (
        <Form className="salesinvoiceForm" onSubmit={handleSubmit}>
            <div className="fixedInfo">
                <div className="invoiceNum">
                    <label className="fixedInfoLable">رقم الفاتورة</label>
                    <input type="number" className="fixedInput" />

                    <div className="clientRadios clientRadios2">
                        <p>طريقة الدفع</p>
                        <RegisterRadio
                            label="كاش"
                            value="كاش"
                            checked={paymentMethod === "كاش"}
                            onChange={() => handlePaymentMethodChange("كاش")}
                        />
                        <RegisterRadio
                            label="آجل"
                            value="آجل"
                            checked={paymentMethod === "آجل"}
                            onChange={() => handlePaymentMethodChange("آجل")}
                        />
                    </div>
                </div>

                <div className="invoiceNum">
                    <label className="fixedInfoLable">التاريخ</label>
                    <input type="date" className="fixedDate fixedInput" />
                </div>

            </div>

            <div className="salesinvoiceInfo">
                <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="name"
                    label="إسم العميل"
                    type="text"
                    stylee={{ width: "100%" }}
                />
                <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="phoneNum"
                    label="رقم الجوال"
                    type="number"
                    stylee={{ width: "100%" }}
                />
                <RegisterTextbox
                    parentStyle={{ width: "30%" }}
                    id="address"
                    label="العنوان"
                    type="text"
                    stylee={{ width: "100%" }}
                />

            </div>

            <div className="salesinvoiceTable">
                <span onClick={handleAddRow} className="addrowInvoice">
                    <FontAwesomeIcon icon={faPlus} /> إضافة صنف
                </span>
                <div className="invoiceTableContainer">
                    <table className=" invoicetable">
                        <thead className="invoicetable-thead">
                            <tr>
                                <th>كود الصنف</th>
                                <th>إسم الصنف</th>
                                <th>السعر</th>
                                <th>الكمية</th>
                                <th>الإجمالي</th>
                                <th>الوصف</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="invoicetable-tbody">
                            {tableData.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <Select
                                            options={products.map((product) => ({
                                                value: product.code,
                                                label: product.code,
                                            }))}
                                            value={row.code}
                                            onChange={(selectedOption) =>
                                                handleProductChange(index, "code", selectedOption)
                                            }
                                            placeholder="اختر الكود"
                                            styles={customStyles}
                                            menuPortalTarget={document.body}
                                        />
                                    </td>
                                    <td>
                                        <Select
                                            options={products.map((product) => ({
                                                value: product.name,
                                                label: product.name,
                                            }))}
                                            value={row.name}
                                            onChange={(selectedOption) =>
                                                handleProductChange(index, "name", selectedOption)
                                            }
                                            placeholder="اختر الاسم"
                                            styles={customStyles}
                                            menuPortalTarget={document.body}
                                        />
                                    </td>
                                    <td>{row.price}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={row.quantity}
                                            className="amountinvoice"
                                            onChange={(e) =>
                                                handleInputChange(index, "quantity", e.target.value)
                                            }
                                        />
                                    </td>
                                    <td>{row.total}</td>
                                    <td>
                                        <KpiTextbox
                                            parentStyle={{
                                                marginBottom: "20px",
                                                margin: "auto",
                                            }}
                                            stylee={{
                                                height: "100px",
                                            }}
                                            rows={5}
                                            placeholder=""
                                            disabled={false}
                                            value={row.description}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            styleeParent={{
                                                width: "150px",
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <span
                                            className="clearRowBtn"
                                            onClick={() => handleClearRow(index)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="totalPrice">
                    <strong>
                        إجمالي الفاتورة قبل الخصم والضرائب: {calculateTotal()} ريال
                    </strong>
                </div>
            </div>

            <div className="chooseacount">
                <div className="chooseaccountrow">
                    <RegisterSelect
                        id="payAcc"
                        stylee={{
                            width: "45% !important",
                        }}
                        parentStyle={{
                            width: "35%",
                            marginBottom: "20px",
                        }}
                        label="إختيار حساب القبض"
                        options={[
                            { value: "", label: "إختر الحساب" },
                            { value: "582572", label: "582572" },
                        ]}
                    />
                    <RegisterTextbox
                        label="الخصم"
                        type="number"
                        value={discount.value}
                        onChange={(e) => handleDiscountChange("value", e.target.value)}
                    />
                    <RegisterTextbox
                        label="نسبة الخصم"
                        type="number"
                        value={discount.percentage}
                        onChange={(e) =>
                            handleDiscountChange("percentage", e.target.value)
                        }
                        prefix={<FontAwesomeIcon icon={faPercent} />}
                        stylee={{ width: "100%" }}
                        parentStyle={{ width: "20%", direction: "ltr" }}
                    />
                </div>

                <div className="chooseaccountrow">
                    <RegisterTextbox
                        parentStyle={{ width: "35%" }}
                        id="notes2"
                        label="ملاحظات"
                        type="text"
                        stylee={{ width: "100%" }}
                    />
                    <RegisterTextbox
                        label="الضرائب"
                        type="number"
                        value={tax.value}
                        onChange={(e) => handleTaxChange("value", e.target.value)}
                    />
                    <RegisterTextbox
                        label="نسبة الضرائب"
                        type="number"
                        value={tax.percentage}
                        onChange={(e) => handleTaxChange("percentage", e.target.value)}
                        prefix={<FontAwesomeIcon icon={faPercent} />}
                        stylee={{ width: "100%" }}
                        parentStyle={{ width: "20%", direction: "ltr" }}
                    />
                </div>

                <div className="chooseaccountrow">
                    <RegisterTextbox
                        parentStyle={{ width: "20%" }}
                        label="الإجمالي بعد الخصم والضرائب"
                        type="text"
                        value={finalTotal || calculateTotal()}
                        disabled={true}
                    />
                    <RegisterTextbox
                        parentStyle={{ width: "20%" }}
                        label="المدفوع"
                        type="number"
                        value={payment}
                        disabled={paymentMethod === "كاش"}
                        onChange={(e) => handlePaymentChange(e.target.value)}
                    />
                    <div className="signatureCon1">
                        <img
                            className="barCode"
                            src="https://i.pinimg.com/564x/5a/b4/fe/5ab4fec6fe13a25fb4649c2385245485.jpg"
                            alt="bar"
                        />
                    </div>
                </div>
                <div className="InvoiceButton">
                    <CustomButton text="إتمام" />
                </div>
            </div>
        </Form>
    )
}

export default InvoiceBody