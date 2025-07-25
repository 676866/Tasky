export interface Task {
  status: string | undefined;
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  createdAt: string;
  userId: string;
}
