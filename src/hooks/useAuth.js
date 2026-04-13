import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

/**
 *
 * Usage:
 *   const { user, isAdmin, logout } = useAuth();
 */
export default function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, logout: storeLogout } = useAuthStore();

  const isAdmin = user?.role === "admin";
  const isUser  = user?.role === "user";

  const logout = () => {
    storeLogout();
    document.cookie = "auth_token=; path=/; max-age=0";
    router.push("/login");
  };

  // redirect away if not allowed
  const requireAdmin = () => {
    if (!isAuthenticated || !isAdmin) {
      router.replace("/user/profile");
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isUser,
    logout,
    requireAdmin,
  };
}