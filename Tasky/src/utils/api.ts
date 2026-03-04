// src/utils/api.ts
export async function fetchProjects() {
  const res = await fetch("http://localhost:5000/api/projects");
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function fetchReminders() {
  const res = await fetch("http://localhost:5000/api/reminders");
  if (!res.ok) throw new Error("Failed to fetch reminders");
  return res.json();
}
