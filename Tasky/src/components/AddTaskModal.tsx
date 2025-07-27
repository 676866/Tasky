import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { type Task } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "https://tasky-5jyl.onrender.com";
const categories = ["Health", "Study", "Work", "Personal Errand"];

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onTaskAdded: () => void | Promise<void>;
  taskToEdit: Task | null;
  defaultStatus?: string; //
}

interface TaskFormData {
  title: string;
  description: string;
  category: string;
  dueDate: string;
  status?: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  open,
  onClose,
  onTaskAdded,
  taskToEdit,
  defaultStatus,
}) => {
  const [form, setForm] = useState<TaskFormData>({
    title: "",
    description: "",
    category: "",
    dueDate: "",
    status: defaultStatus || "Active",
  });

  useEffect(() => {
    if (taskToEdit) {
      setForm({
        title: taskToEdit.title,
        description: taskToEdit.description,
        category: taskToEdit.category,
        dueDate: taskToEdit.dueDate.split("T")[0],
        status: taskToEdit.status,
      });
    } else {
      setForm({
        title: "",
        description: "",
        category: "",
        dueDate: "",
        status: defaultStatus || "Active",
      });
    }
  }, [taskToEdit, open, defaultStatus]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { title, category, dueDate } = form;
    if (!title || !category || !dueDate) {
      toast.error("Please fill all required fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    try {
      if (taskToEdit) {
        await axios.put(`${API_URL}/api/tasks/${taskToEdit.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Task updated successfully");
      } else {
        await axios.post(`${API_URL}/api/tasks`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Task added successfully");
      }

      setForm({
        title: "",
        description: "",
        category: "",
        dueDate: "",
        status: defaultStatus || "Active",
      });
      onClose();
      onTaskAdded();
    } catch (error: any) {
      console.error("Error submitting task:", error);
      const msg =
        error?.response?.data?.message ||
        (error?.response?.status === 401
          ? "Unauthorized: Session may have expired"
          : "Something went wrong");
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{taskToEdit ? "Edit Task" : "Add New Task"}</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Title"
          name="title"
          fullWidth
          value={form.title}
          onChange={handleChange}
          required
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          multiline
          value={form.description}
          onChange={handleChange}
        />
        <TextField
          select
          label="Category"
          name="category"
          fullWidth
          value={form.category}
          onChange={handleChange}
          required
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="date"
          label="Due Date"
          name="dueDate"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={form.dueDate}
          onChange={handleChange}
          required
        />
        {!taskToEdit && (
          <input type="hidden" name="status" value={form.status} />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {taskToEdit ? "Update Task" : "Add Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskModal;
