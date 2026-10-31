import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Title from '../../../components/title';
import './DelaysData.css'
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import CustomTable from '../../../components/CustomTable';
import { useState } from 'react';
import TableComponent from '../../../components/TableComponent';
function DelaysData() {
    const columns = [
        { name: "رقم القرض", key: "loannumber" },
        { name: "إسم العضو", key: "membername" },
        { name: "المبلغ المستحق", key: "amount" },
        { name: "نوع القرض", key: "loantype" },
        { name: "مدة التأخير", key: "delayduration" },
        { name: "تاريخ الاستحقاق", key: "duedate" },
        { name: "", key: "actions" },
    ];






    const dropdownOptions = [
        { label: "عرض التبرعات", route: "/viewdonations" },
    ];


    return (
        <>
            <Title
                title="بيانات التأخيرات"
                icon={<FontAwesomeIcon icon={faBagShopping} />}
            />
            <div className='delaydata'>
                {/* <CustomTable
                columns={columns}
                data={rows}
                onDownload={handleDownload}
                dropdownOptions={dropdownOptions}
            /> */}
                <TableComponent
                    apiUrl={"/loans/payment"}
                    columns={columns}
                    dropdownOptions={dropdownOptions}
                    searchDate={false}
                />
            </div>
        </>
    )
}


export default DelaysData