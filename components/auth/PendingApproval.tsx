import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, MessageCircle, RefreshCw, LogOut } from 'lucide-react';

export const PendingApproval: React.FC = () => {
  const { profile, signOut, refreshProfile, loading } = useAuth();

  const handleWhatsApp = () => {
    const message = `Halo Admin, saya ${profile?.displayName || profile?.email} ingin meminta persetujuan akses untuk Affiliate Go.`;
    window.open(`https://wa.me/62882002152004?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cartoon-yellow">
      <div className="max-w-md w-full bg-white border-4 border-cartoon-dark rounded-3xl p-8 shadow-cartoon-lg text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-cartoon-orange border-4 border-cartoon-dark rounded-full flex items-center justify-center mx-auto mb-4 shadow-cartoon animate-bounce-slow">
            <Clock className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-cartoon-dark mb-2">Menunggu Persetujuan</h1>
          <p className="text-lg text-gray-600">
            Akun Anda sedang dalam proses peninjauan oleh admin.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-green-500 border-4 border-cartoon-dark rounded-2xl text-xl font-bold text-white shadow-cartoon hover:shadow-cartoon-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <MessageCircle className="w-6 h-6" />
            Hubungi Admin (WA)
          </button>

          <p className="text-sm text-gray-500 font-medium">
            Kirim pesan ke WA jika ingin proses persetujuan lebih cepat.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={refreshProfile}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-cartoon-blue border-4 border-cartoon-dark rounded-xl font-bold text-white shadow-cartoon hover:shadow-cartoon-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Cek Status
            </button>

            <button
              onClick={signOut}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-white border-4 border-cartoon-dark rounded-xl font-bold text-cartoon-dark shadow-cartoon hover:shadow-cartoon-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
