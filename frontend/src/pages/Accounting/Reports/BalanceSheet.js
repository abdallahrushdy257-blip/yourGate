import React, { useState , useEffect } from 'react';
import './balanceSheet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';
import API from '../../../api/axiosConfig';

function BalanceSheet() {
    const [isAssetsOpen, setIsAssetsOpen] = useState(false);
    const [isLiabilitiesOpen, setIsLiabilitiesOpen] = useState(false);
    const [rows , setRows] = useState([]);
    const [error , setError] = useState([]);
    const [info , setInfo] = useState([]);
    const getBalanceSheet = async () => {
        try {
            const response = await API.get(`/generalbudget`);
            const data = await response;
            setRows(data.data);
        } catch (error) {
            console.log(error);
            setError(error.response.data.errors);
        }
    }
    const getInfo = async () => {
        try {
            const response = await API.get(`/user`);
            const data = await response;
            setInfo(data.data);
        } catch (error) {
            console.log(error);
            setError(error.response.data.errors);
        }
    }
    useEffect(() => {
        getBalanceSheet();
        getInfo();
    },[]);
    return (
        <div className="balance-sheet-container">

                <p>جمعية (<span>{info ? info.organization?.name : 'no name'} </span>) الخيرية</p>
                <p>تحت اشراف المركز الوطني لتنمية القطاع غير الربحي</p>
                <p>مسجلة بالمركز الوطني لتنمية القطاع غير الربحي برقم</p>
                <p>قائمة المركز المالي</p>
                <p>كما في (<span> </span>) (المبالغ بالريالات السعودية)</p>
            <div className="report-header">
                <h2>قائمة المركز المالي</h2>
            </div>


            <div className="section">
                <h3 className="section-titleRepo" onClick={() => setIsAssetsOpen(!isAssetsOpen)}>
                    الأصول
                    <span className={`arrow ${isAssetsOpen ? 'open' : ''}`}>
                        <FontAwesomeIcon icon={faArrowCircleDown} />
                    </span>
                </h3>
                {isAssetsOpen && (
                    <div className="section-contentRepo">
                        <h5 className='repoSub'>الأصول المتداولة</h5>
                        <div className="report-item"><span>النقد وما في حكمه</span><span>{rows && rows.debt && rows.credit && (rows.debt.cash - rows.credit.cash)}</span></div>
                        <div className="report-item"><span>أرصدة مدينة أخرى</span><span>{rows && rows.debt && rows.credit && (rows.debt.other_debt_account - rows.credit.other_debt_account)}</span></div>
                        <div className="report-item"><span>مجموع الأصول المتداولة</span><span>{rows && rows.debt && rows.credit && (rows.debt.cash - rows.credit.cash + rows.debt.other_debt_account - rows.credit.other_debt_account)}</span></div>

                        <h5 className='repoSub'>أصول الأوقاف - بالصافي</h5>
                        <div className="report-item"><span>أصول الأوقاف</span><span>{rows && rows.debt && rows.credit && (rows.debt.endowments - rows.credit.endowments)}</span></div>
                       
                        <div className="report-item"><span>مجموع أصول الأوقاف</span><span>{rows && rows.debt && rows.credit && (rows.debt.endowments - rows.credit.endowments )}</span></div>

                        <h5 className='repoSub'>الأصول غير المتداولة</h5>
                        <div className="report-item"><span>مشروعات تحت التنفيذ</span><span>{rows && rows.debt && rows.credit && (rows.debt.projects_under_progress - rows.credit.projects_under_progress)}</span></div>
                        <div className="report-item"><span>العقارات الاستثمارية - بالتكلفة</span><span>{rows && rows.debt && rows.credit && (rows.debt.investments - rows.credit.investments)}</span></div>
                        <div className="report-item"><span>الأصول الغير ملموسة - بالصافي</span><span>{rows && rows.debt && rows.credit && (rows.debt.intangible_assets - rows.credit.intangible_assets)}</span></div>
                        <div className="report-item"><span>مجموع الأصول غير المتداولة</span><span>{(rows && rows.debt && rows.credit && (rows.debt.projects_under_progress - rows.credit.projects_under_progress) + (rows && rows.debt && rows.credit && (rows.debt.investments - rows.credit.investments) + (rows && rows.debt && rows.credit && (rows.debt.intangible_assets - rows.credit.intangible_assets))))}</span></div>

                        <div className="total-section">
                            <div className="report-item"><span>إجمالي الأصول</span><span>{
                                (rows && rows.debt && rows.credit && (rows.debt.cash - rows.credit.cash + rows.debt.other_debt_account - rows.credit.other_debt_account)) + (rows && rows.debt && rows.credit && (rows.debt.endowments - rows.credit.endowments )) + ((rows && rows.debt && rows.credit && (rows.debt.projects_under_progress - rows.credit.projects_under_progress) + (rows && rows.debt && rows.credit && (rows.debt.investments - rows.credit.investments) + (rows && rows.debt && rows.credit && (rows.debt.intangible_assets - rows.credit.intangible_assets)))))
                                }</span></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="section">
                <h3 className="section-titleRepo" onClick={() => setIsLiabilitiesOpen(!isLiabilitiesOpen)}>
                    الالتزامات وصافي الأصول
                    <span className={`arrow ${isLiabilitiesOpen ? 'open' : ''}`}>
                        <FontAwesomeIcon icon={faArrowCircleDown} />
                    </span>
                </h3>
                {isLiabilitiesOpen && (
                    <div className="section-contentRepo">
                        <h5 className='repoSub'>الالتزامات المتداولة</h5>
                        <div className="report-item"><span>القروض قصيرة الأجل</span><span>{rows && rows.debt && rows.credit && (rows.debt.shortterm_loans - rows.credit.shortterm_loans)}</span></div>
                        <div className="report-item"><span>أوراق الدفع  </span><span>{rows && rows.debt && rows.credit && (rows.debt.payment_papers - rows.credit.payment_papers)}</span></div>
                        <div className="report-item"><span>   الذمم الدائنة </span><span>{rows && rows.debt && rows.credit && (rows.debt.accounts_payable - rows.credit.accounts_payable)}</span></div>
                        <div className="report-item"><span>  مصروفات مستحقة </span><span>{rows && rows.debt && rows.credit && (rows.debt.due_expenses - rows.credit.due_expenses)}</span></div>
                        <div className="report-item"><span>   ايرادات وتبرعات مقدمة </span><span>{rows && rows.debt && rows.credit && (rows.debt.revenue_and_donations_provided - rows.credit.revenue_and_donations_provided)}</span></div>
                        <div className="report-item"><span> التزامات متداولة أخرى  </span><span>{rows && rows.debt && rows.credit && (rows.debt.other_current_obligations- rows.credit.other_current_obligations)}</span></div>
                        <div className="report-item"><span>مجموع الالتزامات المتداولة</span><span>{(rows && rows.debt && rows.credit && (rows.debt.shortterm_loans - rows.credit.shortterm_loans)) + (rows && rows.debt && rows.credit && (rows.debt.payment_papers - rows.credit.payment_papers)) + (rows && rows.debt && rows.credit && (rows.debt.accounts_payable - rows.credit.accounts_payable)) + (rows && rows.debt && rows.credit && (rows.debt.due_expenses - rows.credit.due_expenses)) + (rows && rows.debt && rows.credit && (rows.debt.revenue_and_donations_provided - rows.credit.revenue_and_donations_provided)) + (rows && rows.debt && rows.credit && (rows.debt.other_current_obligations- rows.credit.other_current_obligations))}</span></div>

                        <h5 className='repoSub'>الالتزامات غير المتداولة</h5>
                        <div className="report-item"><span> قروض طويلة الاجل  </span><span>{rows && rows.debt && rows.credit && (rows.debt.longterm_loans ?? 0 - rows.credit.longterm_loans ?? 0)}</span></div>
                        <div className="report-item"><span>   اوراق دفع طويلة الاجل </span><span>{rows && rows.debt && rows.credit && (rows.debt.longterm_payment_notes - rows.credit.longterm_payment_notes)}</span></div>
                        <div className="report-item"><span>  المخصصات </span><span>{rows && rows.debt && rows.credit && (rows.debt.allocations - rows.credit.allocations)}</span></div>
                        <div className="report-item"><span>  مجمعات الاهلاك و الاستنفاد </span><span>{rows && rows.debt && rows.credit && (rows.debt.depreciation_and_exhaustion_accumulations - rows.credit.depreciation_and_exhaustion_accumulations)}</span></div>
                        <div className="report-item"><span>  المخصصات للاصول الوقفية </span><span>{rows && rows.debt && rows.credit && (rows.debt.allocations_for_endowment_assets - rows.credit.allocations_for_endowment_assets)}</span></div>
                        <div className="report-item"><span> مجمعات الإهلاك والاستنفاذ للأصول الوقفية  </span><span>{rows && rows.debt && rows.credit && (rows.debt.depreciation_and_exhaustion_pools_for_endowment_assets - rows.credit.depreciation_and_exhaustion_pools_for_endowment_assets)}</span></div>
                        <div className="report-item"><span>مجموع الالتزامات غير المتداولة</span><span>{(rows && rows.debt && rows.credit && (rows.debt.longterm_loans - rows.credit.longterm_loans)) + (rows && rows.debt && rows.credit && (rows.debt.longterm_payment_notes - rows.credit.longterm_payment_notes)) + (rows && rows.debt && rows.credit && (rows.debt.allocations - rows.credit.allocations)) + (rows && rows.debt && rows.credit && (rows.debt.depreciation_and_exhaustion_accumulations - rows.credit.depreciation_and_exhaustion_accumulations)) + (rows && rows.debt && rows.credit && (rows.debt.allocations_for_endowment_assets - rows.credit.allocations_for_endowment_assets)) +(rows && rows.debt && rows.credit && (rows.debt.depreciation_and_exhaustion_pools_for_endowment_assets - rows.credit.depreciation_and_exhaustion_pools_for_endowment_assets))}</span></div>

                        <div className="total-section sub-total">
                            <div className="report-item"><span>مجموع الالتزامات</span><span>{(rows && rows.debt && rows.credit && (rows.debt.shortterm_loans - rows.credit.shortterm_loans)) + (rows && rows.debt && rows.credit && (rows.debt.payment_papers - rows.credit.payment_papers)) + (rows && rows.debt && rows.credit && (rows.debt.accounts_payable - rows.credit.accounts_payable)) + (rows && rows.debt && rows.credit && (rows.debt.due_expenses - rows.credit.due_expenses)) + (rows && rows.debt && rows.credit && (rows.debt.revenue_and_donations_provided - rows.credit.revenue_and_donations_provided)) + (rows && rows.debt && rows.credit && (rows.debt.other_current_obligations- rows.credit.other_current_obligations)) + rows && rows.debt && rows.credit && (rows.debt.depreciation_and_exhaustion_pools_for_endowment_assets - rows.credit.depreciation_and_exhaustion_pools_for_endowment_assets)}</span></div>
                        <div className="report-item"><span>مجموع الالتزامات غير المتداولة</span><span>{(rows && rows.debt && rows.credit && (rows.debt.longterm_loans - rows.credit.longterm_loans)) + (rows && rows.debt && rows.credit && (rows.debt.longterm_payment_notes - rows.credit.longterm_payment_notes)) + (rows && rows.debt && rows.credit && (rows.debt.allocations - rows.credit.allocations)) + (rows && rows.debt && rows.credit && (rows.debt.depreciation_and_exhaustion_accumulations - rows.credit.depreciation_and_exhaustion_accumulations)) + (rows && rows.debt && rows.credit && (rows.debt.allocations_for_endowment_assets - rows.credit.allocations_for_endowment_assets)) +(rows && rows.debt && rows.credit && (rows.debt.depreciation_and_exhaustion_pools_for_endowment_assets - rows.credit.depreciation_and_exhaustion_pools_for_endowment_assets))}</span></div>
                        </div>

                        <h5 className='repoSub'>صافي الأصول</h5>
                        <div className="report-item"><span>صافي الأصول غير المقيدة</span><span>{rows && rows.debt && rows.credit && (rows.debt.net_unrestricted_assets - rows.credit.net_unrestricted_assets)}</span></div>
                        <div className="report-item"><span>صافي الأصول المقيدة</span><span>{rows && rows.debt && rows.credit && (rows.debt.net_restricted_assets - rows.credit.net_restricted_assets)}</span></div>
                        <div className="report-item"><span>صافي أصول الأوقاف</span><span>{rows && rows.debt && rows.credit && (rows.debt.net_assets_of_endowments - rows.credit.net_assets_of_endowments)}</span></div>
                        <div className="report-item"><span>مجموع صافي الأصول</span><span>{(rows && rows.debt && rows.credit && (rows.debt.net_unrestricted_assets - rows.credit.net_unrestricted_assets)) + (rows && rows.debt && rows.credit && (rows.debt.net_restricted_assets - rows.credit.net_restricted_assets)) + (rows && rows.debt && rows.credit && (rows.debt.net_assets_of_endowments - rows.credit.net_assets_of_endowments))}</span></div>

                        <div className="total-section">
                            <div className="report-item"><span>إجمالي الالتزامات وصافي الأصول</span><span>{ (rows && rows.debt && rows.credit && (rows.debt.shortterm_loans - rows.credit.shortterm_loans)) + (rows && rows.debt && rows.credit && (rows.debt.payment_papers - rows.credit.payment_papers)) + (rows && rows.debt && rows.credit && (rows.debt.accounts_payable - rows.credit.accounts_payable)) + (rows && rows.debt && rows.credit && (rows.debt.due_expenses - rows.credit.due_expenses)) + (rows && rows.debt && rows.credit && (rows.debt.revenue_and_donations_provided - rows.credit.revenue_and_donations_provided)) + (rows && rows.debt && rows.credit && (rows.debt.other_current_obligations- rows.credit.other_current_obligations)) + (rows && rows.debt && rows.credit && (rows.debt.longterm_loans - rows.credit.longterm_loans)) + (rows && rows.debt && rows.credit && (rows.debt.longterm_payment_notes - rows.credit.longterm_payment_notes)) + (rows && rows.debt && rows.credit && (rows.debt.allocations - rows.credit.allocations)) + (rows && rows.debt && rows.credit && (rows.debt.depreciation_and_exhaustion_accumulations - rows.credit.depreciation_and_exhaustion_accumulations)) + (rows && rows.debt && rows.credit && (rows.debt.allocations_for_endowment_assets - rows.credit.allocations_for_endowment_assets)) +(rows && rows.debt && rows.credit && (rows.debt.depreciation_and_exhaustion_pools_for_endowment_assets - rows.credit.depreciation_and_exhaustion_pools_for_endowment_assets)) + (rows && rows.debt && rows.credit && (rows.debt.net_unrestricted_assets - rows.credit.net_unrestricted_assets)) + (rows && rows.debt && rows.credit && (rows.debt.net_restricted_assets - rows.credit.net_restricted_assets)) + (rows && rows.debt && rows.credit && (rows.debt.net_assets_of_endowments - rows.credit.net_assets_of_endowments))}</span></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BalanceSheet;
