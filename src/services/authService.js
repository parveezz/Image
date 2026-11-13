import { api } from "@/lib/api";

export const authService = {
  /**
   * Authenticate admin using email and password.
   * Backend sets the HTTP-only cookie.
   * @param {{ email: string, password: string }} credentials
   */
  async login(credentials) {
    return await api.post("/api/auth/login", credentials);
  },

  /**
   * Retrieve current authenticated admin profile and verify session.
   */
  async getMe() {
    return await api.get("/api/auth/me");
  },

  /**
   * Clear backend session and HTTP-only cookie.
   */
  async logout() {
    return await api.post("/api/auth/logout", {});
  },
};

export default authService;
