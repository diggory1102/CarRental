import { axiosClient } from "./axiosClient";

export const contractApi = {
  getAll: () => axiosClient.get("/contracts"),
  rent: (rentalData) => axiosClient.post("/rent", rentalData),
  returnCar: (returnData) => axiosClient.post("/return", {
    ...returnData,
    soNgayThucTe: String(returnData.soNgayThucTe)
  }),
  getHistory: (maKH) => axiosClient.get(`/history?maKH=${maKH}`),
};
