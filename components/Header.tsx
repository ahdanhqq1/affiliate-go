
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User as UserIcon, Maximize, Minimize } from './icons/LucideIcons';
import { MenuIcon } from './icons/MenuIcon';
import { AppLogoIcon } from './icons/AppLogoIcon';
import { useUsage } from '../contexts/UsageContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { sessionUsage, SESSION_LIMIT } = useUsage();
  const { profile, signOut } = useAuth();
  const usagePercentage = (sessionUsage / SESSION_LIMIT) * 100;
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 pt-4 pb-2">
      <div className="max-w-[1380px] mx-auto bg-white border-4 border-cartoon-dark rounded-3xl shadow-cartoon-lg transition-all duration-300">
        <div className="flex items-center justify-between h-16 px-6">
          
          <div className="flex items-center gap-4">
             <button
              onClick={onMenuClick}
              className="p-2 md:hidden rounded-xl border-2 border-cartoon-dark bg-cartoon-yellow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-cartoon-hover shadow-cartoon transition-all"
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>

            <div className="flex items-center gap-3 group cursor-pointer select-none">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-cartoon-blue border-2 border-cartoon-dark shadow-cartoon group-hover:rotate-6 transition-transform">
                <AppLogoIcon className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-cartoon-dark leading-none italic uppercase">
                  AFFILIATE <span className="text-cartoon-blue">GO</span>
                </span>
                <span className="text-[10px] font-black uppercase text-cartoon-blue/60 tracking-widest leading-none mt-1">by ARDAN</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl border-2 border-cartoon-dark bg-white hover:bg-slate-50 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-cartoon-hover shadow-cartoon transition-all flex items-center justify-center"
              title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>

            <div className="hidden sm:flex items-center gap-4">
              <div className="px-4 py-1.5 bg-cartoon-yellow border-2 border-cartoon-dark rounded-full shadow-cartoon transform -rotate-1 hidden lg:block">
                 <span className="text-xs font-black uppercase italic">ARDAN's Studio Edition</span>
              </div>
              
              {profile && (
                <div className="flex items-center gap-3 pl-4 border-l-2 border-slate-200">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-black text-cartoon-dark truncate max-w-[120px]">
                      {profile.displayName || profile.email.split('@')[0]}
                    </span>
                    <span className={`text-[8px] font-black uppercase px-1.5 rounded-full border border-cartoon-dark ${profile.role === 'admin' || profile.email === 'ahdanhqq1@gmail.com' ? 'bg-cartoon-orange text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {profile.role === 'admin' || profile.email === 'ahdanhqq1@gmail.com' ? 'admin' : profile.role}
                    </span>
                  </div>
                  <button 
                    onClick={signOut}
                    className="p-2 rounded-xl border-2 border-cartoon-dark bg-white hover:bg-red-50 hover:text-red-500 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-cartoon-hover shadow-cartoon transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
