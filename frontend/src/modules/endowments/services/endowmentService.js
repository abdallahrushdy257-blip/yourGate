import API from "../../../api/axiosConfig";

export const endowmentService = {
  getEndowments: (params) => API.get("/endowments", { params }),
  getEndowment: (id) => API.get(`/endowments/${id}`),
  createEndowment: (data) =>
    API.post("/endowments/store", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateEndowment: (data) =>
    API.post("/endowments/update", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getPaymentHistory: (id) => API.get(`shoptransaction/endowments/${id}`),
};

export default endowmentService;
