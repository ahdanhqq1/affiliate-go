
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, AlertTriangle, X, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGoToSettings: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onGoToSettings }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-gray-900 border-4 border-cartoon-dark rounded-[2.5rem] shadow-cartoon-lg overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-cartoon-yellow rounded-2xl border-4 border-cartoon-dark shadow-cartoon">
                                    <AlertTriangle className="w-8 h-8 text-cartoon-dark" />
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <h2 className="text-2xl font-black text-cartoon-dark dark:text-white uppercase italic mb-4 tracking-tight">API Key Belum Diatur!</h2>
                            
                            <p className="text-slate-600 dark:text-slate-400 font-bold mb-6 leading-relaxed">
                                Waduh! Sepertinya Anda lupa memasukkan <span className="text-cartoon-blue">Gemini API Key</span>. 
                                Fitur ini memerlukan API Key untuk dapat bekerja.
                            </p>

                            <div className="space-y-4">
                                <button
                                    onClick={onGoToSettings}
                                    className="w-full py-4 bg-cartoon-blue text-white font-black rounded-2xl border-4 border-cartoon-dark shadow-cartoon hover:shadow-cartoon-hover transition-all uppercase italic flex items-center justify-center gap-3"
                                >
                                    <Key className="w-5 h-5" />
                                    Atur di Pengaturan
                                </button>
                                
                                <a 
                                    href="https://aistudio.google.com/app/apikey" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full py-4 bg-white dark:bg-slate-800 text-cartoon-dark dark:text-white font-black rounded-2xl border-4 border-cartoon-dark shadow-cartoon hover:shadow-cartoon-hover transition-all uppercase italic flex items-center justify-center gap-3"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    Dapatkan Key Gratis
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
