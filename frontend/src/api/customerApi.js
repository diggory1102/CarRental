import { axiosClient } from "./axiosClient";

export const customerApi = {
  getAll: () => axiosClient.get("/customers"),
  createOrUpdate: (customerData) => axiosClient.post("/customers", {
    ...customerData,
    namSinh: String(customerData.namSinh)
  }),
  delete: (maKH) => axiosClient.post("/customers/delete", { maKH }),
};
