"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminAPI } from '@/lib/api';
import Link from 'next/link';

interface Analytics {
  totalUsers: number;
  totalScripts: number;
  pendingScripts: number;
  approvedScripts: number;
  totalExecutors: number;
  submissionsToday: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
}

interface Script {
  id: string;
  title: string;
  game: string;
  author: { username: string };
  status: string;
  isVerified: boolean;
  isBumped: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scripts' | 'users'>('dashboard');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    setLoading(true);
    const fetchTab = async () => {
      try {
        if (activeTab === 'dashboard') {
          const { data } = await adminAPI.getAnalytics();
          setAnalytics(data);
        } else if (activeTab === 'scripts') {
          const { data } = await adminAPI.getScripts();
          setScripts(data.scripts || []);
        } else if (activeTab === 'users') {
          const { data } = await adminAPI.getUsers();
          setUsers(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTab();
  }, [user, activeTab]);

  const handleScriptAction = async (id: string, action: 'approve' | 'reject' | 'verify' | 'bump') => {
    try {
      if (action === 'approve') await adminAPI.approveScript(id);
      if (action === 'reject') await adminAPI.rejectScript(id, 'Admin rejection');
      if (action === 'verify') await adminAPI.toggleVerified(id);
      if (action === 'bump') await adminAPI.toggleBumped(id);
      
      const { data } = await adminAPI.getScripts();
      setScripts(data.scripts || []);
    } catch {}
  };

  const handleUserAction = async (id: string, action: 'ban' | 'role', role?: string) => {
    try {
      if (action === 'ban') await adminAPI.toggleBan(id);
      if (action === 'role' && role) await adminAPI.updateRole(id, role);
      
      const { data } = await adminAPI.getUsers();
      setUsers(data);
    } catch {}
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⛔</div>
          <p className="text-red-500 mb-4 font-bold">Access Denied</p>
          <Link href="/" className="text-gray-400 hover:text-white underline">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#141414] border-r border-gray-900 flex flex-col flex-shrink-0">
        <div className="p-6">
          <h2 className="text-white font-black text-xl mb-1">Admin Panel</h2>
          <p className="text-red-500 text-xs font-bold uppercase tracking-wider">PROBESTHUB</p>
        </div>
        <div className="flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'scripts', label: '📝 Scripts Queue' },
            { id: 'users', label: '👥 Users' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-red-600/10 border border-red-600/30 text-red-400'
                  : 'text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {loading ? (
          <div className="text-gray-500 animate-pulse">Loading data...</div>
        ) : activeTab === 'dashboard' && analytics ? (
          <div>
            <h1 className="text-3xl font-black text-white mb-8 border-l-4 border-red-600 pl-4">Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: analytics.totalUsers, color: 'text-blue-400' },
                { label: 'Total Scripts', value: analytics.totalScripts, color: 'text-green-400' },
                { label: 'Pending Scripts', value: analytics.pendingScripts, color: 'text-yellow-400' },
                { label: 'Approved Scripts', value: analytics.approvedScripts, color: 'text-purple-400' },
              ].map(stat => (
                <div key={stat.label} className="bg-[#141414] rounded-2xl border border-gray-800 p-6">
                  <p className="text-gray-500 text-sm font-bold mb-2">{stat.label}</p>
                  <p className={`text-4xl font-black ${stat.color}`}>{stat.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'scripts' ? (
          <div>
            <h1 className="text-3xl font-black text-white mb-8 border-l-4 border-red-600 pl-4">Script Management</h1>
            <div className="bg-[#141414] rounded-2xl border border-gray-800 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1a1a1a] border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-bold">Script</th>
                    <th className="p-4 font-bold">Author</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Badges</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {scripts.map(script => (
                    <tr key={script.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white mb-1">{script.title}</div>
                        <div className="text-xs text-gray-500">{script.game}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-400">{script.author.username}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                          script.status === 'pending' ? 'bg-yellow-900/30 text-yellow-500' :
                          script.status === 'approved' ? 'bg-green-900/30 text-green-500' :
                          'bg-red-900/30 text-red-500'
                        }`}>
                          {script.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 space-x-2">
                        {script.status === 'approved' && (
                          <>
                            <button onClick={() => handleScriptAction(script.id, 'verify')} className={`text-xs px-2 py-1 rounded border transition-colors ${script.isVerified ? 'border-green-500 text-green-500' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                              Verify
                            </button>
                            <button onClick={() => handleScriptAction(script.id, 'bump')} className={`text-xs px-2 py-1 rounded border transition-colors ${script.isBumped ? 'border-red-500 text-red-500' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                              Bump
                            </button>
                          </>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <a href={`/scripts/${script.id}`} target="_blank" className="text-xs bg-[#222] hover:bg-[#333] text-white px-3 py-1.5 rounded transition-colors">View</a>
                        {script.status === 'pending' && (
                          <>
                            <button onClick={() => handleScriptAction(script.id, 'approve')} className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded transition-colors">Approve</button>
                            <button onClick={() => handleScriptAction(script.id, 'reject')} className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition-colors">Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-black text-white mb-8 border-l-4 border-red-600 pl-4">User Management</h1>
            <div className="bg-[#141414] rounded-2xl border border-gray-800 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1a1a1a] border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-bold">User</th>
                    <th className="p-4 font-bold">Role</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white mb-1">{u.username}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleUserAction(u.id, 'role', e.target.value)}
                          disabled={u.id === user._id}
                          className="bg-[#222] border border-gray-700 text-white text-xs rounded px-2 py-1 outline-none"
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                          u.isBanned ? 'bg-red-900/30 text-red-500' : 'bg-green-900/30 text-green-500'
                        }`}>
                          {u.isBanned ? 'BANNED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleUserAction(u.id, 'ban')}
                          disabled={u.id === user._id}
                          className={`text-xs px-3 py-1.5 rounded transition-colors disabled:opacity-30 ${
                            u.isBanned ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
                        >
                          {u.isBanned ? 'Unban' : 'Ban User'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
