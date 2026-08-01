import React, { useState, useContext } from 'react';
import { Settings, Save, AlertTriangle, CheckCircle, UserCircle2, Phone, Mail } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { Modal } from '../common/Modal';

export const SettingsView = ({ authUser }) => {
    const isDarkMode = useContext(ThemeContext);
    const [modal, setModal] = useState({ type: null, isOpen: false });

    const handleReset = () => {
        setModal({ type: 'reset', isOpen: true });
    };

    const handleSave = () => {
        setModal({ type: 'save', isOpen: true });
    };

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
    };

    const confirmReset = () => {
        window.location.reload();
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <Modal
                isOpen={modal.isOpen && modal.type === 'reset'}
                onClose={closeModal}
                title="Confirm System Reset"
            >
                <div className="space-y-4">
                    <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg flex gap-3">
                        <AlertTriangle className="text-warning flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-warning mb-1">Warning: Destructive Action</h4>
                            <p className="text-sm text-gray-300">
                                This will restore all system configurations to their factory defaults.
                                Current simulation parameters and custom thresholds will be lost.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
                        <button onClick={confirmReset} className="px-4 py-2 text-sm bg-danger text-white rounded-lg hover:bg-danger/90">Yes, Reset System</button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={modal.isOpen && modal.type === 'save'}
                onClose={closeModal}
                title="Configuration Saved"
            >
                <div className="space-y-4">
                    <div className="flex flex-col items-center py-4 text-center">
                        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center text-success mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">Settings Updated Successfully</h4>
                        <p className="text-gray-400">Your new system parameters have been applied to the active simulation engine.</p>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4 border border-white/5 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Simulation Speed</span>
                            <span className="text-white">Real-time (1x)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Data Retention</span>
                            <span className="text-white">24 Hours</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Thresholds</span>
                            <span className="text-success">Updated</span>
                        </div>
                    </div>

                    <div className="flex justify-center pt-2">
                        <button onClick={closeModal} className="px-6 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">OK, Continue</button>
                    </div>
                </div>
            </Modal>

            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <div className="p-3 bg-white/10 rounded-full">
                    <Settings size={32} className={isDarkMode ? 'text-white' : 'text-slate-900'} />
                </div>
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>System Settings</h2>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-slate-600'}>Configure simulation parameters and thresholds</p>
                </div>
            </div>

            <div className={`rounded-xl border p-5 ${isDarkMode ? 'border-white/10 bg-surface' : 'border-slate-200 bg-white shadow-sm'}`}>
                <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${isDarkMode ? 'bg-primary/10 text-primary' : 'bg-primary/10 text-primary'}`}>
                        <UserCircle2 size={22} />
                    </div>
                    <div>
                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{authUser?.full_name || 'Signed in user'}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{authUser?.email || 'No email available'}</p>
                    </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${isDarkMode ? 'border-white/10 bg-black/20 text-gray-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                        <Mail size={16} className="text-primary" />
                        <span>{authUser?.email || '—'}</span>
                    </div>
                    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${isDarkMode ? 'border-white/10 bg-black/20 text-gray-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                        <Phone size={16} className="text-primary" />
                        <span>{authUser?.phone || 'No phone added yet'}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-surface border border-white/5 rounded-xl p-6 space-y-6">
                    <h3 className="text-lg font-medium text-white">Simulation Parameters</h3>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Simulation Speed</label>
                            <select className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
                                <option>Real-time (1x)</option>
                                <option>Fast (5x)</option>
                                <option>Hyper (10x)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Data Retention</label>
                            <select className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
                                <option>24 Hours</option>
                                <option>7 Days</option>
                                <option>30 Days</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-surface border border-white/5 rounded-xl p-6 space-y-6">
                    <h3 className="text-lg font-medium text-white">Expert System Thresholds</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="flex justify-between text-sm text-gray-400 mb-2">
                                <span>Vibration Warning Threshold</span>
                                <span>80 Hz</span>
                            </label>
                            <input type="range" className="w-full bg-white/10 h-2 rounded-lg appearance-none cursor-pointer accent-warning" />
                        </div>
                        <div>
                            <label className="flex justify-between text-sm text-gray-400 mb-2">
                                <span>Temperature Critical Limit</span>
                                <span>95 °C</span>
                            </label>
                            <input type="range" className="w-full bg-white/10 h-2 rounded-lg appearance-none cursor-pointer accent-danger" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleReset}
                        className="px-6 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
