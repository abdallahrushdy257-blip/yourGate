import React, { useState } from 'react';
import './balanceSheet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';


function IncomeStatement() {
    const [isRevenueOpen, setIsRevenueOpen] = useState(true);
    const [isExpensesOpen, setIsExpensesOpen] = useState(true);

    return (
        <div className="balance-sheet-container">

            <p>جمعية (<span> </span>) الخيرية</p>
            <p>تحت اشراف المركز الوطني لتنمية القطاع غير الربحي</p>
            <p>مسجلة بالمركز الوطني لتنمية القطاع غير الربحي برقم</p>
            <p>قائمة الانشطة</p>
            <p>عن السنة المنتهية في (<span> </span>) (المبالغ بالريالات السعودية)</p> {/* Changed from كما في */}

            <div className="report-header">
                <h2>قائمة الانشطة</h2>
            </div>

            <div className="section">
                <h3 className="section-titleRepo" onClick={() => setIsRevenueOpen(!isRevenueOpen)}>
                    الايرادات
                    <span className={`arrow ${isRevenueOpen ? 'open' : ''}`}>
                        <FontAwesomeIcon icon={faArrowCircleDown} />
                    </span>
                </h3>
                {isRevenueOpen && (
                    <div className="section-contentRepo">
                        <div className="report-item"><span>التبرعات النقدية العامة</span><span>5</span></div>
                        <div className="report-item"><span>التبرعات النقدية المقيدة</span><span>5</span></div>
                        <div className="report-item"><span>تبرعات منصة احسان</span><span>5</span></div>
                        <div className="report-item"><span>التبرعات النقدية اوقاف</span><span>5</span></div>
                        <div className="report-item"><span>التبرعات العينية اصول اوقاف</span><span>5</span></div>
                        <div className="report-item"><span>اشتراكات اعضاء</span><span>5</span></div>
                        <div className="report-item"><span>تبرعات الزكاة</span><span>5</span></div>
                        <div className="report-item"><span>ايرادات الأنشطة</span><span>5</span></div>
                        <div className="report-item"><span>ايراد ايجارات</span><span>5</span></div>
                        <div className="report-item"><span>اعانات الوزارة</span><span>5</span></div>
                        <div className="report-item"><span>ارباح استثمار</span><span>5</span></div>
                        <div className="report-item"><span>ايرادات اخرى</span><span>5</span></div>
                        <div className="report-item"><span>ايجارات اوقاف</span><span>5</span></div>
                        <h5 className='repoSub'>صافي الاصول المحررة من القيود</h5>
                        <div className="report-item"><span>إعادة التصنيف لتحقق قيد الاستخدام</span><span>5</span></div>
                        <div className="total-section sub-total">
                            <div className="report-item"><span>إجمالي الإيرادات وإعادة التصنيف</span><span>5</span></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="section">
                <h3 className="section-titleRepo" onClick={() => setIsExpensesOpen(!isExpensesOpen)}>
                    المصروفات
                    <span className={`arrow ${isExpensesOpen ? 'open' : ''}`}>
                        <FontAwesomeIcon icon={faArrowCircleDown} />
                    </span>
                </h3>
                {isExpensesOpen && (
                    <div className="section-contentRepo">
                        <div className="report-item"><span>المساعدات النقدية</span><span>5</span></div>
                        <div className="report-item"><span>مصروفات جمع اموال</span><span>5</span></div>
                        <div className="report-item"><span>مصروفات الحوكمة</span><span>5</span></div>
                        <div className="report-item"><span>مصروفات محملة على النشاط</span><span>5</span></div>
                        <div className="report-item"><span>مساعدات الزكاة</span><span>5</span></div>
                        <div className="report-item"><span>مساعدات المنح الحكومي</span><span>5</span></div>
                        <div className="report-item"><span>مساعدات منصة إحسان</span><span>5</span></div>
                        <div className="report-item"><span>مصروفات الانشطة</span><span>5</span></div>
                        <div className="report-item"><span>مصروفات وعوائد اوقاف</span><span>5</span></div>
                        <div className="report-item"><span>مصروفات الاستثمار</span><span>5</span></div>
                        <div className="report-item"><span>المصروفات العمومية والإدارية</span><span>5</span></div>
                        <h5 className='repoSub'>اهلاك اصول الاوقاف</h5>
                        <div className="report-item"><span>اهلاك العقارات الاستثمارية</span><span>5</span></div>
                        <div className="report-item"><span>اهلاك الممتلكات والاثاث والمعدات</span><span>5</span></div>
                        <div className="report-item"><span>اطفاء الاصول الغير ملموسة</span><span>5</span></div>
                    
                        <div className="report-item"><span>إجمالي المصروفات والمساعدات</span><span>5</span></div>

                        <div className="report-item"><span>التغير في صافي الاصول من الانشطة المستمرة</span><span>5</span></div>
                        <h5 className='repoSub'>البنود الاستثنائية</h5>
                        <div className="report-item"><span>ارباح راسمالية</span><span>5</span></div>
                        <div className="report-item"><span>التغير في صافي الاصول من البنود</span><span>5</span></div>
                        <div className="report-item"><span>التغير في صافي الاصول</span><span>5</span></div>
                        <div className="report-item"><span>صافي الأصول بداية السنة</span><span>5</span></div>
                        <div className="report-item"><span>تسويات</span><span>5</span></div>

                        <div className="total-section"> {/* Final total styling */}
                            <div className="report-item"><span>صافي الأصول نهاية السنة</span><span>5</span></div>
                        </div>
                    </div>
                )}
            </div>


        </div>
    );
};

export default IncomeStatement;