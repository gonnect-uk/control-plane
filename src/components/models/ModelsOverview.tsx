import React from 'react';

interface Model {
    id: string;
    name: string;
    provider: string;
    type: string;
    latency: string;
    status: 'active' | 'inactive';
    lastUpdated: string;
    costPer1k: string;
}

const models: Model[] = [
    {
        id: '1',
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        type: 'Chat Completion',
        latency: '250ms',
        status: 'active',
        lastUpdated: '2024-01-15',
        costPer1k: '$0.01'
    },
    {
        id: '2',
        name: 'Claude 3',
        provider: 'Anthropic',
        type: 'Chat Completion',
        latency: '180ms',
        status: 'active',
        lastUpdated: '2024-01-20',
        costPer1k: '$0.015'
    },
    {
        id: '3',
        name: 'PaLM 2',
        provider: 'Google',
        type: 'Text Generation',
        latency: '200ms',
        status: 'active',
        lastUpdated: '2024-01-10',
        costPer1k: '$0.008'
    },
    {
        id: '4',
        name: 'Gemini Pro',
        provider: 'Google',
        type: 'Multimodal',
        latency: '220ms',
        status: 'active',
        lastUpdated: '2024-01-18',
        costPer1k: '$0.012'
    },
    {
        id: '5',
        name: 'Llama 2',
        provider: 'Meta',
        type: 'Text Generation',
        latency: '150ms',
        status: 'inactive',
        lastUpdated: '2023-12-28',
        costPer1k: '$0.005'
    }
];

const ModelsOverview = () => {
    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Models</h1>
                    <div className="flex items-center space-x-4">
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                            Import Model
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                            Add New Model
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Search models..."
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm w-64"
                    />
                    <select className="px-4 py-2 border border-gray-300 rounded-md text-sm">
                        <option value="">All Providers</option>
                        <option value="openai">OpenAI</option>
                        <option value="anthropic">Anthropic</option>
                        <option value="google">Google</option>
                        <option value="meta">Meta</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-md text-sm">
                        <option value="">All Types</option>
                        <option value="chat">Chat Completion</option>
                        <option value="text">Text Generation</option>
                        <option value="multimodal">Multimodal</option>
                    </select>
                </div>

                {/* Models Table */}
                <div className="bg-white rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Model
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Provider
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Latency
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Updated
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cost/1K tokens
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {models.map((model) => (
                                <tr key={model.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{model.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{model.provider}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{model.type}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{model.latency}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${model.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'}`}>
                        {model.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{model.lastUpdated}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{model.costPer1k}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                        <button className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelsOverview;