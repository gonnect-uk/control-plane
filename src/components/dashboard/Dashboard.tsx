import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const requestVolumeData = [
    { name: '00:00', value: 5200 },
    { name: '04:00', value: 4800 },
    { name: '08:00', value: 6100 },
    { name: '12:00', value: 8500 },
    { name: '16:00', value: 7800 },
    { name: '20:00', value: 6300 },
    { name: '24:00', value: 5400 }
];

const resourceUsageData = [
    { name: '00:00', cpu: 45, memory: 60 },
    { name: '04:00', cpu: 55, memory: 65 },
    { name: '08:00', cpu: 75, memory: 70 },
    { name: '12:00', cpu: 85, memory: 80 },
    { name: '16:00', cpu: 80, memory: 75 },
    { name: '20:00', cpu: 65, memory: 70 },
    { name: '24:00', cpu: 50, memory: 65 }
];

const MetricCard = ({ title, value, change, isPositive }: {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
}) => (
    <div className="bg-white rounded-lg p-6">
        <div className="flex flex-col">
            <span className="text-sm text-gray-500">{title}</span>
            <div className="flex items-baseline mt-2 justify-between">
                <span className="text-2xl font-semibold text-gray-900">{value}</span>
                <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{change}
        </span>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    return (
        <div className="p-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Analytics Overview</h1>
                    <div className="flex items-center gap-4">
                        <select className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm">
                            <option>Last 24 hours</option>
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                            Download Report
                        </button>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Total Requests"
                        value="1.2M"
                        change="12%"
                        isPositive={true}
                    />
                    <MetricCard
                        title="Average Latency"
                        value="145ms"
                        change="5%"
                        isPositive={false}
                    />
                    <MetricCard
                        title="Success Rate"
                        value="99.9%"
                        change="0.5%"
                        isPositive={true}
                    />
                    <MetricCard
                        title="Total Cost"
                        value="$1,234"
                        change="8%"
                        isPositive={false}
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Request Volume */}
                    <div className="bg-white p-6 rounded-lg">
                        <h3 className="text-lg font-medium mb-4">Request Volume</h3>
                        <div className="w-full h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={requestVolumeData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        name="Requests"
                                        stroke="#4F46E5"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Resource Usage */}
                    <div className="bg-white p-6 rounded-lg">
                        <h3 className="text-lg font-medium mb-4">Resource Usage</h3>
                        <div className="w-full h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={resourceUsageData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="cpu"
                                        name="CPU Usage"
                                        fill="#4F46E5"
                                    />
                                    <Bar
                                        dataKey="memory"
                                        name="Memory Usage"
                                        fill="#818CF8"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Activity Log */}
                <div className="bg-white rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        {[
                            { id: 1, type: 'System Update', message: 'New model version deployed', time: '2 hours ago' },
                            { id: 2, type: 'Alert', message: 'High latency detected in US region', time: '4 hours ago' },
                            { id: 3, type: 'Maintenance', message: 'Scheduled maintenance completed', time: '6 hours ago' },
                        ].map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                                    <p className="text-sm text-gray-500">{activity.message}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;