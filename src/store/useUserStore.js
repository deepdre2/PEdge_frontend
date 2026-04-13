import { create } from "zustand";
import api from "@/lib/api";
import toast from "react-hot-toast";

const useUserStore = create((set, get) => ({
  users:      [],
  total:      0, 
  page:       1,
  limit:      50,
  loading:    false,
  searching:  false,
  error:      null,

  // fetch paginated users (replaces old fetchUsers)
  fetchUsers: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const { limit } = get();
      const res = await api.get(`/users?page=${page}&limit=${limit}`);
      // backend now returns { data, total, page, limit }
      set({ users: res.data.data, total: res.data.total, page, loading: false });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load users";
      set({ error: msg, loading: false });
      toast.error(msg);
    }
  },

  // search by email — hits backend (uses DB index) for faster query
  searchByEmail: async (email) => {
    if (!email.trim()) {
      get().fetchUsers(1);
      return;
    }
    set({ searching: true });
    try {
      const res = await api.get(`/users/search?email=${email}`);
      // search returns plain array, not paginated
      set({ users: res.data, total: res.data.length, searching: false });
    } catch (err) {
      set({ searching: false });
      toast.error("Search failed");
    }
  },

  // create new user
  createUser: async (data) => {
    try {
      const res = await api.post("/users", data);
      // refetch page 1 + bump count
      await get().fetchUsers(1);
      toast.success("User created!");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create user";
      toast.error(msg);
      return { success: false, message: msg };
    }
  },

  // update a user by id
  updateUser: async (id, data) => {
    try {
      const res = await api.patch(`/users/${id}`, data);
      // update just this user in local list
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, ...res.data } : u)),
      }));
      toast.success("User updated!");
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update user";
      toast.error(msg);
      return { success: false, message: msg };
    }
  },

  // delete a user by id
  deleteUser: async (id) => {
    try {
      await api.delete(`/users/${id}`);
      set((state) => ({
        users:  state.users.filter((u) => u.id !== id),
        total:  state.total - 1,
      }));
      toast.success("User deleted!");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete user";
      toast.error(msg);
      return { success: false };
    }
  },
}));

export default useUserStore;