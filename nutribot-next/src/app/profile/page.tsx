"use client";

import { Header } from "@/components/dashboard/Header";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-[#f8fcfb] bg-gradient-to-br from-[#f8fcfb] via-[#fffef7] to-[#f3faf8] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <Header />

            <main className="max-w-4xl mx-auto p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Profil Pengguna
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Kelola data pribadi dan preferensi diet Anda.
                    </p>
                </div>

                <ProfileForm />
            </main>

            {/* Decorative background elements */}
            <div className="fixed top-20 left-10 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="fixed bottom-10 right-10 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl pointer-events-none -z-10" />
        </div>
    );
}
