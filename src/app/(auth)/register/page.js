"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // watch password field to validate confirmPassword
  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // remove confirmPassword before sending to API
      const { confirmPassword, ...payload } = data;

      await api.post("/auth/register", payload);
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          {/* header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the details below to get started
            </p>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full name"
              name="name"
              placeholder="John Doe"
              required
              register={register}
              error={errors.name?.message}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              register={register}
              error={errors.email?.message}
            />

            <Input
              label="Mobile"
              name="mobile"
              placeholder="+91 9876543210"
              register={register}
              error={errors.mobile?.message}
            />

            <Input
              label="Address"
              name="address"
              placeholder="123 Main St, City"
              register={register}
              error={errors.address?.message}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              required
              register={register}
              error={errors.password?.message}
            />

            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              required
              register={(name) =>
                register(name, {
                  validate: (val) =>
                    val === password || "Passwords do not match",
                })
              }
              error={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
            >
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}