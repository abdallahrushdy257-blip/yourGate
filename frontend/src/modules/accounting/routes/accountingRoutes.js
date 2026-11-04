import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../common/pages/TestPreLoader/TestPreLoader";

// ── شجرة الحسابات والقيود والتقارير المالية ───────────────────
const ChartofaccountsPage = lazy(() => import("../pages/Chartofaccounts/Chartofaccounts"));
const AccountingEntryPage = lazy(() => import("../pages/AccountingEntry/AccountingEntry"));
const AccountingEntryViewPage = lazy(() => import("../pages/AccountingEntry/AccountingEntryView"));
const AccountsReportPage = lazy(() => import("../pages/AccountsReport/AccountsReport"));
const BalanceSheetPage = lazy(() => import("../pages/Reports/BalanceSheet"));
const IncomeStatementPage = lazy(() => import("../pages/Reports/IncomeStatement"));

// ── كشوفات الحسابات ───────────────────────────────────────────
const AccountstatementPage = lazy(() => import("../pages/Accountstatement/Accountstatement"));
const CustomersStatementPage = lazy(() => import("../pages/Accountstatement/CustomersStatement"));
const SuppliersStatementPage = lazy(() => import("../pages/Accountstatement/SuppliersStatement"));
const AccountsStatementPage = lazy(() => import("../pages/Accountstatement/AccountsStatement"));
const AssociationMemberStatementPage = lazy(() => import("../pages/Accountstatement/AssociationMemberStatement"));
const DonorStatementPage = lazy(() => import("../pages/Accountstatement/DonorStatement"));
const HumanCaseStatementPage = lazy(() => import("../pages/Accountstatement/HumanCaseStatement"));
const ManagementMemberStatementPage = lazy(() => import("../pages/Accountstatement/ManagementMemberStatement"));
const WarrantorsStatementPage = lazy(() => import("../pages/Accountstatement/WarrantorsStatement"));

// ── السندات والأموال ───────────────────────────────────────────
const GeneralReceiptVoucherCashPage = lazy(() => import("../pages/GeneralPayment/GeneralReceiptVoucherCash"));
const GeneralReceiptVoucherPage = lazy(() => import("../pages/GeneralPayment/GeneralReceiptVoucher"));
const GeneralPaymentVoucherCashPage = lazy(() => import("../pages/GeneralPayment/GeneralPaymentVoucherCash"));
const GeneralPaymentVoucherPage = lazy(() => import("../pages/GeneralPayment/GeneralPaymentVoucher"));
const Moneyreceiptreports = lazy(() => import("../pages/MoneyReports/Moneyreceiptreports"));
const Moneytransferreports = lazy(() => import("../pages/MoneyReports/Moneytransferreports"));

