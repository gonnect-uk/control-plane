// src/components/layout/Layout.tsx
import React, { useState } from 'react';
import SidebarNav from './SidebarNav';
import Header from './Header';
import GCPDashboard from '../dashboard/GCPDashboard';
import RegistrationForm from '../forms/RegistrationForm';
import Dashboard from '../dashboard/Dashboard';
import ModelsOverview from '../models/ModelsOverview';
import GuardrailsOverview from '../guardrails/GuardrailsOverview';
import MonitoringOverview from '../monitoring/MonitoringOverview';
import TeamsOverview from '../teams/TeamsOverview';
import KeyManagementOverview from '../keymanagement/KeyManagementOverview';
import ChatInterface from '../chat/ChatInterface';
import ModeratorBot from '../chat/ModeratorBot';

const Layout = () => {
    const [currentRoute, setCurrentRoute] = useState('dashboard');

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="flex h-[calc(100vh-64px)]">
                <SidebarNav
                    activeRoute={currentRoute}
                    onNavigate={setCurrentRoute}
                />

                <main className="flex-1 overflow-auto">
                    {currentRoute === 'dashboard' && <Dashboard />}
                    {currentRoute === 'ai-chat' && <ChatInterface />}
                    {currentRoute === 'gcp-projects' && <GCPDashboard />}
                    {currentRoute === 'new-request' && <RegistrationForm />}
                    {currentRoute === 'models' && <ModelsOverview />}
                    {currentRoute === 'guardrails' && <GuardrailsOverview />}
                    {currentRoute === 'monitoring' && <MonitoringOverview />}
                    {currentRoute === 'teams' && <TeamsOverview />}
                    {currentRoute === 'keys' && <KeyManagementOverview />}
                    {currentRoute === 'moderator' && <ModeratorBot />}
                    {!['dashboard', 'gcp-projects', 'new-request', 'models', 'guardrails', 'monitoring', 'teams', 'keys', 'ai-chat', 'moderator'].includes(currentRoute) && (
                        <div className="p-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                {currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1)}
                            </h2>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Layout;