import React, { useState } from 'react';
import type { Project } from '@/lib/types';

interface ProjectGroup {
  admin: Project[];
  applications: Project[];
}

const projectGroups: ProjectGroup = {
  admin: [
    {
      id: "litellm-prod",
      name: "litellm-prod",
      status: "healthy",
      region: "us-central1",
      services: [
        { name: "Cloud Run", status: "healthy" },
        { name: "Vertex AI", status: "healthy" }
      ],
      models: [
        { name: "GPT-4", provider: "OpenAI", status: "active" },
        { name: "Claude 3", provider: "Anthropic", status: "active" }
      ],
      metrics: {
        requests: "1.2M/day",
        latency: "245ms",
        cost: "$2.4K/day"
      },
      adGroup: "ML_ENG_PROD"
    },
    {
      id: "model-garden",
      name: "model-garden",
      status: "healthy",
      region: "us-central1",
      services: [
        { name: "Vertex AI", status: "healthy" }
      ],
      models: [
        { name: "PaLM 2", provider: "Google", status: "active" },
        { name: "Gemini Pro", provider: "Google", status: "active" }
      ],
      metrics: {
        requests: "800K/day",
        latency: "180ms",
        cost: "$1.8K/day"
      },
      adGroup: "ML_PLATFORM_ADMINS"
    },
    {
      id: "model-monitoring",
      name: "model-monitoring",
      status: "healthy",
      region: "us-central1",
      services: [
        { name: "Cloud Run", status: "healthy" },
        { name: "BigQuery", status: "healthy" }
      ],
      models: [
        { name: "GPT-4", provider: "OpenAI", status: "active" },
        { name: "Claude 3", provider: "Anthropic", status: "active" },
        { name: "PaLM 2", provider: "Google", status: "active" }
      ],
      metrics: {
        requests: "500K/day",
        latency: "150ms",
        cost: "$1.2K/day"
      },
      adGroup: "ML_OPS_TEAM"
    },
    {
      id: "model-security",
      name: "model-security",
      status: "healthy",
      region: "us-central1",
      services: [
        { name: "Cloud Run", status: "healthy" },
        { name: "Cloud Functions", status: "healthy" }
      ],
      models: [
        { name: "GPT-4", provider: "OpenAI", status: "active" },
        { name: "Claude 3", provider: "Anthropic", status: "active" }
      ],
      metrics: {
        requests: "300K/day",
        latency: "120ms",
        cost: "$0.9K/day"
      },
      adGroup: "SECURITY_TEAM"
    }
  ],
  applications: [
    {
      id: "plm-assistant",
      name: "plm-assistant",
      status: "healthy",
      region: "us-central1",
      services: [
        { name: "Cloud Run", status: "healthy" }
      ],
      models: [
        { name: "GPT-4", provider: "OpenAI", status: "active" },
        { name: "PaLM 2", provider: "Google", status: "active" }
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
      name: "customer-support-ai",
      status: "healthy",
      region: "us-central1",
      services: [
        { name: "Cloud Run", status: "healthy" },
        { name: "Vertex AI", status: "healthy" }
      ],
      models: [
        { name: "GPT-4", provider: "OpenAI", status: "active" },
        { name: "Claude 3", provider: "Anthropic", status: "active" }
      ],
      metrics: {
        requests: "75K/day",
        latency: "190ms",
        cost: "$600/day"
      },
      adGroup: "SUPPORT_TEAM"
    },
    {
      id: "legal-assistant",
      name: "legal-doc-ai",
      status: "healthy",
      region: "us-central1",
      services: [
        { name: "Cloud Run", status: "healthy" },
        { name: "Document AI", status: "healthy" }
      ],
      models: [
        { name: "GPT-4", provider: "OpenAI", status: "active" },
        { name: "Claude 3", provider: "Anthropic", status: "active" }
      ],
      metrics: {
        requests: "25K/day",
        latency: "230ms",
        cost: "$350/day"
      },
      adGroup: "LEGAL_TEAM"
    }
  ]
};

const GCPDashboard = () => {
  const [selectedTab, setSelectedTab] = useState<'admin' | 'applications'>('admin');

  return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">GCP Projects</h1>
            <a
                href="https://langfuse.hm.com"
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
                  onClick={() => setSelectedTab('admin')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === 'admin'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Internal Admin Projects
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Active Services</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.services.map(service => (
                          <span
                              key={service.name}
                              className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-sm"
                          >
                      {service.name}
                    </span>
                      ))}
                    </div>
                  </div>

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

                  <div className="border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Request Volume</div>
                        <div className="text-sm font-medium text-gray-900">{project.metrics.requests}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Avg. Latency</div>
                        <div className="text-sm font-medium text-gray-900">{project.metrics.latency}</div>
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