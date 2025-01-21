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
    rateLimit: number;
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
}

const teams: Team[] = [
    {
        id: '1',
        name: 'ML Engineering',
        adGroup: 'ML_ENG_GROUP',
        description: 'Machine Learning Engineering Team',
        members: [
            {
                id: '1',
                name: 'John Doe',
                email: 'john@company.com',
                role: 'admin',
                adGroup: 'ML_ENG_GROUP',
                lastActive: 'Active 2 hours ago'
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@company.com',
                role: 'member',
                adGroup: 'ML_ENG_GROUP',
                lastActive: 'Active 1 day ago'
            }
        ],
        modelAccess: [
            { modelId: '1', modelName: 'GPT-4', provider: 'OpenAI', rateLimit: 100 },
            { modelId: '2', modelName: 'Claude 3', provider: 'Anthropic', rateLimit: 80 }
        ],
        guardrails: [
            { id: '1', name: 'Rate Limiting', type: 'rate', status: 'active' },
            { id: '2', name: 'Content Filter', type: 'content', status: 'active' }
        ],
        createdAt: '2024-01-01'
    },
    {
        id: '2',
        name: 'Data Science',
        adGroup: 'DATA_SCIENCE_GROUP',
        description: 'Data Science and Analytics Team',
        members: [
            {
                id: '3',
                name: 'Alice Brown',
                email: 'alice@company.com',
                role: 'admin',
                adGroup: 'DATA_SCIENCE_GROUP',
                lastActive: 'Active 5 hours ago'
            },
            {
                id: '4',
                name: 'Bob Wilson',
                email: 'bob@company.com',
                role: 'member',
                adGroup: 'DATA_SCIENCE_GROUP',
                lastActive: 'Active 3 hours ago'
            }
        ],
        modelAccess: [
            { modelId: '1', modelName: 'GPT-4', provider: 'OpenAI', rateLimit: 80 },
            { modelId: '3', modelName: 'PaLM 2', provider: 'Google', rateLimit: 60 }
        ],
        guardrails: [
            { id: '1', name: 'Rate Limiting', type: 'rate', status: 'active' },
            { id: '3', name: 'Cost Control', type: 'cost', status: 'active' }
        ],
        createdAt: '2024-01-15'
    },
    {
        id: '3',
        name: 'Library Assistant',
        adGroup: 'LibraryAssistantADGroup',
        description: 'Library Assistant AI Implementation Team',
        members: [],
        modelAccess: [
            { modelId: '1', modelName: 'GPT-4', provider: 'OpenAI', rateLimit: 50 }
        ],
        guardrails: [
            { id: '1', name: 'Rate Limiting', type: 'rate', status: 'active' },
            { id: '2', name: 'Content Filter', type: 'content', status: 'active' }
        ],
        createdAt: '2024-01-20'
    },
    {
        id: '4',
        name: 'Chatbot',
        adGroup: 'ConversationChatBot',
        description: 'Conversation Chatbot Development Team',
        members: [],
        modelAccess: [
            { modelId: '1', modelName: 'GPT-4', provider: 'OpenAI', rateLimit: 60 }
        ],
        guardrails: [
            { id: '1', name: 'Rate Limiting', type: 'rate', status: 'active' },
            { id: '4', name: 'PII Detection', type: 'security', status: 'active' }
        ],
        createdAt: '2024-01-20'
    }
];

const TeamsOverview: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedADGroup, setSelectedADGroup] = useState('');

    const filteredTeams = teams.filter(team => {
        if (selectedADGroup && team.adGroup !== selectedADGroup) return false;
        if (searchQuery && !team.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Teams</h1>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                                Import from AD
                            </button>
                            <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                Create Team
                            </button>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="mt-6 flex gap-4">
                        <input
                            type="text"
                            placeholder="Search teams..."
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-md text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm min-w-[200px]"
                            value={selectedADGroup}
                            onChange={(e) => setSelectedADGroup(e.target.value)}
                        >
                            <option value="">All AD Groups</option>
                            <option value="ML_ENG_GROUP">ML Engineering</option>
                            <option value="DATA_SCIENCE_GROUP">Data Science</option>
                            <option value="LibraryAssistantADGroup">Library Assistant</option>
                            <option value="ConversationChatBot">Chatbot</option>
                        </select>
                    </div>
                </div>

                {/* Teams List */}
                <div className="mt-6 space-y-6">
                    {filteredTeams.map(team => (
                        <div key={team.id} className="bg-white border-t border-gray-200 pt-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">{team.name}</h2>
                                    <p className="text-sm text-gray-500">{team.description}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                                    <button className="text-red-600 hover:text-red-800">Delete</button>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-sm text-gray-500">AD Group</h3>
                                <p className="mt-1 text-sm font-medium text-gray-900">{team.adGroup}</p>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm text-gray-500">Model Access</h3>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm">Manage</button>
                                </div>
                                <div className="mt-2 flex gap-2">
                                    {team.modelAccess.map(model => (
                                        <span key={model.modelId} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                                            {model.modelName}
                                            {model.rateLimit && <span className="ml-1 text-xs text-blue-600">({model.rateLimit}/min)</span>}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm text-gray-500">Team Members</h3>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm">Add Member</button>
                                </div>
                                <div className="mt-2 space-y-3">
                                    {team.members.map(member => (
                                        <div key={member.id} className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                                <p className="text-sm text-gray-500">{member.email}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${member.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {member.role}
                                                </span>
                                                <span className="text-sm text-gray-500">{member.lastActive}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {team.guardrails.length > 0 && (
                                <div className="mt-4 pb-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm text-gray-500">Guardrails</h3>
                                        <button className="text-blue-600 hover:text-blue-800 text-sm">Manage</button>
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        {team.guardrails.map(guardrail => (
                                            <span key={guardrail.id} className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium
                                                ${guardrail.type === 'rate' ? 'bg-blue-100 text-blue-800' :
                                                guardrail.type === 'content' ? 'bg-green-100 text-green-800' :
                                                    guardrail.type === 'security' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {guardrail.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamsOverview;