
import { api } from "@/lib/api";

export const authService = {
  /**
   * Authenticate admin using email and password.
   * Backend sets the HTTP-only authentication cookie.
   *
   * @param {{ email: string, password: string }} credentials
   */
  async login(credentials) {
    const response = await api.post(
      "/api/auth/login",
      credentials
    );

    return response.data;
  },

  /**
   * Retrieve the currently authenticated admin profile.
   */
  async getMe() {
    const response = await api.get("/api/auth/me");

    return response.data;
  },

  /**
   * Clear the backend session and HTTP-only cookie.
   */
  async logout() {
    const response = await api.post(
      "/api/auth/logout",
      {}
    );

    return response.data;
  },
};

export default authService;
