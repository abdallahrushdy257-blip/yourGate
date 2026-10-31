import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import TestPreLoader from "../../../pages/TestPreLoader/TestPreLoader";

const SendDesignRequest = lazy(() => import("../pages/SendDesignRequest/SendDesignRequest"));
const SendDesignRequestshop = lazy(() => import("../pages/SendDesignRequest/SendDesignRequestshop"));
const SendMarketingRequest = lazy(() => import("../pages/SendMarketingRequest/SendMarketingRequest"));
const SendMarketingRequestshop = lazy(() => import("../pages/SendMarketingRequest/SendMarketingRequestshop"));
const MarketingReports = lazy(() => import("../pages/MarketingReports/MarketingReports"));
const ComplexDesignMarketingRequest = lazy(() => import("../pages/ComplexDesignMarketingRequest/ComplexDesignMarketingRequest"));
const DesignsDetails = lazy(() => import("../pages/DesignDetails/DesignsDetails"));
const MarketingDetails = lazy(() => import("../pages/DesignDetails/MarketingDetails"));
const DesignsDetailsshop = lazy(() => import("../pages/DesignDetails/DesignsDetailsshop"));
const MarketingDetailsshop = lazy(() => import("../pages/DesignDetails/MarketingDetailsshop"));
const DesignAttachments = lazy(() => import("../pages/DesignAttachments/DesignAttachments"));
const DesignAttachmentsshop = lazy(() => import("../pages/DesignAttachments/DesignAttachmentsshop"));

const withSuspense = (Component) => (
  <Suspense fallback={<TestPreLoader />}>
    <Component />
  </Suspense>
);

export const marketingRouteConfigs = [
  { path: "/senddesignrequest/:id", element: withSuspense(SendDesignRequest) },
  { path: "/senddesignrequestshop/:id", element: withSuspense(SendDesignRequestshop) },
  { path: "/sendmarketingrequest/:id", element: withSuspense(SendMarketingRequest) },
  { path: "/sendmarketingrequestshop/:id", element: withSuspense(SendMarketingRequestshop) },
  { path: "/marketingreports", element: withSuspense(MarketingReports) },
  { path: "/complexdesignmarketingrequest/:id", element: withSuspense(ComplexDesignMarketingRequest) },
  { path: "/designsdetails", element: withSuspense(DesignsDetails) },
  { path: "/marketingdetails", element: withSuspense(MarketingDetails) },
  { path: "/marketingdetailsshop", element: withSuspense(DesignsDetailsshop) },
  { path: "/designsdetailsshop", element: withSuspense(MarketingDetailsshop) },
  { path: "/designattachments/:id", element: withSuspense(DesignAttachments) },
  { path: "/designattachmentsshop/:id", element: withSuspense(DesignAttachmentsshop) },
];

export const MarketingRoutes = (
  <React.Fragment>
    {marketingRouteConfigs.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </React.Fragment>
);

export default MarketingRoutes;

