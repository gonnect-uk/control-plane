import React from 'react';
import {LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

const performanceData = [
    {time: '00:00', latency: 150, errors: 2, requests: 1200},
    {time: '04:00', latency: 180, errors: 5, requests: 1500},
    {time: '08:00', latency: 220, errors: 8, requests: 2100},
    {time: '12:00', latency: 250, errors: 12, requests: 2800},
    {time: '16:00', latency: 200, errors: 6, requests: 2400},
    {time: '20:00', latency: 170, errors: 4, requests: 1800},
];

interface Alert {
    id: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    service: string;
    timestamp: string;
    status: 'active' | 'resolved';
}

const alerts: Alert[] = [
    {
        id: '1',
        severity: 'critical',
        message: 'High latency detected in US region',
        service: 'Model API',
        timestamp: '10 minutes ago',
        status: 'active'
    },
    {
        id: '2',
        severity: 'warning',
        message: 'Rate limit threshold at 80%',
        service: 'Rate Limiter',
        timestamp: '25 minutes ago',
        status: 'active'
    },
    {
        id: '3',
        severity: 'info',
        message: 'New model version deployed successfully',
        service: 'Model Service',
        timestamp: '1 hour ago',
        status: 'resolved'
    }
];

const MetricCard = ({title, value, change, indicator}: {
    title: string;
    value: string;
    change: string;
    indicator: 'up' | 'down' | 'neutral';
}) => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-sm text-gray-600 mb-2">{title}</h3>
        <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-gray-900">{value}</span>
            <span className={`text-sm ${
                indicator === 'up' ? 'text-green-600' :
                    indicator === 'down' ? 'text-red-600' :
                        'text-gray-600'
            }`}>
        {change}
      </span>
        </div>
    </div>
);

const MonitoringOverview = () => {
    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Monitoring</h1>
                    <div className="flex items-center space-x-4">
                        <select className="px-4 py-2 border border-gray-300 rounded-md text-sm">
                            <option>Last 24 hours</option>
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                            Configure Alerts
                        </button>
                    </div>
                </div>

                {/* Metrics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Requests/min"
                        value="2,450"
                        change="↑ 12% vs last hour"
                        indicator="up"
                    />
                    <MetricCard
                        title="Avg. Latency"
                        value="185ms"
                        change="↓ 5% vs last hour"
                        indicator="down"
                    />
                    <MetricCard
                        title="Error Rate"
                        value="0.5%"
                        change="→ No change"
                        indicator="neutral"
                    />
                    <MetricCard
                        title="Active Models"
                        value="4"
                        change="↑ 1 new model"
                        indicator="up"
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Request Volume Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-4">Request Volume</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="time"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Line
                                        type="monotone"
                                        dataKey="requests"
                                        stroke="#4F46E5"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Latency & Errors Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium mb-4">Latency & Errors</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="time"/>
                                    <YAxis yAxisId="left"/>
                                    <YAxis yAxisId="right" orientation="right"/>
                                    <Tooltip/>
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="latency"
                                        stroke="#4F46E5"
                                        strokeWidth={2}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="errors"
                                        stroke="#EF4444"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Active Alerts */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium mb-6">Active Alerts</h3>
                    <div className="space-y-4">
                        {alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className={`p-4 rounded-lg border ${
                                    alert.severity === 'critical' ? 'border-red-200 bg-red-50' :
                                        alert.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                                            'border-blue-200 bg-blue-50'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                          alert.severity === 'critical' ? 'text-red-800' :
                              alert.severity === 'warning' ? 'text-yellow-800' :
                                  'text-blue-800'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                                            <span className="text-gray-500">•</span>
                                            <span className="text-sm text-gray-600">{alert.service}</span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-900">{alert.message}</p>
                                        <p className="mt-1 text-xs text-gray-500">{alert.timestamp}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        alert.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                    }`}>
                    {alert.status}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonitoringOverview;