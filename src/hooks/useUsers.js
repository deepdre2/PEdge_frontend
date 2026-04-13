import { useEffect } from "react";
import useUserStore from "@/store/useUserStore";

/**
 * Usage:
 *   const { users, loading, error } = useUsers();
 */
export default function useUsers() {
  const {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers,
  };
}