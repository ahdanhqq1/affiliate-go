
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from '../firebase';
import { FeatureHeader } from '../components/FeatureHeader';
import { ZoomModal } from '../components/ZoomModal';
import { Download, Trash2, Eye, Calendar, Tag, Sparkles, ImageIcon } from '../components/icons/LucideIcons';
import { motion, AnimatePresence } from 'framer-motion';

interface Enhancement {
  id: string;
  docId: string;
  userId: string;
  originalImageUrl: string;
  enhancedImageUrl: string;
  prompt: string;
  method: string;
  createdAt: any;
}

export const History: React.FC = () => {
  const { user } = useAuth();
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'enhancements'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        docId: doc.id
      })) as Enhancement[];
      setEnhancements(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (docId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus riwayat ini?')) {
      try {
        await deleteDoc(doc(db, 'enhancements', docId));
      } catch (error) {
        console.error('Error deleting enhancement:', error);
      }
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full">
      <FeatureHeader 
        title="Riwayat Go" 
        description="Lihat kembali semua hasil sulap foto produk Anda di sini."
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Memuat Riwayat...</p>
        </div>
      ) : enhancements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-gray-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10">
          <ImageIcon className="w-20 h-20 text-slate-300 mb-4 opacity-20" />
          <h3 className="text-xl font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Belum Ada Riwayat</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-tight mt-2">Mulai buat konten pertama Anda!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {enhancements.map((item) => (
              <motion.div 
                key={item.docId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-900/80 rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-black/20">
                  <img 
                    src={item.enhancedImageUrl} 
                    alt={item.method}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button 
                      onClick={() => { setSelectedImage(item.enhancedImageUrl); setIsZoomModalOpen(true); }}
                      className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all shadow-lg"
                    >
                      <Eye className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => handleDownload(item.enhancedImageUrl, `${item.method}-${item.id}.png`)}
                      className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all shadow-lg"
                    >
                      <Download className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.docId)}
                      className="p-3 bg-red-500/80 backdrop-blur-md text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-full shadow-lg flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> {item.method}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Calendar className="w-3 h-3" /> {formatDate(item.createdAt)}
                  </div>
                  <div className="bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      <Tag className="w-2.5 h-2.5" /> Prompt
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 italic leading-relaxed">
                      "{item.prompt}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ZoomModal 
        isOpen={isZoomModalOpen} 
        onClose={() => setIsZoomModalOpen(false)} 
        imageUrl={selectedImage || ''} 
      />
    </div>
  );
};

export default History;
