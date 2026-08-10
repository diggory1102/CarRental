import { axiosClient } from "./axiosClient";

export const carApi = {
  getAll: () => axiosClient.get("/cars"),
  create: (carData) => axiosClient.post("/cars", carData),
  delete: (bienSo) => axiosClient.post("/cars/delete", { bienSo }),
  updatePrice: (bienSo, giaThue) => axiosClient.post("/cars/update-price", { bienSo, giaThue: String(giaThue) }),
  updateStatus: (bienSo, trangThai) => axiosClient.post("/cars/update-status", { bienSo, trangThai }),
};
