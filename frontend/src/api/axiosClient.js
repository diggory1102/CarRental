const API_URL = "/api";

export const axiosClient = {
  get: async (url) => {
    try {
      const res = await fetch(`${API_URL}${url}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Lỗi hệ thống" }));
        throw new Error(err.message || "Lỗi khi gọi API");
      }
      return await res.json();
    } catch (error) {
      console.error("GET error:", error);
      throw error;
    }
  },
  post: async (url, data) => {
    try {
      const res = await fetch(`${API_URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => ({ message: "Lỗi phản hồi từ server" }));
      if (!res.ok) {
        throw new Error(result.message || "Lỗi khi thực hiện yêu cầu");
      }
      return result;
    } catch (error) {
      console.error("POST error:", error);
      throw error;
    }
  }
};
