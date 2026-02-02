"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Ruler, Weight, Activity, Target } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";

type UserProfile = {
    username: string;
    email: string;
    age: number | null;
    height: number | null;
    weight: number | null;
    gender: string;
    activity_level: string;
    goal: string;
};

export function ProfileForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({
        username: "",
        email: "",
        age: null,
        height: null,
        weight: null,
        gender: "male",
        activity_level: "sedentary",
        goal: "maintenance"
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api.getMe();
                setProfile(data);
            } catch (error) {
                console.error("Failed to load profile:", error);
                toast.error("Gagal memuat profil");
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: name === 'age' || name === 'height' || name === 'weight' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.updateProfile(profile);
            toast.success("Profil berhasil diperbarui!");
            // Update local storage user data if needed
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...currentUser, ...profile }));
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("Gagal memperbarui profil");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <User size={32} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Edit Profil Anda</h2>
                    <p className="text-sm text-slate-500">Perbarui informasi kesehatan Anda untuk hasil yang lebih akurat.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username (Read-only) */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <User size={16} /> Username
                    </label>
                    <input
                        type="text"
                        value={profile.username}
                        disabled
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                    />
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Mail size={16} /> Email
                    </label>
                    <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                    />
                </div>

                {/* Age */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Umur (Tahun)</label>
                    <input
                        type="number"
                        name="age"
                        value={profile.age || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="Contoh: 25"
                    />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Jenis Kelamin</label>
                    <select
                        name="gender"
                        value={profile.gender}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    >
                        <option value="male">Laki-laki</option>
                        <option value="female">Perempuan</option>
                    </select>
                </div>

                {/* Height */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Ruler size={16} /> Tinggi Badan (cm)
                    </label>
                    <input
                        type="number"
                        name="height"
                        value={profile.height || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="Contoh: 170"
                    />
                </div>

                {/* Weight */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Weight size={16} /> Berat Badan (kg)
                    </label>
                    <input
                        type="number"
                        name="weight"
                        value={profile.weight || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="Contoh: 70"
                    />
                </div>

                {/* Activity Level */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Activity size={16} /> Aktivitas Fisik
                    </label>
                    <select
                        name="activity_level"
                        value={profile.activity_level}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    >
                        <option value="sedentary">Sedentary (Jarang bergerak)</option>
                        <option value="lightly active">Lightly Active (Olahraga 1-3x/minggu)</option>
                        <option value="moderately active">Moderately Active (Olahraga 3-5x/minggu)</option>
                        <option value="very active">Very Active (Olahraga 6-7x/minggu)</option>
                    </select>
                </div>

                {/* Goal */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Target size={16} /> Tujuan Diet
                    </label>
                    <select
                        name="goal"
                        value={profile.goal}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    >
                        <option value="weight loss">Turun Berat Badan</option>
                        <option value="maintenance">Jaga Berat Badan</option>
                        <option value="muscle gain">Naikkan Massa Otot</option>
                    </select>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
                >
                    {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
            </div>
        </form>
    );
}
