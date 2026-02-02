"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/services/api";

import { Suspense } from "react";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const message = searchParams.get("message");
        if (message) setMsg(message);
    }, [searchParams]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.login(formData);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-700">
                <h2 className="text-3xl font-bold mb-2 text-center text-emerald-400">Welcome Back</h2>
                <p className="text-gray-400 text-center mb-6">Login to NutriBot</p>

                {msg && (
                    <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-100 p-3 rounded-lg mb-4 text-sm">
                        {msg}
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            name="username"
                            required
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 mt-4"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    New here?{" "}
                    <a href="/register" className="text-emerald-400 hover:underline">
                        Create an Account
                    </a>
                </p>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
