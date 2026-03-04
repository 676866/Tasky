import { useEffect, useState } from "react";
import { fetchProjects } from "../utils/api";

interface Task {
  id: number;
  title: string;
  status: string;
}

interface Project {
  id: number;
  name: string;
  tasks: Task[];
}

export default function ProjectOverview() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects()
      .then((data: Project[]) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Project Overview
      </h2>

      {projects.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
      ) : (
        projects.map((project: Project) => (
          <div
            key={project.id}
            className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-2"
          >
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              {project.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tasks: {project.tasks.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Completed:{" "}
              {project.tasks.filter((t: Task) => t.status === "Done").length}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
