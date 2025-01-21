import React from "react";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl text-gray-900 font-medium">{project.name}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm capitalize
          ${
            project.status === "healthy"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {project.status}
        </span>
      </div>

      <div className="text-sm text-gray-600 mb-4">{project.region}</div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Active Services
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.services.map((service) => (
              <span
                key={service.name}
                className={`px-3 py-1 rounded-md text-sm
                  ${
                    service.status === "healthy"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
              >
                {service.name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Models</h4>
          <div className="flex flex-wrap gap-2">
            {project.models.map((model) => (
              <span
                key={model.name}
                className={`px-3 py-1 rounded-md text-sm
                  ${
                    model.status === "active"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                {model.name}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Request Volume</span>
              <span className="text-sm text-gray-900 font-medium">
                {project.metrics.requests}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg. Latency</span>
              <span className="text-sm text-gray-900 font-medium">
                {project.metrics.latency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Daily Cost</span>
              <span className="text-sm text-gray-900 font-medium">
                {project.metrics.cost}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