// ── المشتريات والمبيعات والمخازن ──────────────────────────────
const AddClientPage = lazy(() => import("../pages/AddClient/AddClient"));
const AdditemPage = lazy(() => import("../pages/Additem/Additem"));
const AddSupplierPage = lazy(() => import("../pages/AddSupplier/AddSupplier"));
const ItemsPage = lazy(() => import("../pages/Items/Items"));
const ItemDetailsPage = lazy(() => import("../pages/Items/ItemDetails"));
const ItemsinStockPage = lazy(() => import("../pages/Items/ItemsinStock"));
const PriceListPage = lazy(() => import("../pages/PriceList/PricelList/PriceList"));
const UpdatePricesPage = lazy(() => import("../pages/PriceList/UpdatePrices/UpdatePrices"));
const NewPurchaseInvoicePage = lazy(() => import("../pages/SalesInvoice/NewPurchaseInvoice"));
const NewPurchaseRefundInvoicePage = lazy(() => import("../pages/SalesInvoice/NewPurchaseRefundInvoice"));
const NewSalesInvoicePage = lazy(() => import("../pages/SalesInvoice/NewSalesInvoice"));
const NewSalesRefundInvoicePage = lazy(() => import("../pages/SalesInvoice/NewSalesRefundInvoice"));
const PrintPurchasePage = lazy(() => import("../pages/SalesInvoice/PrintPurchase"));
const CustomerReportPage = lazy(() => import("../pages/CustomerReport/CustomerReport"));
const PurchasesReportPage = lazy(() => import("../pages/PurchasesReport/PurchasesReport"));
const PurecommandPage = lazy(() => import("../pages/Purecommand/Purecommand"));
const SalesReportPage = lazy(() => import("../pages/SalesReport/SalesReport"));
const SettlementreportPage = lazy(() => import("../pages/Settlementreport/Settlementreport"));
const DepreciationreportPage = lazy(() => import("../pages/Settlementreport/Depreciation"));
const StoreinventoryPage = lazy(() => import("../pages/Storeinventory/Storeinventory"));
const SupplieRreportsPage = lazy(() => import("../pages/Supplierreports/SupplieRreports"));
const TransferInvoiceBetweenStoresPage = lazy(() => import("../pages/TransferInvoiceBetweenStores/TransferInvoiceBetweenStores"));
const UnitsReportPage = lazy(() => import("../pages/UnitsReport/Unitsreport"));
const WarehousereportPage = lazy(() => import("../pages/WarehouseReport/Warehousereport"));
const ItemReportPage = lazy(() => import("../pages/ItemReport/ItemReport"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const accountingRouteConfigs = [
  // ── الحسابات ──────────────────────────────────────────────────
  { path: "/chartofaccounts", element: withSuspense(ChartofaccountsPage) },
  { path: "/accountingEntry", element: withSuspense(AccountingEntryPage) },
  { path: "/accountingentry", element: withSuspense(AccountingEntryPage) },
  { path: "/accountingentryview/:id", element: withSuspense(AccountingEntryViewPage) },
  { path: "/accountsreport", element: withSuspense(AccountsReportPage) },
  { path: "/newaccountsReport", element: withSuspense(AccountsReportPage) },

  // ── الأموال والسندات ──────────────────────────────────────────
  { path: "/generalreceiptvouchercash", element: withSuspense(GeneralReceiptVoucherCashPage) },
  { path: "/generalreceiptvoucher", element: withSuspense(GeneralReceiptVoucherPage) },
  { path: "/generalpaymentvouchercash", element: withSuspense(GeneralPaymentVoucherCashPage) },
  { path: "/generalpaymentvoucher", element: withSuspense(GeneralPaymentVoucherPage) },
  { path: "/moneyreceiptreports", element: withSuspense(Moneyreceiptreports) },
  { path: "/moneyreceiptreports/:id", element: withSuspense(Moneyreceiptreports) },
  { path: "/moneytransferreports", element: withSuspense(Moneytransferreports) },
  { path: "/moneytransferreports/:id", element: withSuspense(Moneytransferreports) },

  // ── القوائم المالية ───────────────────────────────────────────
  { path: "/balancesheet", element: withSuspense(BalanceSheetPage) },
  { path: "/incomestatement", element: withSuspense(IncomeStatementPage) },

  // ── كشوفات الحسابات ───────────────────────────────────────────
  { path: "/accountstatement", element: withSuspense(AccountstatementPage) },
  { path: "/accountstatement/accounts", element: withSuspense(AccountsStatementPage) },
  { path: "/accountstatement/customers", element: withSuspense(CustomersStatementPage) },
  { path: "/accountstatement/suppliers", element: withSuspense(SuppliersStatementPage) },
  { path: "/accountstatement/associationmember", element: withSuspense(AssociationMemberStatementPage) },
  { path: "/accountstatement/donor", element: withSuspense(DonorStatementPage) },
  { path: "/accountstatement/donors", element: withSuspense(DonorStatementPage) },
  { path: "/accountstatement/humancase", element: withSuspense(HumanCaseStatementPage) },
  { path: "/accountstatement/managementmember", element: withSuspense(ManagementMemberStatementPage) },
  { path: "/accountstatement/warrantors", element: withSuspense(WarrantorsStatementPage) },

  // ── العملاء والموردين والأصناف والمشتريات والمبيعات والمخازن ──
  { path: "/addClient", element: withSuspense(AddClientPage) },
  { path: "/newadditem", element: withSuspense(AdditemPage) },
  { path: "/addSupplier", element: withSuspense(AddSupplierPage) },
  { path: "/items", element: withSuspense(ItemsPage) },
  { path: "/itemdetails/:id", element: withSuspense(ItemDetailsPage) },
  { path: "/itemsinstock", element: withSuspense(ItemsinStockPage) },
  { path: "/iteminstock/:id", element: withSuspense(ItemsinStockPage) },
  { path: "/itemsinstock/:id", element: withSuspense(ItemsinStockPage) },
  { path: "/purchaseInvoice", element: withSuspense(NewPurchaseInvoicePage) },
  { path: "/purchaseRefundInvoice", element: withSuspense(NewPurchaseRefundInvoicePage) },
  { path: "/salesInvoice", element: withSuspense(NewSalesInvoicePage) },
  { path: "/salesRefundInvoice", element: withSuspense(NewSalesRefundInvoicePage) },
  { path: "/supplierRreports", element: withSuspense(SupplieRreportsPage) },
  { path: "/pricelist", element: withSuspense(PriceListPage) },
  { path: "/updateprices/:id", element: withSuspense(UpdatePricesPage) },
  { path: "/newpurchaseinvoice", element: withSuspense(NewPurchaseInvoicePage) },
  { path: "/newpurchaserefundinvoice", element: withSuspense(NewPurchaseRefundInvoicePage) },
  { path: "/newsalesinvoice", element: withSuspense(NewSalesInvoicePage) },
  { path: "/newsalesrefundinvoice", element: withSuspense(NewSalesRefundInvoicePage) },
  { path: "/printpurchase/:id", element: withSuspense(PrintPurchasePage) },
  { path: "/customerreport", element: withSuspense(CustomerReportPage) },
  { path: "/purchasesreport", element: withSuspense(PurchasesReportPage) },
  { path: "/purecommand", element: withSuspense(PurecommandPage) },
  { path: "/salesreport", element: withSuspense(SalesReportPage) },
  { path: "/settlementreport", element: withSuspense(SettlementreportPage) },
  { path: "/depreciationreport", element: withSuspense(DepreciationreportPage) },
  { path: "/storeinventory", element: withSuspense(StoreinventoryPage) },
  { path: "/supplierreports", element: withSuspense(SupplieRreportsPage) },
  { path: "/transferinvoicebetweenstores", element: withSuspense(TransferInvoiceBetweenStoresPage) },
  { path: "/unitsreport", element: withSuspense(UnitsReportPage) },
  { path: "/warehousereport", element: withSuspense(WarehousereportPage) },
  { path: "/itemreport", element: withSuspense(ItemReportPage) },
];

export const AccountingRoutes = (
  <React.Fragment>
    {accountingRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default AccountingRoutes;
