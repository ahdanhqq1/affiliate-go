import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const { signIn, loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cartoon-yellow">
      <div className="max-w-md w-full bg-white border-4 border-cartoon-dark rounded-3xl p-8 shadow-cartoon-lg text-center transform hover:scale-[1.02] transition-transform">
        <div className="mb-8">
          <div className="w-24 h-24 bg-cartoon-blue border-4 border-cartoon-dark rounded-full flex items-center justify-center mx-auto mb-4 shadow-cartoon">
            <LogIn className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-cartoon-dark mb-2">Affiliate Go</h1>
          <p className="text-lg text-gray-600">AI Product Studio</p>
        </div>

        <button
          onClick={signIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white border-4 border-cartoon-dark rounded-2xl text-xl font-bold text-cartoon-dark shadow-cartoon hover:shadow-cartoon-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          Login with Google
        </button>

        <p className="mt-8 text-sm text-gray-500">
          By logging in, you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
};
