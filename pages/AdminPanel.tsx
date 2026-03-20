import React, { useEffect, useState } from 'react';
import { db, onSnapshot, doc, updateDoc, collection, query, orderBy } from '../firebase';
import { Check, X, User as UserIcon, Shield, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  isApproved: boolean;
  role: 'admin' | 'user';
  createdAt: any;
}

export const AdminPanel: React.FC = () => {
  const { profile, user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdminEmail = user?.email === 'ahdanhqq1@gmail.com' || profile?.email === 'ahdanhqq1@gmail.com';

  useEffect(() => {
    if (!profile && !isAdminEmail) return;
    if (profile?.role !== 'admin' && !isAdminEmail) return;

    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => doc.data() as UserProfile);
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile, isAdminEmail]);

  const toggleApproval = async (uid: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        isApproved: !currentStatus
      });
    } catch (error) {
      console.error('Error updating approval:', error);
      alert('Gagal memperbarui status. Pastikan Anda memiliki akses admin.');
    }
  };

  const toggleRole = async (uid: string, currentRole: string) => {
    if (uid === profile?.uid) {
      alert('Anda tidak bisa mengubah role Anda sendiri!');
      return;
    }
    try {
      await updateDoc(doc(db, 'users', uid), {
        role: currentRole === 'admin' ? 'user' : 'admin'
      });
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Gagal memperbarui role.');
    }
  };

  if (profile?.role !== 'admin' && !isAdminEmail) {
    return (
      <div className="p-8 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Akses Ditolak</h1>
        <p>Hanya admin yang dapat mengakses halaman ini.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-cartoon-blue rounded-2xl border-4 border-cartoon-dark shadow-cartoon">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-cartoon-dark uppercase italic">Admin Panel</h1>
          <p className="text-slate-500 font-bold">Kelola Pengguna & Persetujuan</p>
        </div>
      </div>

      <div className="bg-white border-4 border-cartoon-dark rounded-[2.5rem] shadow-cartoon-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-4 border-cartoon-dark">
                <th className="p-4 font-black text-cartoon-dark uppercase text-xs">User</th>
                <th className="p-4 font-black text-cartoon-dark uppercase text-xs">Email</th>
                <th className="p-4 font-black text-cartoon-dark uppercase text-xs">Role</th>
                <th className="p-4 font-black text-cartoon-dark uppercase text-xs">Status</th>
                <th className="p-4 font-black text-cartoon-dark uppercase text-xs">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uid} className="border-b-2 border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full border-2 border-cartoon-dark" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center border-2 border-cartoon-dark">
                          <UserIcon className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                      <span className="font-bold text-cartoon-dark">{user.displayName || 'No Name'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-medium">{user.email}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleRole(user.uid, user.role)}
                      className={`px-3 py-1 rounded-full text-xs font-black border-2 border-cartoon-dark shadow-cartoon-hover uppercase ${
                        user.role === 'admin' ? 'bg-cartoon-orange text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {user.role}
                    </button>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border-2 border-cartoon-dark ${
                      user.isApproved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.isApproved ? 'APPROVED' : 'PENDING'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleApproval(user.uid, user.isApproved)}
                      className={`p-2 rounded-xl border-2 border-cartoon-dark shadow-cartoon hover:shadow-cartoon-hover transition-all ${
                        user.isApproved ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                      }`}
                      title={user.isApproved ? 'Revoke Approval' : 'Approve User'}
                    >
                      {user.isApproved ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
