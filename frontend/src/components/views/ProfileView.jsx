import React, { useState, useEffect, useContext } from 'react';
import { UserCircle2, Save, Camera, Lock, Phone, Mail, ShieldCheck } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import api from '../../api';

export const ProfileView = ({ authUser, onProfileUpdated }) => {
    const isDarkMode = useContext(ThemeContext);
    const [form, setForm] = useState({
        full_name: authUser?.full_name || '',
        email: authUser?.email || '',
        phone: authUser?.phone || '',
        profile_picture: authUser?.profile_picture || '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (authUser) {
            setForm({
                full_name: authUser?.full_name || '',
                email: authUser?.email || '',
                phone: authUser?.phone || '',
                profile_picture: authUser?.profile_picture || '',
                password: ''
            });
        }
    }, [authUser]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const payload = {
                full_name: form.full_name,
                phone: form.phone,
                profile_picture: form.profile_picture,
            };
            if (form.password) payload.password = form.password;

            const response = await api.put('/auth/profile', payload);
            const updatedUser = response.data;
            onProfileUpdated?.(updatedUser);
            setMessage({ type: 'success', text: 'Profile saved successfully.' });
        } catch (error) {
            setMessage({ type: 'error', text: error?.response?.data?.detail || 'Unable to save profile right now.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'border-white/10 bg-surface/70' : 'border-slate-200 bg-white shadow-sm'}`}>
                <div className="flex items-center gap-4">
                    <div className={`rounded-full p-3 ${isDarkMode ? 'bg-primary/10 text-primary' : 'bg-primary/10 text-primary'}`}>
                        <UserCircle2 size={28} />
                    </div>
                    <div>
                        <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>My Profile</h2>
                        <p className={isDarkMode ? 'text-gray-400' : 'text-slate-600'}>Update your personal details and account access.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={`rounded-2xl border p-6 space-y-6 ${isDarkMode ? 'border-white/10 bg-surface/70' : 'border-slate-200 bg-white shadow-sm'}`}>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex flex-col items-center gap-3">
                        {form.profile_picture ? (
                            <img src={form.profile_picture} alt="Profile" className="h-24 w-24 rounded-full object-cover border border-white/10" />
                        ) : (
                            <div className={`flex h-24 w-24 items-center justify-center rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-slate-100'}`}>
                                <UserCircle2 size={40} className={isDarkMode ? 'text-gray-400' : 'text-slate-500'} />
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-primary">
                            <Camera size={16} />
                            <span>Profile preview</span>
                        </div>
                    </div>

                    <div className="flex-1 grid gap-4 md:grid-cols-2">
                        <label className="space-y-2">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Full name</span>
                            <input name="full_name" value={form.full_name} onChange={handleChange} className={`w-full rounded-lg border px-3 py-2 outline-none ${isDarkMode ? 'border-white/10 bg-black/20 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
                        </label>
                        <label className="space-y-2">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Email</span>
                            <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${isDarkMode ? 'border-white/10 bg-black/20 text-gray-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                                <Mail size={16} />
                                <span>{form.email}</span>
                            </div>
                        </label>
                        <label className="space-y-2">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Phone</span>
                            <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${isDarkMode ? 'border-white/10 bg-black/20 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
                                <Phone size={16} />
                                <input name="phone" value={form.phone} onChange={handleChange} className="w-full bg-transparent outline-none" placeholder="Add phone number" />
                            </div>
                        </label>
                        <label className="space-y-2">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Profile picture URL</span>
                            <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${isDarkMode ? 'border-white/10 bg-black/20 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
                                <Camera size={16} />
                                <input name="profile_picture" value={form.profile_picture} onChange={handleChange} className="w-full bg-transparent outline-none" placeholder="https://..." />
                            </div>
                        </label>
                    </div>
                </div>

                <div className={`rounded-xl border p-4 ${isDarkMode ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <Lock size={16} />
                        <span>Change password</span>
                    </div>
                    <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Leave it blank to keep your current password.</p>
                    <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="New password" className={`mt-3 w-full rounded-lg border px-3 py-2 outline-none ${isDarkMode ? 'border-white/10 bg-black/20 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
                </div>

                {message && (
                    <div className={`rounded-lg border px-4 py-3 text-sm ${message.type === 'success' ? (isDarkMode ? 'border-success/30 bg-success/10 text-success' : 'border-success/20 bg-success/10 text-success') : (isDarkMode ? 'border-danger/30 bg-danger/10 text-danger' : 'border-danger/20 bg-danger/10 text-danger')}`}>
                        {message.text}
                    </div>
                )}

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                        <ShieldCheck size={16} className="text-primary" />
                        <span>Role: {authUser?.role || 'viewer'}</span>
                    </div>
                    <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60">
                        <Save size={16} />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};
