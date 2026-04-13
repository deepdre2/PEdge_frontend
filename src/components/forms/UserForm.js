"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function UserForm({
  onSubmit,
  defaultValues = {},
  loading = false,
  isEdit = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  // only re-run when the user ID changes, not on every render
  // this handles the edit page where defaultValues arrives after a fetch
  useEffect(() => {
    if (defaultValues?.id) {
      reset(defaultValues);
    }
  }, [defaultValues?.id]); 

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Full name"
          name="name"
          placeholder="John Doe"
          required
          register={(name) => register(name, { required: "Name is required" })}
          error={errors.name?.message}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="john@example.com"
          required
          register={(name) =>
            register(name, {
              required: "Email is required",
              pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
            })
          }
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Mobile"
          name="mobile"
          placeholder="+91 9876543210"
          register={(name) =>
            register(name, {
              pattern: { value: /^[+\d\s]{7,15}$/, message: "Invalid mobile number" },
            })
          }
          error={errors.mobile?.message}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Role <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            {...register("role", { required: "Role is required" })}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && (
            <p className="text-xs text-red-500">{errors.role.message}</p>
          )}
        </div>
      </div>

      <Input
        label="Address"
        name="address"
        placeholder="123 Main St, City"
        register={register}
        error={errors.address?.message}
      />

      {!isEdit && (
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Min. 6 characters"
          required
          register={(name) =>
            register(name, {
              required: "Password is required",
              minLength: { value: 6, message: "Min. 6 characters" },
            })
          }
          error={errors.password?.message}
        />
      )}

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading} size="lg">
          {isEdit ? "Save changes" : "Create user"}
        </Button>
      </div>
    </form>
  );
}