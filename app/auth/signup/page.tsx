"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../src/auth/AuthContext";
import Link from "next/link";

export default function SignupPage() {
  const { signup, user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_repeat: "",
    role: "",
    agree_terms: false,
  });

  const [showPwd, setShowPwd] = useState(false);
  const [showPwdRepeat, setShowPwdRepeat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);

  const passwordsMatch =
    form.password &&
    form.password_repeat &&
    form.password === form.password_repeat;

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  useEffect(() => {
    const passwordsMatchCheck =
      form.password.length > 0 && form.password === form.password_repeat;

    setCanSubmit(
      form.name.length >= 2 &&
        form.email.includes("@") &&
        form.password.length >= 6 &&
        passwordsMatchCheck &&
        form.role !== "" &&
        form.agree_terms
    );
  }, [form]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      // Send only required fields
      await signup({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,// test purpose
      });

      // Redirect to dashboard/home after successful signup & auto-login
      router.replace("/");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 sm:p-10 overflow-y-auto max-h-screen">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800">
          Create Your Account
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Join our community today
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Phone & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone (optional)
              </label>
              <input
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="">-- Select Role --</option>
                <option value="user">Regular User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-9 text-gray-500"
              >
                👁️
              </button>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type={showPwdRepeat ? "text" : "password"}
                value={form.password_repeat}
                onChange={(e) =>
                  setForm({ ...form, password_repeat: e.target.value })
                }
                className={`mt-1 w-full rounded-md border px-3 py-2 pr-10 focus:outline-none focus:ring-1 ${
                  passwordsMatch
                    ? "border-gray-300 focus:ring-green-500 focus:border-green-500"
                    : "border-red-400 focus:ring-red-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPwdRepeat(!showPwdRepeat)}
                className="absolute right-3 top-9 text-gray-500"
              >
                👁️
              </button>
              {!passwordsMatch && form.password_repeat && (
                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
              )}
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={form.agree_terms}
              onChange={(e) =>
                setForm({ ...form, agree_terms: e.target.checked })
              }
              className="mt-1"
            />
            <span className="text-sm text-gray-700">
              I agree to the terms and conditions
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full rounded-md bg-green-600 py-2 text-white font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
