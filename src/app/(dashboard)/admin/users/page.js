"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import useUserStore from "@/store/useUserStore";
import UserTable from "@/components/tables/UserTable";
import Button from "@/components/ui/Button";

export default function AdminUsersPage() {
  const {
    users, total, page, limit,
    loading, searching,
    fetchUsers, searchByEmail, deleteUser,
  } = useUserStore();

  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch]         = useState("");

  // on mount — fetch first page + redis count
  useEffect(() => {
    fetchUsers(1);
  }, []);

  // debounced server-side search
  useEffect(() => {
    const t = setTimeout(() => searchByEmail(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    setDeletingId(id);
    await deleteUser(id);
    setDeletingId(null);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Users</h1>
          {/* count comes from Redis, total from current page query */}
          <p className="text-sm text-gray-500 mt-0.5">
            {total.toLocaleString()} total users
          </p>
        </div>
        <Link href="/admin/users/create">
          <Button size="md">+ Add User</Button>
        </Link>
      </div>

      {/* search — now hits backend, uses DB email*/}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"/>
        </svg>
        <input
          type="text"
          placeholder="Search by email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
        {searching && (
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400"
            fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Loading users…
        </div>
      ) : (
        <UserTable users={users} onDelete={handleDelete} deletingId={deletingId} />
      )}

      {/* Pagination */}
      {!search && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages} — showing {users.length} of {total.toLocaleString()}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={page <= 1}
              onClick={() => fetchUsers(page - 1)}
            >
              ← Prev
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => fetchUsers(page + 1)}
            >
              Next →
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}