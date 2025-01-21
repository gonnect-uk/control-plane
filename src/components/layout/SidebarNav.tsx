import React from "react";
import {NavItem} from "@/lib/types";

interface SidebarNavProps {
    activeRoute: string;
    onNavigate: (route: string) => void;
}

const navItems: NavItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: ({className}) => (
            <svg
                className={className}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
            </svg>
        ),
    },
    {
        id: "models",
        label: "Models",
        icon: ({className}) => (
            <svg
                className={className}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path
                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
        ),
    },
    {
        id: "guardrails",
        label: "Guardrails",
        icon: ({className}) => (
            <svg
                className={className}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
        ),
    },
    {
        id: "monitoring",
        label: "Monitoring",
        icon: ({className}) => (
            <svg
                className={className}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
        ),
    },
    {
        id: "teams",
        label: "Teams",
        icon: ({className}) => (
            <svg
                className={className}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
    },
    {
        id: "keys",
        label: "Key Management",
        icon: ({className}) => (
            <svg
                className={className}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path
                    d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
            </svg>
        ),
    },
    {
        id: "gcp-projects",
        label: "GCP Projects",
        icon: ({className}) => (
            <svg
                className={className}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
        ),
    },
    {
        id: "ai-chat",
        label: "AI Chat",
        icon: ({className}) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
        ),
    },
    ,
    {
        id: "moderator",
        label: "Content Moderator",
        icon: ({className}) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },

];

const SidebarNav: React.FC<SidebarNavProps> = ({activeRoute, onNavigate}) => {
    return (
        <div className="w-64 min-h-screen bg-white border-r border-gray-200">
            <div className="p-4">
                <button
                    onClick={() => onNavigate("new-request")}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    + New Request
                </button>
            </div>

            <nav className="space-y-1 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors
                ${
                                activeRoute === item.id
                                    ? "text-blue-600 bg-blue-50 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <Icon className="w-5 h-5 mr-3"/>
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default SidebarNav;