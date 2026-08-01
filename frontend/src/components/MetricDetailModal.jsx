import React from 'react';
import { Modal } from './common/Modal';
import { AlertTriangle, XCircle, Zap, Activity } from 'lucide-react';

export const MetricDetailModal = ({ isOpen, onClose, metricType, stats, data, machineList }) => {
    if (!isOpen || !metricType) return null;

    const renderContent = () => {
        switch (metricType) {
            case 'production': {
                const offMachines = machineList?.filter(m => m.status === 'OFF') || [];
                return (
                    <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                        <div className="bg-surface border border-white/5 rounded-xl p-6">
                            <h4 className="text-lg font-bold text-white mb-2">Production Analysis</h4>
                            <p className="text-gray-400">
                                Production Output is currently at <span className="text-white font-bold">{stats.production.value}%</span> calculated based on the ratio of active machines to total capacity.
                            </p>
                            <div className="mt-4 flex items-center gap-3 p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger">
                                <XCircle size={20} />
                                <span className="font-medium">{offMachines.length} Machine(s) are currently OFF</span>
                            </div>
                        </div>

                        <div>
                            <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Offline Units Impacting Output</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {offMachines.length > 0 ? offMachines.map(m => (
                                    <div key={m.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                        <span className="font-mono text-white">{m.id}</span>
                                        <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">Stopped</span>
                                    </div>
                                )) : (
                                    <p className="text-gray-500 italic">All machines are currently operating.</p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            }

            case 'energy': {
                const criticalMachines = machineList?.filter(m => m.condition === 'Critical') || [];
                const warningMachines = machineList?.filter(m => m.condition === 'Below Normal') || [];
                return (
                    <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                        <div className="bg-surface border border-white/5 rounded-xl p-6">
                            <h4 className="text-lg font-bold text-white mb-2">Energy Efficiency Analysis</h4>
                            <p className="text-gray-400">
                                Current Efficiency: <span className="text-white font-bold">{stats.energy.value}%</span>.
                                This score is penalized by machines operating in critical or suboptimal conditions, drawing excess power.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl">
                                <div className="text-2xl font-bold text-danger mb-1">{criticalMachines.length}</div>
                                <div className="text-sm text-danger/80">Critical Units</div>
                                <div className="text-xs text-danger/60 mt-1">High Power Draw</div>
                            </div>
                            <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl">
                                <div className="text-2xl font-bold text-warning mb-1">{warningMachines.length}</div>
                                <div className="text-sm text-warning/80">Suboptimal Units</div>
                                <div className="text-xs text-warning/60 mt-1">Moderate Waste</div>
                            </div>
                        </div>

                        <div>
                            <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Top Inefficient Contributors</h5>
                            <div className="space-y-2">
                                {[...criticalMachines, ...warningMachines].slice(0, 50).map(m => (
                                    <div key={m.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Zap size={16} className={m.condition === 'Critical' ? 'text-danger' : 'text-warning'} />
                                            <span className="font-mono text-white">{m.id}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded ${m.condition === 'Critical' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'}`}>
                                            {m.condition}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            }

            case 'alerts': {
                const criticalAlerts = data.alerts.filter(a => a.confidence > 0.9);
                return (
                    <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                        <div className="bg-surface border border-white/5 rounded-xl p-6">
                            <h4 className="text-lg font-bold text-white mb-2">Active Alerts Summary</h4>
                            <p className="text-gray-400">
                                Expert System has identified <span className="text-white font-bold">{data.overview.active_alerts}</span> anomalies pattern-matched against 200+ rules.
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Critical Priority Queue</h5>
                                <span className="text-xs bg-danger/20 text-danger px-2 py-1 rounded-full">{criticalAlerts.length} Urgent</span>
                            </div>
                            <div className="space-y-3">
                                {criticalAlerts.map((alert, idx) => (
                                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-danger/50 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle size={16} className="text-danger" />
                                                <span className="font-mono text-white font-bold">{alert.machine_id}</span>
                                            </div>
                                            <span className="text-xs text-gray-500">Confidence: {Math.round(alert.confidence * 100)}%</span>
                                        </div>
                                        <p className="text-sm text-gray-300 font-medium mb-1">{alert.condition}</p>
                                        <p className="text-xs text-gray-500">{alert.reasoning}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            }

            default: return null;
        }
    };

    const getTitle = () => {
        switch (metricType) {
            case 'production': return 'Production Output Breakdown';
            case 'energy': return 'Energy Efficiency Analysis';
            case 'alerts': return 'Active Alerts Details';
            default: return 'Metric Details';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={getTitle()}
            maxWidth="max-w-2xl"
        >
            {renderContent()}
        </Modal>
    );
};
