import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Grid,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Zoom,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  trashed: boolean;
}

export const getTrashedCount = async (): Promise<number> => {
  try {
const response = await axios.get<Task[]>("/api/tasks?trashed=true");
setTrashedTasks(response.data);
    return response.data.length;
  } catch (error) {
    return 0;
  }
};

const TrashPage = () => {
  const [trashedTasks, setTrashedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmEmptyTrash, setConfirmEmptyTrash] = useState<boolean>(false);

  const fetchTrashedTasks = async () => {
  try {
    setLoading(true);
    const res = await axios.get("/api/tasks?trashed=true");

    console.log("res.data (should be array):", res.data);

    if (Array.isArray(res.data)) {
      setTrashedTasks(res.data);
    } else {
      console.error("Expected an array but got:", typeof res.data, res.data);
      setTrashedTasks([]); 
    }
  } catch (error) {
    console.error("Failed to fetch trashed tasks", error);
    toast.error("Failed to load trashed tasks.");
    setTrashedTasks([]);
  } finally {
    setLoading(false);
  }
};



  const handleRestore = async (taskId: string) => {
    try {
      await axios.put(`/api/tasks/${taskId}/restore`);
      toast.success("Task restored");
      fetchTrashedTasks();
    } catch (error) {
      console.error("Restore failed", error);
      toast.error("Could not restore task.");
    }
  };

  const handlePermanentDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await axios.delete(`/api/tasks/${confirmDeleteId}`);
      toast.success("Task permanently deleted.");
      setConfirmDeleteId(null);
      fetchTrashedTasks();
    } catch (error) {
      toast.error("Failed to delete task.");
    }
  };

  const handleEmptyTrash = async () => {
    try {
      await Promise.all(
        trashedTasks.map((task) => axios.delete(`/api/tasks/${task.id}`))
      );
      toast.success("Trash emptied.");
      setConfirmEmptyTrash(false);
      fetchTrashedTasks();
    } catch (error) {
      toast.error("Failed to empty trash.");
    }
  };

  useEffect(() => {
    fetchTrashedTasks();
  }, []);

  return (
    <Box p={4}>
      <ToastContainer position="top-right" />

      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4">🗑️ Trash</Typography>
        {trashedTasks.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={() => setConfirmEmptyTrash(true)}
          >
            Empty Trash
          </Button>
        )}
      </Box>

      {loading ? (
        <Box className="flex justify-center items-center h-40">
          <CircularProgress />
        </Box>
      ) : trashedTasks.length === 0 ? (
        <Typography>No trashed tasks.</Typography>
      ) : (
        <Grid container spacing={2}>
          {trashedTasks.map((task) => (
            <Zoom in key={task.id}>
              <Grid item xs={12} md={6} lg={4}>
                <Paper elevation={3} className="p-4 flex justify-between items-center">
                  <Box>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography variant="body2">{task.description}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Category: {task.category}
                    </Typography>
                  </Box>
                  <Box className="flex gap-2">
                    <Tooltip title="Restore Task">
                      <IconButton onClick={() => handleRestore(task.id)}>
                        <RestoreIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Forever">
                      <IconButton onClick={() => setConfirmDeleteId(task.id)}>
                        <DeleteForeverIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              </Grid>
            </Zoom>
          ))}
        </Grid>
      )}

      <Dialog
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
      >
        <DialogTitle>Confirm Permanent Deletion</DialogTitle>
        <DialogContent>
          This task will be deleted permanently. This action is irreversible.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
          <Button onClick={handlePermanentDelete} color="error" variant="contained">
            Delete Forever
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmEmptyTrash}
        onClose={() => setConfirmEmptyTrash(false)}
      >
        <DialogTitle>Empty Trash?</DialogTitle>
        <DialogContent>
          All tasks in trash will be permanently deleted. This cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmEmptyTrash(false)}>Cancel</Button>
          <Button onClick={handleEmptyTrash} color="error" variant="contained">
            Empty Trash
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

function setTrashedTasks(_data: Task[]) {
  throw new Error("Function not implemented.");
}

export default TrashPage;
