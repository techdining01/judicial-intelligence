"use client";

import { useState } from "react";
import { login } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const data = await login(email, password);
    localStorage.setItem("access", data.access);
    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h1 className="text-xl font-bold mb-4">Legal Login</h1>

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-slate-900 text-white p-2 rounded"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
