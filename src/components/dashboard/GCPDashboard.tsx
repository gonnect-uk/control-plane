import React, {useState} from 'react';
import type {Project} from '@/lib/types';

interface Route {
    target: string;
    type: 'litellm' | 'application';
    description: string;
}

interface InfraComponent {
    name: string;
    type: 'gke' | 'cloudrun' | 'proxy' | 'monitoring' | 'security';
    status: 'healthy' | 'degraded';
    details?: string;
    routes?: Route[];
}

interface ProjectGroup {
    landing: Project[];
    modelInfra: Project[];
    applications: Project[];
}

const projectGroups: ProjectGroup = {
    landing: [
        {
            id: "gke-landing",
            name: "GKE Landing Project",
            status: "healthy",
            region: "us-central1",
            services: [
                {
                    name: "GKE Cluster",
                    type: "kubernetes",
                    status: "healthy",
                    hostedServices: [
                        {
                            name: "Model Monitoring Service",
                            type: "monitoring",
                            status: "healthy",
                            description: "K8s-based model performance monitoring"
                        },
                        {
                            name: "Security Service",
                            type: "security",
                            status: "healthy",
                            description: "K8s-based model access security"
                        }
                    ]
                },
                {
                    name: "CloudRun Proxy",
                    type: "proxy",
                    status: "healthy",
                    routes: [
                        {
                            target: "litellm-prod",
                            type: "litellm",
                            description: "Routes to LiteLLM service for model access"
                        },
                        {
                            target: "plm-assistant",
                            type: "application",
                            description: "Routes to PLM Assistant application"
                        },
                        {
                            target: "customer-support",
                            type: "application",
                            description: "Routes to Customer Support AI"
                        }
                    ]
                }
            ],
            infrastructure: [
                {
                    name: "GKE Control Plane",
                    type: "gke",
                    status: "healthy",
                    details: "Running monitoring and security services"
                },
                {
                    name: "CloudRun Proxy Service",
                    type: "proxy",
                    status: "healthy",
                    details: "Central routing service",
                    routes: [
                        {
                            target: "litellm-prod",
                            type: "litellm",
                            description: "Model access via LiteLLM"
                        },
                        {
                            target: "plm-assistant",
                            type: "application",
                            description: "PLM Assistant routing"
                        },
                        {
                            target: "customer-support",
                            type: "application",
                            description: "Customer Support routing"
                        }
                    ]
                },
                {
                    name: "Langfuse Monitoring",
                    type: "monitoring",
                    status: "healthy",
                    details: "https://control-plane.hm.com/monitoring"
                }
            ],
            vpc: {
                name: "Landing VPC",
                cidr: "10.0.0.0/16",
                subnets: [
                    {name: "GKE Subnet", cidr: "10.0.1.0/24"},
                    {name: "Proxy Subnet", cidr: "10.0.2.0/24"}
                ]
            },
            metrics: {
                requests: "2.5M/day",
                latency: "125ms",
                cost: "$3.2K/day"
            },
            adGroup: "ML_PLATFORM_ADMINS"
        }
    ],
    modelInfra: [
        {
            id: "litellm-prod",
            name: "LiteLLM Model Service",
            status: "healthy",
            region: "us-central1",
            services: [
                {
                    name: "Cloud Run",
                    type: "litellm",
                    status: "healthy",
                    details: "LiteLLM service accessing Vertex AI models"
                }
            ],
            connectedTo: [
                {
                    name: "Vertex Model Garden",
                    type: "model-source",
                    status: "active",
                    models: ["GPT-4", "Claude 3", "PaLM 2"]
                }
            ],
            vpc: {
                name: "Model VPC",
                cidr: "192.168.1.0/24",
                peering: ["Landing VPC"]
            },
            metrics: {
                requests: "1.2M/day",
                latency: "245ms",
                cost: "$2.4K/day"
            },
            adGroup: "ML_ENG_PROD"
        },
        {
            id: "model-garden",
            name: "Vertex Model Garden",
            status: "healthy",
            region: "us-central1",
            services: [
                {
                    name: "Vertex AI",
                    type: "model-platform",
                    status: "healthy",
                    models: [
                        {name: "PaLM 2", provider: "Google"},
                        {name: "Gemini Pro", provider: "Google"}
                    ]
                }
            ],
            vpc: {
                name: "Garden VPC",
                cidr: "192.168.2.0/24",
                peering: ["Landing VPC"]
            },
            metrics: {
                requests: "800K/day",
                latency: "180ms",
                cost: "$1.8K/day"
            },
            adGroup: "ML_PLATFORM_ADMINS"
        }
    ],
    applications: [
        {
            id: "plm-assistant",
            name: "PLM Assistant",
            status: "healthy",
            region: "us-central1",
            services: [{
                name: "Cloud Run",
                type: "application",
                status: "healthy",
                accessedVia: "CloudRun Proxy"
            }],
            models: [
                {name: "GPT-4", provider: "OpenAI", status: "active"},
                {name: "PaLM 2", provider: "Google", status: "active"}
            ],
            metrics: {
                requests: "50K/day",
                latency: "210ms",
                cost: "$450/day"
            },
            adGroup: "PLM_TEAM"
        },
        {
            id: "customer-support",
            name: "Customer Support AI",
            status: "healthy",
            region: "us-central1",
            services: [{
                name: "Cloud Run",
                type: "application",
                status: "healthy",
                accessedVia: "CloudRun Proxy"
            }],
            models: [
                {name: "GPT-4", provider: "OpenAI", status: "active"},
                {name: "Claude 3", provider: "Anthropic", status: "active"}
            ],
            metrics: {
                requests: "75K/day",
                latency: "190ms",
                cost: "$600/day"
            },
            adGroup: "SUPPORT_TEAM"
        }
    ]
};

