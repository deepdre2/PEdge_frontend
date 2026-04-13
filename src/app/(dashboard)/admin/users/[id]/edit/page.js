"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import useUserStore from "@/store/useUserStore";
import UserForm from "@/components/forms/UserForm";
import toast from "react-hot-toast";
import useAuthStore from "@/store/useAuthStore";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const updateUser = useUserStore((s) => s.updateUser);
  const { user: loggedInUser, updateUser: updateAuthUser } = useAuthStore();

  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // load this user's current data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data);
      } catch {
        toast.error("Could not load user");
        router.push("/admin/users");
      } finally {
        setFetching(false);
      }
    };
    loadUser();
  }, [id]);

  const handleSubmit = async (data) => {
    setLoading(true);
    const result = await updateUser(Number(id), data);
    setLoading(false);
    if (result.success) {
       if (loggedInUser?.id === Number(id)) { 
        updateAuthUser(data);    
      }
      router.push("/admin/users");
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        Loading user…
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

    
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/users" className="hover:text-blue-600">Users</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Edit #{id}</span>
      </div>

      {/* card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-lg font-bold text-gray-900 mb-6">
          Edit user — <span className="text-blue-600">{user?.name}</span>
        </h1>
        <UserForm
          onSubmit={handleSubmit}
          defaultValues={user}
          loading={loading}
          isEdit
        />
      </div>
    </div>
  );
}