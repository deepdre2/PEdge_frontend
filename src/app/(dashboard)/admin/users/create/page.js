"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useUserStore from "@/store/useUserStore";
import UserForm from "@/components/forms/UserForm";

export default function CreateUserPage() {
  const router = useRouter();
  const createUser = useUserStore((s) => s.createUser);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    const result = await createUser(data);
    setLoading(false);
    if (result.success) {
      router.push("/admin/users");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/users" className="hover:text-blue-600">Users</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Create</span>
      </div>

      {/* card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-lg font-bold text-gray-900 mb-6">Add new user</h1>
        <UserForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}