// src/components/Reminders.tsx
import { useEffect, useState } from "react";
import { fetchReminders } from "../utils/api";

interface Reminder {
  id: number;
  title: string;
  dueDate: string;
}

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    fetchReminders().then((data: Reminder[]) => setReminders(data));
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Reminders
      </h2>
      {reminders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No upcoming reminders.</p>
      ) : (
        reminders.map((r) => (
          <div key={r.id} className="border-b border-gray-200 dark:border-gray-700 py-2">
            <p className="text-gray-800 dark:text-gray-200">{r.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{r.dueDate}</p>
          </div>
        ))
      )}
    </div>
  );
}
