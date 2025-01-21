import React, { useState } from 'react';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    adGroup: string;
    lastActive: string;
}

interface ModelAccess {
    modelId: string;
    modelName: string;
    provider: string;
    rateLimit: number; // requests per minute
}

interface Guardrail {
    id: string;
    name: string;
    type: 'content' | 'rate' | 'cost' | 'security';
    status: 'active' | 'disabled';
}

interface Team {
    id: string;
    name: string;
    adGroup: string;
    description: string;
    members: TeamMember[];
    modelAccess: ModelAccess[];
    guardrails: Guardrail[];
    createdAt: string;
    projectType: 'library' | 'chatbot' | 'ml' | 'data';
    defaultRateLimit: number;
}

const teams: Team[] = [
    {
        id: '1',
        name: 'Library Assistant Team',
        adGroup: 'LibraryAssistantADGroup',
        description: 'Team managing the Library Assistant AI implementation',
        members: [
            {
                id: '1',
                name: 'Sarah Connor',
                email: 'sarah@company.com',
                role: 'admin',
                adGroup: 'LibraryAssistantADGroup',
                lastActive: '1 hour ago'
            },
            {
                id: '2',
                name: 'Mike Ross',
                email: 'mike@company.com',
                role: 'member',
                adGroup: 'LibraryAssistantADGroup',
                lastActive: '3 hours ago'
            }
        ],
        modelAccess: [
            {
                modelId: '1',
                modelName: 'GPT-4',
                provider: 'OpenAI',
                rateLimit: 50
            },
            {
                modelId: '2',
                modelName: 'Claude 3',
                provider: 'Anthropic',
                rateLimit: 40
            }
        ],
        guardrails: [
            {
                id: '1',
                name: 'Content Filter',
                type: 'content',
                status: 'active'
            },
            {
                id: '2',
                name: 'Rate Limiting',
                type: 'rate',
                status: 'active'
            },
            {
                id: '3',
                name: 'PII Detection',
                type: 'security',
                status: 'active'
            }
        ],
        createdAt: '2024-01-01',
        projectType: 'library',
        defaultRateLimit: 100
    },
    {
        id: '2',
        name: 'Chatbot Team',
        adGroup: 'ConversationChatBot',
        description: 'Conversation Chatbot Development Team',
        members: [
            {
                id: '3',
                name: 'Rachel Green',
                email: 'rachel@company.com',
                role: 'admin',
                adGroup: 'ConversationChatBot',
                lastActive: '2 hours ago'
            },
            {
                id: '4',
                name: 'Ross Geller',
                email: 'ross@company.com',
                role: 'member',
                adGroup: 'ConversationChatBot',
                lastActive: '4 hours ago'
            }
        ],
        modelAccess: [
            {
                modelId: '1',
                modelName: 'GPT-4',
                provider: 'OpenAI',
                rateLimit: 60
            },
            {
                modelId: '3',
                modelName: 'PaLM 2',
                provider: 'Google',
                rateLimit: 45
            }
        ],
        guardrails: [
            {
                id: '2',
                name: 'Rate Limiting',
                type: 'rate',
                status: 'active'
            },
            {
                id: '4',
                name: 'Cost Control',
                type: 'cost',
                status: 'active'
            }
        ],
        createdAt: '2024-01-15',
        projectType: 'chatbot',
        defaultRateLimit: 100
    },
    {
        id: '3',
        name: 'ML Engineering',
        adGroup: 'ML_ENG_GROUP',
        description: 'Machine Learning Engineering Team',
        members: [
            {
                id: '5',
                name: 'John Doe',
                email: 'john@company.com',
                role: 'admin',
                adGroup: 'ML_ENG_GROUP',
                lastActive: '2 hours ago'
            },
            {
                id: '6',
                name: 'Jane Smith',
                email: 'jane@company.com',
                role: 'member',
                adGroup: 'ML_ENG_GROUP',
                lastActive: '1 day ago'
            }
        ],
        modelAccess: [
            {
                modelId: '1',
                modelName: 'GPT-4',
                provider: 'OpenAI',
                rateLimit: 100
            },
            {
                modelId: '2',
                modelName: 'Claude 3',
                provider: 'Anthropic',
                rateLimit: 80
            }
        ],
        guardrails: [
            {
                id: '2',
                name: 'Rate Limiting',
                type: 'rate',
                status: 'active'
            },
            {
                id: '4',
                name: 'Authentication',
                type: 'security',
                status: 'active'
            }
        ],
        createdAt: '2024-01-01',
        projectType: 'ml',
        defaultRateLimit: 150
    }
];

const TeamsOverview: React.FC = () => {
    const [selectedADGroup, setSelectedADGroup] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredTeams = teams.filter(team => {
        if (selectedADGroup && team.adGroup !== selectedADGroup) return false;
        if (searchQuery && !team.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Guardrails</h1>
                    <div className="flex items-center space-x-4">
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                            Import from AD
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                            Create Team
                        </button>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="mb-6">
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            placeholder="Search teams..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm flex-1"
                        />
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                            value={selectedADGroup}
                            onChange={(e) => setSelectedADGroup(e.target.value)}
                        >
                            <option value="">All AD Groups</option>
                            <option value="LibraryAssistantADGroup">Library Assistant</option>
                            <option value="ConversationChatBot">Conversation Chatbot</option>
                            <option value="ML_ENG_GROUP">ML Engineering</option>
                        </select>
                    </div>
                </div>

                {/* Teams Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTeams.map((team) => (
                        <div key={team.id} className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{team.description}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                                    <button className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 -mx-6 px-6 py-4">
                                <div className="text-sm text-gray-500 mb-2">AD Group</div>
                                <div className="text-sm font-medium text-gray-900">{team.adGroup}</div>
                            </div>

                            <div className="border-t border-gray-200 -mx-6 px-6 py-4">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-sm text-gray-500">Model Access</div>
                                    <button className="text-blue-600 hover:text-blue-700 text-sm">Manage</button>
                                </div>
                                <div className="space-y-2">
                                    {team.modelAccess.map((access) => (
                                        <div key={access.modelId} className="flex justify-between items-center">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
                                                {access.modelName}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {access.rateLimit} req/min
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-200 -mx-6 px-6 py-4">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-sm text-gray-500">Guardrails</div>
                                    <button className="text-blue-600 hover:text-blue-700 text-sm">Manage</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {team.guardrails.map((guardrail) => (
                                        <span
                                            key={guardrail.id}
                                            className={`px-2 py-1 text-xs rounded-full ${
                                                guardrail.type === 'security' ? 'bg-red-100 text-red-800' :
                                                    guardrail.type === 'rate' ? 'bg-blue-100 text-blue-800' :
                                                        guardrail.type === 'cost' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800'
                                            }`}
                                        >
                                            {guardrail.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-200 -mx-6 px-6 py-4">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-sm text-gray-500">Team Members</div>
                                    <button className="text-blue-600 hover:text-blue-700 text-sm">Add Member</button>
                                </div>
                                <div className="space-y-3">
                                    {team.members.map((member) => (
                                        <div key={member.id} className="flex justify-between items-center">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                                <div className="text-sm text-gray-500">{member.email}</div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    member.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {member.role}
                                                </span>
                                                <div className="text-xs text-gray-500">
                                                    Active {member.lastActive}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamsOverview;