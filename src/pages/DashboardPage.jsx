// src/pages/DashboardPage.jsx
import logo from '../assets/logo.png';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
    Target, 
    Repeat, 
    CheckSquare, 
    Library, 
    BookOpen, 
    LogOut, 
    ChevronsLeft, 
    ChevronsRight 
} from 'lucide-react';

// --- Placeholder View Components ---
// These would be in their own files, e.g., /src/components/dashboard/PlansView.jsx

const PlansView = () => (
    <div>
        <h1 className="text-4xl font-bold">My Plans</h1>
        <p className="mt-2 text-neutral-500">Your AI-generated roadmap to achieve your goals.</p>
        <div className="mt-8 p-8 border border-dashed border-neutral-700 rounded-lg bg-black">
            <h2 className="text-2xl font-bold text-white">Goal: Launch Synthara MVP</h2>
            <p className="text-neutral-400">Roadmap will be rendered here...</p>
        </div>
    </div>
);

const HabitsView = () => (
    <div>
        <h1 className="text-4xl font-bold">Habits</h1>
        <p className="mt-2 text-neutral-500">Track and build your daily routines.</p>
    </div>
);

const TodosView = () => (
    <div>
        <h1 className="text-4xl font-bold">To-Do List</h1>
        <p className="mt-2 text-neutral-500">Your daily tasks, automatically populated from your Plans.</p>
    </div>
);

const LibraryView = () => (
    <div>
        <h1 className="text-4xl font-bold">Library</h1>
        <p className="mt-2 text-neutral-500">Curated book summaries on productivity and growth.</p>
    </div>
);

const JournalView = () => (
    <div>
        <h1 className="text-4xl font-bold">Journal</h1>
        <p className="mt-2 text-neutral-500">Your private space for reflection.</p>
    </div>
);


// --- Sidebar Component ---
// This would ideally be in its own file, e.g., /src/components/layout/Sidebar.jsx

const Sidebar = ({ isCollapsed, toggleSidebar, activeView, setActiveView }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch {
            console.error("Failed to log out");
        }
    };
    
    const navItems = [
        { id: 'Plans', label: 'My Plans', icon: Target },
        { id: 'habits', label: 'Habits', icon: Repeat },
        { id: 'todos', label: 'To-Do List', icon: CheckSquare },
        { id: 'library', label: 'Library', icon: Library },
        { id: 'journal', label: 'Journal', icon: BookOpen },
    ];

    return (
        <aside className={`flex flex-col justify-between bg-black text-white p-4 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div>
                <div className="flex items-center gap-2 mb-10">
                    <div className="bg-white rounded p-1">
                      <img src={logo} alt="" className='h-8 w-8' />
                    </div>
                    {!isCollapsed && <h1 className="text-xl font-bold">Quorith</h1>}
                </div>

                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${activeView === item.id ? 'bg-white text-black' : 'hover:bg-zinc-800'}`}
                        >
                            <item.icon size={20} />
                            {!isCollapsed && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="border-t border-zinc-800 pt-4">
                 <div className="flex items-center gap-3 mb-4">
                    <img 
                        src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.email[0]}&background=ffffff&color=000000&bold=true`} 
                        alt="User" 
                        className="w-10 h-10 rounded-full" 
                    />
                    {!isCollapsed && (
                        <div>
                            <p className="font-semibold text-sm">{currentUser.displayName || currentUser.email}</p>
                        </div>
                    )}
                 </div>

                <button onClick={handleLogout} className="flex items-center w-full gap-4 p-3 rounded-lg hover:bg-zinc-800 transition-colors">
                    <LogOut size={20} />
                    {!isCollapsed && <span>Logout</span>}
                </button>

                <button onClick={toggleSidebar} className="flex items-center w-full gap-4 p-3 mt-2 rounded-lg hover:bg-zinc-800 transition-colors">
                    {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
                    {!isCollapsed && <span>Collapse</span>}
                </button>
            </div>
        </aside>
    );
};


// --- Main Dashboard Page Component ---

export default function DashboardPage() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [activeView, setActiveView] = useState('Plans'); // 'Plans' is the default view

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    const renderView = () => {
        switch (activeView) {
            case 'Plans':
                return <PlansView />;
            case 'habits':
                return <HabitsView />;
            case 'todos':
                return <TodosView />;
            case 'library':
                return <LibraryView />;
            case 'journal':
                return <JournalView />;
            default:
                return <PlansView />;
        }
    };

    return (
        <div className="flex h-screen bg-white text-black font-sans">
            <Sidebar 
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
                activeView={activeView}
                setActiveView={setActiveView}
            />
            <main className="flex-1 p-12 overflow-y-auto">
                {renderView()}
            </main>
        </div>
    );
}