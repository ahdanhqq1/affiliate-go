
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FeatureHeader } from '../components/FeatureHeader';
import { Key, Save, Trash2, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Settings: React.FC = () => {
    const { t } = useLanguage();
    const { profile, user } = useAuth();
    const [geminiKey, setGeminiKey] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const savedKey = localStorage.getItem('CUSTOM_GEMINI_API_KEY');
        if (savedKey) {
            setGeminiKey(savedKey);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('CUSTOM_GEMINI_API_KEY', geminiKey);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        // Reload to apply changes to geminiService
        window.location.reload();
    };

    const handleClear = () => {
        localStorage.removeItem('CUSTOM_GEMINI_API_KEY');
        setGeminiKey('');
        window.location.reload();
    };

    const isAdminEmail = user?.email === 'ahdanhqq1@gmail.com' || profile?.email === 'ahdanhqq1@gmail.com';
    if (profile?.role !== 'admin' && !isAdminEmail) {
        return (
            <div className="p-8 text-center">
                <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold">Akses Ditolak</h1>
                <p>Hanya admin yang dapat mengakses pengaturan ini.</p>
                <p className="text-sm text-slate-500 mt-2">Email Anda: {user?.email || 'Tidak terdeteksi'}</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto pb-20">
            <FeatureHeader
                title="Pengaturan Aplikasi"
                description="Kelola API Key dan konfigurasi aplikasi Anda."
            />

            <div className="space-y-8">
                {/* API Key Section */}
                <section className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border-4 border-cartoon-dark shadow-cartoon-lg">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-cartoon-yellow rounded-2xl border-4 border-cartoon-dark shadow-cartoon">
                            <Key className="w-6 h-6 text-cartoon-dark" />
                        </div>
                        <h2 className="text-2xl font-black text-cartoon-dark uppercase italic">Gemini API Configuration</h2>
                    </div>

                    <div className="space-y-4">
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                            Masukkan API Key Gemini Anda di sini. Pengaturan ini akan disimpan di browser Anda (Local Storage) dan akan digunakan sebagai prioritas utama.
                        </p>

                        <div className="relative">
                            <input
                                type="password"
                                value={geminiKey}
                                onChange={(e) => setGeminiKey(e.target.value)}
                                placeholder="Masukkan API Key (AI Studio)..."
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-4 border-cartoon-dark rounded-2xl font-bold focus:ring-0 focus:outline-none placeholder:text-slate-400"
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-8 py-3 bg-cartoon-green text-white font-black rounded-2xl border-4 border-cartoon-dark shadow-cartoon hover:shadow-cartoon-hover transition-all uppercase italic"
                            >
                                <Save className="w-5 h-5" />
                                {isSaved ? 'Tersimpan!' : 'Simpan Key'}
                            </button>
                            <button
                                onClick={handleClear}
                                className="flex items-center gap-2 px-8 py-3 bg-red-500 text-white font-black rounded-2xl border-4 border-cartoon-dark shadow-cartoon hover:shadow-cartoon-hover transition-all uppercase italic"
                            >
                                <Trash2 className="w-5 h-5" />
                                Hapus
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 flex gap-4 items-start">
                            <ExternalLink className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                                <p className="font-bold mb-1">Belum punya API Key?</p>
                                <p>Dapatkan secara gratis di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-black">Google AI Studio</a>.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
