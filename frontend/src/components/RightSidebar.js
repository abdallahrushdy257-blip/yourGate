import React, { useState, useContext } from "react";
import { Navbar } from "react-bootstrap";
import Dropdown from "./Dropdown";
import {
  faCogs,
  faChartSimple,
  faLayerGroup,
  faRightFromBracket,
  faUser,
  faCaretRight,
  faCalculator,
  faShieldHalved,
  faDollar,
  faHandHoldingDollar,
  faDatabase,
  faLocationDot,
  faRocket,
  faBook,
  faGears,
  faReceipt,
  faScaleBalanced,
  faChildren,
  faUserPlus,
  faUserTag,
  faArrowTrendUp,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import DarkLightbutton from "./DarkLightbutton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";

const RightSidebar = ({ isVisible, toggleSidebar }) => {
  const [isUserMenuVisible, setUserMenuVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const permissions = user ? user.roles : [];

  // helper function to use permission
  const hasPermission = (permission, permissions) => {
    if (!permission) return true; // عنصر مش محتاج صلاحية
    return permissions.includes(permission);
  };

  const filterMenuByPermission = (menu, permissions) => {
    return menu
      .map((item) => {
        // لو عنده sub menu
        if (item.subChoices) {
          const allowedSubs = item.subChoices.filter((sub) =>
            hasPermission(sub.permission, permissions),
          );

          if (allowedSubs.length === 0) return null;

          return {
            ...item,
            subChoices: allowedSubs,
          };
        }

        // عنصر عادي
        return hasPermission(item.permission, permissions) ? item : null;
      })
      .filter(Boolean);
  };

  // const filterMenuByPermission = (menu, permissions = []) => {
  //   return menu
  //     .map(item => {
  //       // فلترة العناصر الفرعية
  //       if (item.children) {
  //         const filteredChildren = item.children.filter(child =>
  //           !child.permission || permissions.includes(child.permission)
  //         );

  //         // ❌ لو مفيش ولا child → نشيل الـ parent
  //         if (filteredChildren.length === 0) return null;

  //         return { ...item, children: filteredChildren };
  //       }

  //       // عناصر بدون children
  //       if (!item.permission || permissions.includes(item.permission)) {
  //         return item;
  //       }

  //       return null;
  //     })
  //     .filter(Boolean); // نشيل null
  // };

  const toggleUserMenu = () => {
    setUserMenuVisible((prev) => !prev);
  };

  const dropdownChoices1 = [
    // {
    //   label: "إنشاء حالة جديدة",
    //   route: "/createandmanege",
    //   permission: "shop_create",
    // },
    {
      label: "تقرير الحالات",
      route: "/casedetails",
      //  permission: "shop_view"
    },

    //{ label: "التصميمات", route: "/designsdetailsshop" , permission : "shopdetails_view" },
    //{ label: "عمليات الادارة", route: "/marketingdetailsshop" , permission : "shopdetails_view" },
  ];

  const dropdownChoices2 = [
    // {
    //   label: "إنشاء مشروع جديد",
    //   route: "/marketingdesignprojectmanagement",
    //   permission: "project_create",
    // },
    // { label: "إنشاء طلب تصميم", route: "/senddesignrequest" },`
    // { label: "إنشاء طلب تسويق", route: "/sendmarketingrequest" },
    {
      label: "التقارير",
      route: "/projectStatus",
      // permission: "project_view"
    },
    {
      label: "مؤشرات الاداء",
      route: "/kpi",
      // permission: "kpi_view"
    },
    //{ label: "التصميمات", route: "/designsdetails" , permission : "projectdetails_view" },
    //{ label: "عمليات الادارة", route: "/marketingdetails" , permission : "projectdetails_view" },
    {
      label: "تقرير المدفعات",
      route: "/projectpaymentreport",
      // permission: "projectpaymentreport_view",
    },
  ];

  const dropdownChoices3 = [
    {
      label: "المسمي الوظيفي",
      route: "/jobtitle",
      // permission: "jobtitle_create",
    },
    {
      label: "إدارة الموظفين",
      route: "/addnewemployee",
      // permission: "employee_create",
    },
    { route: "/SectionsReport", label: "الأقسام" },
    // {
    //   label: "مستندات الموظف",
    //   route: "/employpaper",
    //   // permission: "employeepapers_view",
    // },
    {
      label: "الإجازات",
      route: "/leavestype",
      // permission: "vacation_view"
    },
    {
      label: "طلب إجازة او اذن",
      route: "/vacationrequest",
      // permission: "vacationrequests_create",
    },
    //  {
    //   route: "/hrreport/emploteeVac",
    //   label: "اجازات الموظفين",
    // },
    { route: "/employeeWithdrawals", label: "مسحوبات الموظفين" },
    {
      label: "إدارة الحضور والانصراف",
      route: "/comeleave",
      // permission: "attendance_create",
    },
    { route: "/LatePoliciesPage", label: "قواعد التأخير والوقت الإضافي" },
    
    { route: "/employeeAdvance", label: "المسحوبات المجدولة" },
    {
      route: "/hrreport/discounts",
      label: "الخصومات والمكافآت",
    },
    {
      route: "/hrreport/investigations",
      label: "التحقيقات",
    },
    { route: "/payroll", label: "مسيرات الرواتب" },
    {
      label: "هيكل الشركة",
      route: "/organizationalChart",
      // permission: "organizationalchart_view",
    },
    
    {
      label: "إدارة المتطوعين",
      route: "/volunteers",
      // permission: "volunteer_create",
    },
    
    {
      label: "إدارة التقييمات",
      route: "/JobPerformanceEvaluation",
      // permission: "evaluation_create",
    },
    
    {
      label: " التدريب",
      route: "/employeetraining",
      // permission: "vacation_view",
    },
    {
      label: " المهارات و المعرفة",
      route: "/employeeksa",
      // permission: "vacation_view",
    },
    
    

   
    // {
    //   label: "التقارير",
    //   route: "/payroll",
    //   // permission: "employee_view",
    // },
  ];

  const dropdownChoices4 = [
    {
      category: "الحسابات",
      subChoices: [
        {
          label: "شجرة الحسابات",
          route: "/chartofaccounts",
          // permission: "accounttree_view",
        },
        {
          label: "القيد المحاسبي",
          route: "/accountingEntry",
          // permission: "generalvoucher_view",
        },
      ],
      icon: faReceipt,
    },
    // {
    //   category: "المشتريات",
    //   subChoices: [
    //     { label: "فاتورة المشتريات", route: "/purchaseInvoice" },
    //     { label: "فاتورة مردود المشتريات", route: "/purchaseRefundInvoice" },
    //     { label: "تقرير المشتريات", route: "/purchasesReport" },
    //     { label: "تقرير الموردون", route: "/supplierRreports" },
    //   ],
    // },
    // {
    //   category: "المبيعات",
    //   subChoices: [
    //     { label: "فاتورة المبيعات", route: "/salesInvoice" },
    //     { label: "فاتورة مردود المبيعات", route: "/salesRefundInvoice" },
    //     { label: "تقرير المبيعات", route: "/salesReport" },
    //     { label: "تقرير العملاء", route: "/customerReport" },
    //   ],
    // },

    // {
    //   category: "المخازن",
    //   subChoices: [
    //     { label: "المخازن", route: "/warehousereport" },
    //     { label: "الوحدات", route: "/unitsReport" },
    //     { label: "التصنيف", route: "/itemreport" },
    //     { label: "الاصناف", route: "/items" },
    //     { label: "تحويل بين مخازن", route: "/transferInvoiceBetweenStores" },
    //     { label: "جرد المخزون", route: "/storeinventory" },
    //     { label: "امر صرف", route: "/purecommand" },
    //     { label: "التسوية", route: "/settlementreport" },
    //     { label: "الاهلاك", route: "/depreciationreport" },
    //   ],
    // },
    {
      category: "الأموال",
      subChoices: [
        {
          label: " سند قبض نقدي",
          route: "/generalreceiptvouchercash",
          // permission: "generalvoucher_view",
        },
        // { label: "سند قبض عيني", route: "/generalreceiptvoucher" },
        {
          label: "سند صرف نقدي",
          route: "/generalpaymentvouchercash",
          // permission: "generalvoucher_view",
        },
        // { label: "سند صرف عيني", route: "/generalpaymentvoucher" },
        // { label: "قائمة الأسعار", route: "/pricelist" },
        {
          label: " كشف الحساب",
          route: "/accountstatement/accounts",
          // permission: "statement_view",
        },
      ],
      icon: faHandHoldingDollar,
    },
    {
      category: "القوائم المالية",
      subChoices: [
        {
          label: "الميزانبة العمومية",
          route: "/balancesheet",
          // permission: "generalbudget_view",
        },
        // { label: "قائمة الانشطة", route: "/incomestatement" , permission : "activitieslist_view" },
      ],
      icon: faScaleBalanced,
    },
  ];

  // const dropdownChoices5 = [
  //   { label: "الحوكمة", route: "/CommitmentCompliance" , permission : "" },
  // ];

  const dropdownChoices6 = [
    {
      category: "الكُفَلاءُ",
      subChoices: [
        // {
        //   label: "إضافة كفيل",
        //   route: "/addwarrantor",
        //   permission: "warrantor_create",
        // },
        {
          label: "تقرير الكُفَلاءُ",
          route: "/warrantors",
          // permission: "warrantor_view",
        },
        {
          label: "مدفوعات الكُفَلاءُ",
          route: "/warrantorsreport",
          // permission: "loan_view",
        },
      ],
      icon: faChildren,
    },
    // { label: "إنشاء قرض", route: "/createloan", permission: "loan_create" },
    { label: "بيانات القروض", route: "/loansData", permission: "loan_view" },
    {
      label: "بيانات التأخيرات",
      route: "/delaysdata",
      // permission: "loanpayment_view",
    },
    {
      label: "دراسة الجدوي للمشاريع",
      route: "/feasibility",
      // permission: "feasibilitystudies_view",
    },
  ];

  const dropdownChoices7 = [
    {
      category: "المانحون",
      subChoices: [
        {
          label: " اهتمام المانحون",
          route: "/interests",
          // permission: "interest_view",
        },
        // { label: "إضافة مانح", route: "/addDonor", permission: "donor_create" },
        { label: "المانحون", route: "/donors", 
          // permission: "donor_view"
         },
        {
          label: "تقرير مدفوعات المانحون",
          route: "/donationsReport",
          // permission: "donorpayment_view",
        },
      ],
      icon: faUserPlus,
    },
    {
      category: "الموردون",
      subChoices: [
        // {
        //   label: "إضافة مورد",
        //   route: "/addhcvendor",
        //   permission: "hcvendor_create",
        // },
        { label: "الموردون", route: "/hcvendor",
          //  permission: "hcvendor_view"
          },
        {
          label: "تقرير مدفوعات الموردين",
          route: "/hcvendorReport",
          // permission: "hcvendorpayment_view",
        },
      ],
      icon: faUserTag,
    },
    {
      category: "المستفيدون",
      subChoices: [
        // {
        //   label: "إضافة مستفيد",
        //   route: "/addBenef",
        //   permission: "humancase_create",
        // },
        {
          label: "المستفيدون",
          route: "/beneficiary",
          // permission: "humancase_view",
        },
        {
          label: "المستبعدون",
          route: "/beneficiaryx",
          // permission: "humancase_view",
        },
        {
          label: "تقرير مدفوعات المستفيدون",
          route: "/paymentReport",
          // permission: "shoptransactions_view",
        },
        {
          label: "إضافة رابط خارجي",
          route: "/createbeneficiarylink",
          // permission: "hcform_view",
        },
        {
          label: " استبيان رضا المستفيدين",
          route: "/employeesurvey",
          // permission: "employee_view",
        },
      ],
      icon: faArrowTrendUp,
    },
    {
      category: "أعضاء الجمعية",
      subChoices: [
        // {
        //   label: "إضافة عضو",
        //   route: "/associationMembers",
        //   permission: "assemblymembers_create",
        // },
        {
          label: "تقرير الأعضاء",
          route: "/associationMembersReport",
          // permission: "assemblymembers_view",
        },
        {
          label: "مدفوعات الأعضاء",
          route: "/associationMemberspaymentReport",
          // permission: "receiptorganization_view",
        },
        // {
        //   label: "تشكيل لجنة",
        //   route: "/addcommittee",
        //   permission: "associationcommittee_create",
        // },
        {
          label: "تقرير اللجان",
          route: "/committee",
          // permission: "associationcommittee_view",
        },
        // {
        //   label: "إضافة محضر",
        //   route: "/addMinutes",
        //   permission: "minutesheets_create",
        // },
        {
          label: "تقرير المحاضر",
          route: "/addMinutesReport",
          // permission: "minutesheets_view",
        },
      ],
      icon: faPeopleGroup,
    },
  ];

  const dropdownChoices8 = [
    // {
    //   label: "انشاء وقف",
    //   route: "/endowments",
    //   permission: "endowment_create",
    // },
    {
      label: "تقرير الأوقاف",
      route: "/endowmentsReport",
      // permission: "endowment_view",
    },
    {
      label: "مستحقات الدفعات",
      route: "/paymentsDue",
      // permission: "endowment_view",
    },
    {
      label: "تاريخ المدفوعات",
      route: "/paymentHistory",
      // permission: "endowment_view",
    },
  ];

  const dropdownChoices9 = [
    {
      label: "الأرشيف",
      route: "/archiveReport",
      //  permission: "archive_view"
    },
  ];

  const dropdownChoices10 = [
    // { label: "إضافة مهمة", route: "/addmission", permission: "mission_create" },
    {
      label: " المهام",
      route: "/missions",
      //  permission: "mission_view"
    },
    // { label: " مهام الموظفين", route: "/missionemployee" },
  ];

  const dropdownChoices15 = [
    {
      label: "الصلاحيات",
      route: "/roles",
      //  permission: "role_view"
    },
    {
      label: "المستخدمين",
      route: "/users",
      // permission: "user_view"
    },
  ];

  const dropdownChoices16 = [
    {
      label: "الإعدادات",
      route: "/setting/general",
      // permission: "setting_view",
    },
  ];

  const handleLogout = async () => {
    const res = API.post(
      "/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    //console.log(res);

    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar className={`right-sidebar ${isVisible ? "visible" : "hidden"}`}>
      <div className="side-head">
        <div className="closeSide">
          <button className="sidebar-close-btn" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faCaretRight} />{" "}
          </button>
        </div>
        <div className="infoSide">
          <div className="text">
            <h4>{user && user.user && user.user.name}</h4>
            <p>{user && user.user && user.user.email}</p>
          </div>
          <div className="side-imageCon" onClick={toggleUserMenu}>
            <img
              className="side-image"
              src={
                user && user.organization && user.organization.logo
                  ? user.organization.logo
                  : "../logo-dark.svg"
              }
              alt="pic"
            />
            {isUserMenuVisible && (
              <div className="user-dropdown">
                <ul>
                  <li>
                    {" "}
                    <FontAwesomeIcon icon={faUser} />{" "}
                    <a href="/profile">الملف الشخصي</a>{" "}
                  </li>
                  <li>
                    {" "}
                    <FontAwesomeIcon icon={faRightFromBracket} />{" "}
                    <button
                      onClick={handleLogout}
                      style={{ backgroundColor: "transparent", border: "none" }}
                    >
                      <span style={{ color: "#fff" }}>تسجيل الخروج</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="side-lists" id="scrollableDivNav">
        <Dropdown
          name="إدارة البيانات"
          choices={filterMenuByPermission(dropdownChoices7, permissions)}
          icon={faDatabase}
          isOpen={activeDropdown === "إدارة البيانات"}
          onToggle={() =>
            setActiveDropdown(
              activeDropdown === "إدارة البيانات" ? null : "إدارة البيانات",
            )
          }
        />
        <Dropdown
          name="إنشاء وإدارة"
          choices={filterMenuByPermission(dropdownChoices1, permissions)}
          icon={faCogs}
          isOpen={activeDropdown === "إنشاء وإدارة"}
          onToggle={() =>
            setActiveDropdown(
              activeDropdown === "إنشاء وإدارة" ? null : "إنشاء وإدارة",
            )
          }
        />
        <Dropdown
          name="إدارة المشاريع"
          choices={filterMenuByPermission(dropdownChoices2, permissions)}
          icon={faChartSimple}
          isOpen={activeDropdown === "إدارة المشاريع"}
          onToggle={() =>
            setActiveDropdown(
              activeDropdown === "إدارة المشاريع" ? null : "إدارة المشاريع",
            )
          }
        />
        <Dropdown
          name="الموارد البشرية"
          choices={filterMenuByPermission(dropdownChoices3, permissions)}
          icon={faLayerGroup}
          isOpen={activeDropdown === "الموارد البشرية"}
          onToggle={() =>
            setActiveDropdown(
              activeDropdown === "الموارد البشرية" ? null : "الموارد البشرية",
            )
          }
        />

        <Dropdown
          name="القروض والأقساط"
          choices={filterMenuByPermission(dropdownChoices6, permissions)}
          icon={faDollar}
          isOpen={activeDropdown === "القروض والأقساط"}
          onToggle={() =>
            setActiveDropdown(
              activeDropdown === "القروض والأقساط" ? null : "القروض والأقساط",
            )
          }
        />

        <Dropdown
          name="الأوقاف"
          choices={filterMenuByPermission(dropdownChoices8, permissions)}
          icon={faLocationDot}
          isOpen={activeDropdown === "الأوقاف"}
          onToggle={() =>
            setActiveDropdown(activeDropdown === "الأوقاف" ? null : "الأوقاف")
          }
        />
        <Dropdown
          name="الأرشيف"
          choices={filterMenuByPermission(dropdownChoices9, permissions)}
          icon={faBook}
          isOpen={activeDropdown === "الأرشيف"}
          onToggle={() =>
            setActiveDropdown(activeDropdown === "الأرشيف" ? null : "الأرشيف")
          }
        />
        <Dropdown
          name="إدارة المهام"
          choices={filterMenuByPermission(dropdownChoices10, permissions)}
          icon={faRocket}
          isOpen={activeDropdown === "ادارة المهام"}
          onToggle={() =>
            setActiveDropdown(
              activeDropdown === "ادارة المهام" ? null : "ادارة المهام",
            )
          }
        />

        <Dropdown
          name="المحاسبة المالية والقانونية"
          choices={filterMenuByPermission(dropdownChoices4, permissions)}
          icon={faCalculator}
          isOpen={activeDropdown === "المحاسبة المالية والقانونية"}
          onToggle={() =>
            setActiveDropdown(
              activeDropdown === "المحاسبة المالية والقانونية"
                ? null
                : "المحاسبة المالية والقانونية",
            )
          }
        />
        {/* <Dropdown
          name="الحوكمة"
          choices={dropdownChoices5}
          icon={faShieldHalved}
          isOpen={activeDropdown === "الحوكمة"}
          onToggle={() =>
            setActiveDropdown(
              activeDropdown === "الحوكمة" ? null : "الحوكمة"
            )
          }
        /> */}

        <Dropdown
          name="الأذونات والأدوار"
          choices={filterMenuByPermission(dropdownChoices15, permissions)}
          icon={faShieldHalved}
          isOpen={activeDropdown === "الأذونات والأدوار"}
          onToggle={() =>
            setActiveDropdown(
              activeDropdown === "الأذونات والأدوار"
                ? null
                : "الأذونات والأدوار",
            )
          }
        />

        <Dropdown
          name="الإعدادات"
          choices={filterMenuByPermission(dropdownChoices16, permissions)}
          icon={faGears}
          isOpen={activeDropdown === "الإعدادات"}
          onToggle={() =>
            setActiveDropdown(
              activeDropdown === "الإعدادات" ? null : "الإعدادات",
            )
          }
        />
      </div>
      
    </Navbar>
  );
};

export default RightSidebar;
