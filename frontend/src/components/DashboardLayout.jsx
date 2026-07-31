import React, { createContext, useContext } from 'react';
import { LayoutDashboard, Activity, Brain, Settings, Bell, User, Sun, Moon, LogOut, UserCircle2 } from 'lucide-react';

export const ThemeContext = createContext(false);

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-colors ${active
            ? 'bg-primary/10 text-primary border-l-2 border-primary'
            : 'text-gray-400 hover:bg-surface hover:text-white'
            }`}
    >
        <Icon size={20} />
        <span className="font-medium text-sm">{label}</span>
    </button>
);

export const DashboardLayout = ({ children, activeTab, setActiveTab, authUser, onLogout }) => {
    const [isDarkMode, setIsDarkMode] = React.useState(true);

    React.useEffect(() => {
        // Check local storage or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);

        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <ThemeContext.Provider value={isDarkMode}>
            <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark bg-background text-white' : 'bg-background text-slate-900'}`}>
                {/* Sidebar */}
                <aside className={`w-64 border-r flex flex-col ${isDarkMode ? 'border-white/5 bg-black/40' : 'border-slate-200 bg-white/80 shadow-sm'}`}>
                <div className="p-6 flex items-center gap-2">
                    <Activity className="text-primary" />
                    <h1 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>SmartFactory</h1>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Overview"
                        active={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                    />
                    <SidebarItem
                        icon={Activity}
                        label="Virtual Simulator"
                        active={activeTab === 'simulator'}
                        onClick={() => setActiveTab('simulator')}
                    />
                    <SidebarItem
                        icon={Brain}
                        label="Decision Support"
                        active={activeTab === 'dss'}
                        onClick={() => setActiveTab('dss')}
                    />
                    <SidebarItem
                        icon={Brain}
                        label="Expert System"
                        active={activeTab === 'es'}
                        onClick={() => setActiveTab('es')}
                    />
                    <SidebarItem
                        icon={UserCircle2}
                        label="Profile"
                        active={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                    />
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        active={activeTab === 'settings'}
                        onClick={() => setActiveTab('settings')}
                    />
                </nav>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 flex flex-col overflow-hidden ${isDarkMode ? 'bg-transparent' : 'bg-white/70'}`}>
                {/* Header */}
                <header className={`h-16 border-b flex items-center justify-between px-6 backdrop-blur-sm ${isDarkMode ? 'border-white/5 bg-surface/30' : 'border-slate-200 bg-white/90'}`}>
                    <h2 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Manufacturing Intelligence</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className={`p-2 relative ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex items-center gap-3 rounded-full border px-3 py-2 transition-colors ${isDarkMode ? 'border-white/10 bg-black/20 hover:bg-black/30' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                        >
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                                {authUser?.profile_picture ? <img src={authUser.profile_picture} alt="Profile" className="h-8 w-8 rounded-full object-cover" /> : <User size={16} className="text-white" />}
                            </div>
                            <div className="text-left">
                                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{authUser?.full_name || 'User'}</p>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>{authUser?.role || 'Viewer'}</p>
                            </div>
                        </button>
                        <button
                            onClick={onLogout}
                            className={`p-2 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-auto p-6">
                    {children}
                </div>
            </main>
            </div>
        </ThemeContext.Provider>
    );
};
