import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const ChartofaccountsPage = lazy(() => import("../pages").then((m) => ({ default: m.ChartofaccountsPage })));
const AccountingEntryPage = lazy(() => import("../pages").then((m) => ({ default: m.AccountingEntryPage })));
const AccountingEntryViewPage = lazy(() => import("../pages").then((m) => ({ default: m.AccountingEntryViewPage })));
const AccountsReportPage = lazy(() => import("../pages").then((m) => ({ default: m.AccountsReportPage })));
const BalanceSheetPage = lazy(() => import("../pages").then((m) => ({ default: m.BalanceSheetPage })));
const IncomeStatementPage = lazy(() => import("../pages").then((m) => ({ default: m.IncomeStatementPage })));

const AccountstatementPage = lazy(() => import("../pages").then((m) => ({ default: m.AccountstatementPage })));
const CustomersStatementPage = lazy(() => import("../pages").then((m) => ({ default: m.CustomersStatementPage })));
const SuppliersStatementPage = lazy(() => import("../pages").then((m) => ({ default: m.SuppliersStatementPage })));
const AccountsStatementPage = lazy(() => import("../pages").then((m) => ({ default: m.AccountsStatementPage })));
const AssociationMemberStatementPage = lazy(() => import("../pages").then((m) => ({ default: m.AssociationMemberStatementPage })));
const DonorStatementPage = lazy(() => import("../pages").then((m) => ({ default: m.DonorStatementPage })));
const HumanCaseStatementPage = lazy(() => import("../pages").then((m) => ({ default: m.HumanCaseStatementPage })));
const ManagementMemberStatementPage = lazy(() => import("../pages").then((m) => ({ default: m.ManagementMemberStatementPage })));
const WarrantorsStatementPage = lazy(() => import("../pages").then((m) => ({ default: m.WarrantorsStatementPage })));

const AddClientPage = lazy(() => import("../pages").then((m) => ({ default: m.AddClientPage })));
const AdditemPage = lazy(() => import("../pages").then((m) => ({ default: m.AdditemPage })));
const AddSupplierPage = lazy(() => import("../pages").then((m) => ({ default: m.AddSupplierPage })));
const ItemsPage = lazy(() => import("../pages").then((m) => ({ default: m.ItemsPage })));
const ItemDetailsPage = lazy(() => import("../pages").then((m) => ({ default: m.ItemDetailsPage })));
const ItemsinStockPage = lazy(() => import("../pages").then((m) => ({ default: m.ItemsinStockPage })));
const PriceListPage = lazy(() => import("../pages").then((m) => ({ default: m.PriceListPage })));
const UpdatePricesPage = lazy(() => import("../pages").then((m) => ({ default: m.UpdatePricesPage })));

const NewPurchaseInvoicePage = lazy(() => import("../pages").then((m) => ({ default: m.NewPurchaseInvoicePage })));
const NewPurchaseRefundInvoicePage = lazy(() => import("../pages").then((m) => ({ default: m.NewPurchaseRefundInvoicePage })));
const NewSalesInvoicePage = lazy(() => import("../pages").then((m) => ({ default: m.NewSalesInvoicePage })));
const NewSalesRefundInvoicePage = lazy(() => import("../pages").then((m) => ({ default: m.NewSalesRefundInvoicePage })));
const PrintPurchasePage = lazy(() => import("../pages").then((m) => ({ default: m.PrintPurchasePage })));

const CustomerReportPage = lazy(() => import("../pages").then((m) => ({ default: m.CustomerReportPage })));
const PurchasesReportPage = lazy(() => import("../pages").then((m) => ({ default: m.PurchasesReportPage })));
const PurecommandPage = lazy(() => import("../pages").then((m) => ({ default: m.PurecommandPage })));
const SalesReportPage = lazy(() => import("../pages").then((m) => ({ default: m.SalesReportPage })));
const SettlementreportPage = lazy(() => import("../pages").then((m) => ({ default: m.SettlementreportPage })));
const DepreciationreportPage = lazy(() => import("../pages").then((m) => ({ default: m.DepreciationreportPage })));
const StoreinventoryPage = lazy(() => import("../pages").then((m) => ({ default: m.StoreinventoryPage })));
const SupplieRreportsPage = lazy(() => import("../pages").then((m) => ({ default: m.SupplieRreportsPage })));
const TransferInvoiceBetweenStoresPage = lazy(() =>
  import("../pages").then((m) => ({ default: m.TransferInvoiceBetweenStoresPage }))
);
const UnitsReportPage = lazy(() => import("../pages").then((m) => ({ default: m.UnitsReportPage })));
const WarehousereportPage = lazy(() => import("../pages").then((m) => ({ default: m.WarehousereportPage })));
const ItemReportPage = lazy(() => import("../pages").then((m) => ({ default: m.ItemReportPage })));

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
