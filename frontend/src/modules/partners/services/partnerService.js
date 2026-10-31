import API from "../../../api/axiosConfig";

export const partnerService = {
  createClient: (data) => API.post("/clients/store", data),
  getClients: (params) => API.get("/clients", { params }),

  createSupplier: (data) => API.post("/suppliers/store", data),
  getSuppliers: (params) => API.get("/suppliers", { params }),

  getStatementOfAccount: (params) => API.get("/statements", { params }),
};

export default partnerService;
