import React, { useEffect, useState } from 'react';
import { useParams , Link } from 'react-router-dom';
import API from '../../../api/axiosConfig';
import "./PrintPurchase.css"; // Assuming you have some CSS for styling
import TestPreLoader from '../../TestPreLoader/TestPreLoader';

const PrintPurchase = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.post(`warehouse/transaction/details` , {'id': id}).then((res) => {
      setInvoice(res.data);
      setLoading(false);
      //window.print(); // auto trigger print dialog
    });
  }, [id]);

  

  return  (
    loading ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <TestPreLoader />
      </div>
    ) : (
      <>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
      <button onClick={() => window.print()} style={{ marginBottom: '20px' }} className='print-disabled btn btn-primary'>
      طباعة الفاتورة
    </button>
    <Link to="/purchaseInvoice" className='btn btn-primary' style={{ marginBottom: '20px' }}>
      العودة الى فاتورةالمشتريات
    </Link>
    </div>
    <div className="receipt" style={{ width: '300px', fontFamily: 'monospace' , margin: '0 auto', borderRadius: '10px'}}>
    <div >
      <h2 style={{ textAlign: 'center'  }}>{invoice && invoice[0].orgname}</h2>
      <p style={{ direction: 'rtl' , marginRight: '20px' }}>التاريخ: {invoice && new Date(invoice[0].date).toLocaleString()}</p>
      <p style={{ direction: 'rtl' , marginRight: '20px' }}>رقم الفاتورة: {invoice && invoice[0].invoice}</p>
      <hr />
      </div>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th align="left">المنتج</th>
            <th align="right">السعر</th>
            <th align="right">اجمالي</th>
          </tr>
        </thead>
        <tbody>
          {invoice.map((product, idx) => (
            <tr key={idx}>
              <td>{product.name} x {product.quantity}</td>
              <td align="right">{parseFloat(product.purchase).toFixed(2)}</td>
              <td align="right">{parseFloat(product.itemtotal).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
         
          <tr>
            <td align="right">{parseFloat(invoice[0].tax).toFixed(2)}</td>
            <td colSpan="2" align="right">الضريبه</td>
          </tr>
          <tr>
            <td align="right">{parseFloat(invoice[0].discountmoney).toFixed(2) || '0'}</td>
            <td colSpan="2" align="right">الخصم</td>
          </tr>
          <tr>
            <td align="right">{parseFloat(invoice[0].total).toFixed(2)}</td>
            <td colSpan="2" align="right">اجمالى بعد الضريبه</td>
          </tr>
          </tfoot>
      </table>

      <hr />
     

      <p style={{ textAlign: 'center' }}>سعداء بزيارتكم</p>
    </div>
    </>
  ));
};

export default PrintPurchase;