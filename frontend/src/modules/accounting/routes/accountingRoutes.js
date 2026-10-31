import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const ChartofaccountsPage = lazy(() => import("../../../pages/Accounting/Chartofaccounts/Chartofaccounts"));
const AccountingEntryPage = lazy(() => import("../../../pages/Accounting/AccountingEntry/AccountingEntry"));
const AccountingEntryViewPage = lazy(() => import("../../../pages/Accounting/AccountingEntry/AccountingEntryView"));
const AccountsReportPage = lazy(() => import("../../../pages/Accounting/AccountsReport/AccountsReport"));
const BalanceSheetPage = lazy(() => import("../../../pages/Accounting/Reports/BalanceSheet"));
const IncomeStatementPage = lazy(() => import("../../../pages/Accounting/Reports/IncomeStatement"));

const AccountstatementPage = lazy(() => import("../../../pages/Accounting/Accountstatement/Accountstatement"));
const CustomersStatementPage = lazy(() => import("../../../pages/Accounting/Accountstatement/CustomersStatement"));
const SuppliersStatementPage = lazy(() => import("../../../pages/Accounting/Accountstatement/SuppliersStatement"));
const AccountsStatementPage = lazy(() => import("../../../pages/Accounting/Accountstatement/AccountsStatement"));
const AssociationMemberStatementPage = lazy(() => import("../../../pages/Accounting/Accountstatement/AssociationMemberStatement"));
const DonorStatementPage = lazy(() => import("../../../pages/Accounting/Accountstatement/DonorStatement"));
const HumanCaseStatementPage = lazy(() => import("../../../pages/Accounting/Accountstatement/HumanCaseStatement"));
const ManagementMemberStatementPage = lazy(() => import("../../../pages/Accounting/Accountstatement/ManagementMemberStatement"));
const WarrantorsStatementPage = lazy(() => import("../../../pages/Accounting/Accountstatement/WarrantorsStatement"));

const AddClientPage = lazy(() => import("../../../pages/Accounting/AddClient/AddClient"));
const AdditemPage = lazy(() => import("../../../pages/Accounting/Additem/Additem"));
const AddSupplierPage = lazy(() => import("../../../pages/Accounting/AddSupplier/AddSupplier"));
const ItemsPage = lazy(() => import("../../../pages/Accounting/Items/Items"));
const ItemDetailsPage = lazy(() => import("../../../pages/Accounting/Items/ItemDetails"));
const ItemsinStockPage = lazy(() => import("../../../pages/Accounting/Items/ItemsinStock"));
const PriceListPage = lazy(() => import("../../../pages/Accounting/PriceList/PricelList/PriceList"));
const UpdatePricesPage = lazy(() => import("../../../pages/Accounting/PriceList/UpdatePrices/UpdatePrices"));

const NewPurchaseInvoicePage = lazy(() => import("../../../pages/Accounting/SalesInvoice/NewPurchaseInvoice"));
const NewPurchaseRefundInvoicePage = lazy(() => import("../../../pages/Accounting/SalesInvoice/NewPurchaseRefundInvoice"));
const NewSalesInvoicePage = lazy(() => import("../../../pages/Accounting/SalesInvoice/NewSalesInvoice"));
const NewSalesRefundInvoicePage = lazy(() => import("../../../pages/Accounting/SalesInvoice/NewSalesRefundInvoice"));
const PrintPurchasePage = lazy(() => import("../../../pages/Accounting/SalesInvoice/PrintPurchase"));

const CustomerReportPage = lazy(() => import("../../../pages/Accounting/CustomerReport/CustomerReport"));
const PurchasesReportPage = lazy(() => import("../../../pages/Accounting/PurchasesReport/PurchasesReport"));
const PurecommandPage = lazy(() => import("../../../pages/Accounting/Purecommand/Purecommand"));
const SalesReportPage = lazy(() => import("../../../pages/Accounting/SalesReport/SalesReport"));
const SettlementreportPage = lazy(() => import("../../../pages/Accounting/Settlementreport/Settlementreport"));
const DepreciationreportPage = lazy(() => import("../../../pages/Accounting/Settlementreport/Depreciation"));
const StoreinventoryPage = lazy(() => import("../../../pages/Accounting/Storeinventory/Storeinventory"));
const SupplieRreportsPage = lazy(() => import("../../../pages/Accounting/Supplierreports/SupplieRreports"));
const TransferInvoiceBetweenStoresPage = lazy(() => import("../../../pages/Accounting/TransferInvoiceBetweenStores/TransferInvoiceBetweenStores"));
const UnitsReportPage = lazy(() => import("../../../pages/Accounting/UnitsReport/Unitsreport"));
const WarehousereportPage = lazy(() => import("../../../pages/Accounting/WarehouseReport/Warehousereport"));
const ItemReportPage = lazy(() => import("../../../pages/Accounting/ItemReport/ItemReport"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const accountingRouteConfigs = [
  // ── Core Accounting ───────────────────────────────────────────
  { path: "/chartofaccounts", element: withSuspense(ChartofaccountsPage) },
  { path: "/accountingEntry", element: withSuspense(AccountingEntryPage) },
  { path: "/accountingentryview/:id", element: withSuspense(AccountingEntryViewPage) },
  { path: "/accountsreport", element: withSuspense(AccountsReportPage) },
  { path: "/newaccountsReport", element: withSuspense(AccountsReportPage) },
  { path: "/balancesheet", element: withSuspense(BalanceSheetPage) },
  { path: "/incomestatement", element: withSuspense(IncomeStatementPage) },

  // ── Statements ────────────────────────────────────────────────
  { path: "/accountstatement", element: withSuspense(AccountstatementPage) },
  { path: "/accountstatement/customers", element: withSuspense(CustomersStatementPage) },
  { path: "/accountstatement/suppliers", element: withSuspense(SuppliersStatementPage) },
  { path: "/accountstatement/accounts", element: withSuspense(AccountsStatementPage) },
  { path: "/accountstatement/associationmember", element: withSuspense(AssociationMemberStatementPage) },
  { path: "/accountstatement/donor", element: withSuspense(DonorStatementPage) },
  { path: "/accountstatement/donors", element: withSuspense(DonorStatementPage) },
  { path: "/accountstatement/humancase", element: withSuspense(HumanCaseStatementPage) },
  { path: "/accountstatement/managementmember", element: withSuspense(ManagementMemberStatementPage) },
  { path: "/accountstatement/warrantors", element: withSuspense(WarrantorsStatementPage) },

  // ── Clients, Items & Suppliers ────────────────────────────────
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

  // ── Invoices ──────────────────────────────────────────────────
  { path: "/newpurchaseinvoice", element: withSuspense(NewPurchaseInvoicePage) },
  { path: "/newpurchaserefundinvoice", element: withSuspense(NewPurchaseRefundInvoicePage) },
  { path: "/newsalesinvoice", element: withSuspense(NewSalesInvoicePage) },
  { path: "/newsalesrefundinvoice", element: withSuspense(NewSalesRefundInvoicePage) },
  { path: "/printpurchase/:id", element: withSuspense(PrintPurchasePage) },

  // ── Inventory & Reports ───────────────────────────────────────
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
