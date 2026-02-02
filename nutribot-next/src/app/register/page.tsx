"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        height: "",
        weight: "",
        age: "",
        gender: "male",
        goal: "Weight Loss",
        activity_level: "Moderate",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Convert numbers
            const payload = {
                ...formData,
                height: parseFloat(formData.height),
                weight: parseFloat(formData.weight),
                age: parseInt(formData.age),
            };

            await api.register(payload);
            router.push("/login?message=Account created! Please login.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
                <h2 className="text-3xl font-bold mb-6 text-center text-emerald-400">Join NutriBot</h2>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input name="username" required onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" name="email" required onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input type="password" name="password" required onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Height (cm)</label>
                            <input type="number" name="height" required onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                            <input type="number" name="weight" required onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Age</label>
                            <input type="number" name="age" required onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Gender</label>
                            <select name="gender" onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Goal</label>
                        <select name="goal" onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none">
                            <option value="Weight Loss">Weight Loss</option>
                            <option value="Muscle Gain">Muscle Gain</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 mt-6"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    Already have an account?{" "}
                    <a href="/login" className="text-emerald-400 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}
