import React from 'react';
import type { APIKey } from '@/lib/types';

const apiKeys: APIKey[] = [
    {
        id: '1',
        name: 'ML Engineering Production Key',
        prefix: 'pk_live_',
        createdBy: 'John Doe',
        createdAt: '2024-01-15',
        expiresAt: '2025-01-15',
        lastUsed: '2 minutes ago',
        status: 'active',
        environment: 'production',
        adGroup: {
            id: 'ml_eng_1',
            name: 'ML_ENG_GROUP',
            description: 'Machine Learning Engineering Team'
        },
        permissions: ['model.invoke', 'model.list', 'model.read']
    },
    {
        id: '2',
        name: 'Data Science Staging Key',
        prefix: 'pk_staging_',
        createdBy: 'Jane Smith',
        createdAt: '2024-01-10',
        expiresAt: '2024-07-10',
        lastUsed: '1 hour ago',
        status: 'active',
        environment: 'staging',
        adGroup: {
            id: 'data_sci_1',
            name: 'DATA_SCIENCE_GROUP',
            description: 'Data Science Team'
        },
        permissions: ['model.invoke', 'model.read']
    },
    {
        id: '3',
        name: 'Development Testing Key',
        prefix: 'pk_dev_',
        createdBy: 'Bob Wilson',
        createdAt: '2024-01-05',
        expiresAt: '2024-04-05',
        lastUsed: '3 days ago',
        status: 'active',
        environment: 'development',
        adGroup: {
            id: 'dev_team_1',
            name: 'DEV_TEAM_GROUP',
            description: 'Development Team'
        },
        permissions: ['model.invoke']
    }
];

const KeyManagementOverview = () => {
    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Key Management</h1>
                    <div className="flex items-center space-x-4">
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                            Import Keys
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                            Create New Key
                        </button>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="mb-6">
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            placeholder="Search keys..."
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm flex-1"
                        />
                        <select className="px-4 py-2 border border-gray-300 rounded-md text-sm">
                            <option value="">All AD Groups</option>
                            <option value="ML_ENG_GROUP">ML Engineering</option>
                            <option value="DATA_SCIENCE_GROUP">Data Science</option>
                            <option value="DEV_TEAM_GROUP">Development</option>
                        </select>
                        <select className="px-4 py-2 border border-gray-300 rounded-md text-sm">
                            <option value="">All Environments</option>
                            <option value="production">Production</option>
                            <option value="staging">Staging</option>
                            <option value="development">Development</option>
                        </select>
                    </div>
                </div>

                {/* API Keys Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                AD Group
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Environment
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Permissions
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last Used
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Expires
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {apiKeys.map((key) => (
                            <tr key={key.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{key.name}</div>
                                    <div className="text-sm text-gray-500">{key.prefix}***</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{key.adGroup.name}</div>
                                    <div className="text-sm text-gray-500">{key.adGroup.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${key.environment === 'production' ? 'bg-red-100 text-red-800' :
                        key.environment === 'staging' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'}`}>
                      {key.environment}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${key.status === 'active' ? 'bg-green-100 text-green-800' :
                        key.status === 'expired' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}>
                      {key.status}
                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {key.permissions.map((permission) => (
                                            <span key={permission} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {permission}
                        </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {key.lastUsed}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {key.expiresAt}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 mr-4">Rotate</button>
                                    <button className="text-red-600 hover:text-red-900">Revoke</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default KeyManagementOverview;