const GCPDashboard = () => {
    const [selectedTab, setSelectedTab] = useState<'landing' | 'modelInfra' | 'applications'>('landing');

    const renderRoutes = (routes: Route[]) => (
        <div className="ml-4 mt-2 space-y-2">
            {routes.map((route, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-400">→</span>
                    <span className={`px-2 py-1 rounded-md ${
                        route.type === 'litellm'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-blue-50 text-blue-700'
                    }`}>
            {route.target}
          </span>
                    <span className="text-gray-500">{route.description}</span>
                </div>
            ))}
        </div>
    );

    const renderGKEServices = (services: any[]) => (
        <div className="space-y-3">
            {services.map((service, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                                service.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                            }`}/>
                            <div>
                                <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                <div className="text-xs text-gray-500">{service.description}</div>
                            </div>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800`}>
              {service.type}
            </span>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderInfrastructureComponents = (components: InfraComponent[]) => (
        <div className="space-y-2">
            {components.map((component) => (
                <div key={component.name} className="flex flex-col bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                                component.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                            }`}/>
                            <div>
                                <div className="text-sm font-medium text-gray-900">{component.name}</div>
                                {component.details && (
                                    <div className="text-xs text-gray-500">{component.details}</div>
                                )}
                            </div>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                            component.type === 'gke' ? 'bg-purple-100 text-purple-800' :
                                component.type === 'proxy' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                        }`}>
              {component.type}
            </span>
                    </div>
                    {component.routes && renderRoutes(component.routes)}
                </div>
            ))}
        </div>
    );

    const renderVPCInfo = (vpc: any) => (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">VPC Configuration</h4>
            <div className="space-y-1">
                <div className="text-sm text-gray-600">CIDR: {vpc.cidr}</div>
                {vpc.subnets && (
                    <div className="pl-4 space-y-1">
                        {vpc.subnets.map((subnet: any) => (
                            <div key={subnet.name} className="text-sm text-gray-600">
                                • {subnet.name}: {subnet.cidr}
                            </div>
                        ))}
                    </div>
                )}
                {vpc.peering && (
                    <div className="text-sm text-gray-600">
                        Peered with: {vpc.peering.join(', ')}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">GCP Projects</h1>
                    <a
                        href="https://control-plane.hm.com/monitoring"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                    >
                        Open Langfuse Monitoring
                    </a>
                </div>

                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setSelectedTab('landing')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                                selectedTab === 'landing'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Landing Infrastructure
                        </button>
                        <button
                            onClick={() => setSelectedTab('modelInfra')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                                selectedTab === 'modelInfra'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Model Infrastructure
                        </button>
                        <button
                            onClick={() => setSelectedTab('applications')}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                                selectedTab === 'applications'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Application Projects
                        </button>
                    </nav>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {projectGroups[selectedTab].map((project) => (
                        <div key={project.id} className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                                        <span className={`px-2 py-1 rounded-md text-sm
                      ${project.status === 'healthy' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {project.status}
                    </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{project.region}</p>
                                    <p className="text-sm text-gray-500 mt-1">AD Group: {project.adGroup}</p>
                                </div>
                            </div>

                            {/* GKE Services for Landing Project */}
                            {project.services?.find(s => s.hostedServices) && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">GKE Hosted Services</h4>
                                    {renderGKEServices(project.services.find(s => s.hostedServices)?.hostedServices || [])}
                                </div>
                            )}

                            {/* Infrastructure Components with Routing */}
                            {project.infrastructure && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">Infrastructure
                                        Components</h4>
                                    {renderInfrastructureComponents(project.infrastructure)}
                                </div>
                            )}

                            {/* VPC Info */}
                            {project.vpc && renderVPCInfo(project.vpc)}

                            {/* Services Section */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Active Services</h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.services?.map(service => (
                                        <div key={service.name} className="px-3 py-2 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-2">
                       <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-sm">
                         {service.name}
                       </span>
                                                {service.accessedVia && (
                                                    <span className="text-sm text-gray-500">
                           via {service.accessedVia}
                         </span>
                                                )}
                                            </div>
                                            {service.routes && renderRoutes(service.routes)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Connected Services */}
                            {project.connectedTo && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Connected Services</h4>
                                    <div className="space-y-2">
                                        {project.connectedTo.map((connection, index) => (
                                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div
                                                        className="text-sm font-medium text-gray-900">{connection.name}</div>
                                                    <span
                                                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                           {connection.type}
                         </span>
                                                </div>
                                                {connection.models && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {connection.models.map((model, idx) => (
                                                            <span key={idx}
                                                                  className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs">
                               {model}
                             </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Models Section */}
                            {project.models && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Models</h4>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.models.map(model => (
                                            <span
                                                key={model.name}
                                                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm"
                                            >
                       {model.name}
                     </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Metrics Section */}
                            <div className="border-t border-gray-100 pt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-500">Request Volume</div>
                                        <div
                                            className="text-sm font-medium text-gray-900">{project.metrics.requests}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Avg. Latency</div>
                                        <div
                                            className="text-sm font-medium text-gray-900">{project.metrics.latency}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Daily Cost</div>
                                        <div className="text-sm font-medium text-gray-900">{project.metrics.cost}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GCPDashboard;