"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import useAuthStore from "@/store/useAuthStore";
import useUserStore from "@/store/useUserStore";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function UserProfilePage() {
  const { user, updateUser: updateAuthUser } = useAuthStore();
  const updateUser = useUserStore((s) => s.updateUser);
  const [loading, setLoading]         = useState(false);
  const [editMode, setEditMode]       = useState(false);
  const [pwdMode, setPwdMode]         = useState(false);

  // profile form 
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: user });

  const onProfileSave = async (data) => {
    setLoading(true);
    // remove password field — not updated here
    const { password, role, ...payload } = data;
    const result = await updateUser(user.id, payload);
    if (result.success) {
      updateAuthUser(result.data); // keep zustand + localStorage in sync
      setEditMode(false);
    }
    setLoading(false);
  };

  const onCancel = () => {
    reset(user);
    setEditMode(false);
  };

  // password form 
  const {
    register: regPwd,
    handleSubmit: handlePwd,
    watch,
    reset: resetPwd,
    formState: { errors: pwdErrors },
  } = useForm();

  const newPwd = watch("newPassword");

  const onPasswordSave = async (data) => {
    setLoading(true);
    const result = await updateUser(user.id, { password: data.newPassword });
    console.log('update result:', result);
    if (result.success) {
      resetPwd();
      setPwdMode(false);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          View and update your personal details
        </p>
      </div>

      {/* profile card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">

        {/* avatar + name row */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold
            flex items-center justify-center uppercase flex-shrink-0">
            {user?.name?.[0]}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full
              bg-green-100 text-green-700">
              {user?.role}
            </span>
          </div>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="ml-auto flex items-center gap-1.5 text-sm text-blue-600
                hover:text-blue-700 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L12 16H9v-3z"
                />
              </svg>
              Edit
            </button>
          )}
        </div>

        {/* profile form */}
        <form onSubmit={handleSubmit(onProfileSave)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Full name"
              name="name"
              disabled={!editMode}
              register={(name) =>
                register(name, { required: "Name is required" })
              }
              error={errors.name?.message}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              disabled={!editMode}
              register={(name) =>
                register(name, { required: "Email is required" })
              }
              error={errors.email?.message}
            />
          </div>

          <Input
            label="Mobile"
            name="mobile"
            disabled={!editMode}
            register={register}
            error={errors.mobile?.message}
          />

          <Input
            label="Address"
            name="address"
            disabled={!editMode}
            register={register}
            error={errors.address?.message}
          />

          {/* ation buttons — only visible in edit mode */}
          {editMode && (
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="secondary" onClick={onCancel} type="button">
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Save changes
              </Button>
            </div>
          )}
        </form>
      </div>

      {/* change password card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Password</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Update your password any time
            </p>
          </div>
          {!pwdMode && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPwdMode(true)}
            >
              Change
            </Button>
          )}
        </div>

        {pwdMode && (
          <form onSubmit={handlePwd(onPasswordSave)} className="space-y-4">
            <Input
              label="New password"
              name="newPassword"
              type="password"
              placeholder="Min. 6 characters"
              required
              register={(name) =>
                regPwd(name, {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min. 6 characters" },
                })
              }
              error={pwdErrors.newPassword?.message}
            />
            <Input
              label="Confirm new password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              required
              register={(name) =>
                regPwd(name, {
                  validate: (val) =>
                    val === newPwd || "Passwords do not match",
                })
              }
              error={pwdErrors.confirmPassword?.message}
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                type="button"
                onClick={() => { resetPwd(); setPwdMode(false); }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Update password
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* read-only info card */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Account info
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-400">User ID</p>
            <p className="font-medium text-gray-700">#{user?.id}</p>
          </div>
          <div>
            <p className="text-gray-400">Role</p>
            <p className="font-medium text-gray-700 capitalize">{user?.role}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-400">Member since</p>
            <p className="font-medium text-gray-700">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "long", year: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}