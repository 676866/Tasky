import { useEffect, useState } from "react";
import axios from "axios";
import { Box,Grid,Typography,TextField,Paper,InputAdornment,CircularProgress,Checkbox,IconButton,FormControlLabel,Avatar,Tooltip,Drawer,List,
  ListItem,ListItemIcon,ListItemText,Divider,Popover,Dialog,DialogTitle,DialogContent,DialogActions,Button,  SwipeableDrawer,} from "@mui/material";
import { Home,MoveToInbox,Settings,Logout,Add,NotificationsActive,Person,Menu as MenuIcon,ChevronLeft,Checklist,FilterList,} from "@mui/icons-material";
import {DragDropContext,Droppable,Draggable,type DroppableProvided,type DraggableProvided,} from "react-beautiful-dnd";
import AddTaskModal from "../components/AddTaskModal";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete"; 
import GroupIcon from "@mui/icons-material/Group";
import { Link, useNavigate } from "react-router-dom";
import { getTrashedCount } from "./TrashPage";



interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: "Active" | "Pending" | "Review" | "Done";
  trashed: boolean;
}
const statusColumns = ["Active", "Pending", "Review", "Done",];
const drawerWidth = 220;
const DashboardPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [prefillStatus, setPrefillStatus] = useState<null | string>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifDrawer, setNotifDrawer] = useState(false);
  const [] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showTrash] = useState(false); 
  const [trashCount, setTrashCount] = useState(0);
  const [highlightedColumn, setHighlightedColumn] = useState<string | null>(
    null,
  );

  const [] = useState<{
    taskId: string;
    prevStatus: Task["status"];
  } | null>(null);

  const [profile, setProfile] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return { ...user, profilePic: "" };
  });

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
  try {
    setLoading(true);
    interface TasksResponse {
  tasks: Task[];
}

const res = await axios.get<TasksResponse>(`${import.meta.env.VITE_API_URL}/api/tasks`, {
  headers: { Authorization: `Bearer ${token}` },
});

setTasks(res.data.tasks.filter(t => showTrash ? t.trashed : !t.trashed));
  } catch {
    toast.error("Failed to fetch tasks.");
    setTasks([]);
  } finally {
    setLoading(false);
  }
};
 useEffect(() => {
    fetchTasks();
  }, []);

 useEffect(() => {
  getTrashedCount().then(setTrashCount);
}, []);

  const handleLogout = () => {
    localStorage.clear();
     toast.success("Logged out successfully!", {
    position: "top-right",
  });
    window.location.href = "/";
  };

  const handleToggleComplete = async (
  taskId: string,
  current = false,
  fromStatus?: Task["status"],
  toStatus?: Task["status"],
) => {
  try {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updates: Partial<Task> = { completed: !current };

    if (fromStatus === "Pending" && !current) updates.status = "Active";
    else if (fromStatus === "Active" && !current) updates.status = "Done";
    else if (fromStatus === "Done" && current) updates.status = "Review";

    if (toStatus) updates.status = toStatus;

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`,
      updates,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast(
      ({ closeToast }) => (
        <Box display="flex" alignItems="center" gap={2}>
          <CheckCircleIcon color="success" />
          <Typography>Task updated</Typography>
          <Button
            color="inherit"
            size="small"
            onClick={async () => {
              await handleUndoChange(taskId, task.status);
              closeToast?.();
            }}
            sx={{ textTransform: "none", ml: "auto" }}
          >
            UNDO
          </Button>
        </Box>
      ),
      {
        position: "bottom-center",
        autoClose: 5000,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
      }
    );

    setHighlightedColumn(updates.status ?? "");
    fetchTasks();
  } catch (error) {
    console.error("Toggle complete error:", error);
    toast.error("Failed to update task");
  }
};

const handleUndoChange = async (
    taskId: string,
    prevStatus: Task["status"],
  ) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`,
        { status: prevStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchTasks();
      toast.success("Undo successful");
    } catch {
      toast.error("Failed to undo");
    }
  };

  const onDragEnd = async (result: any) => {
    const { source, destination } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const movedTask = tasks.find((t) => t.id === result.draggableId);
    if (!movedTask) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tasks/${movedTask.id}`,
        { status: destination.droppableId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchTasks();
    } catch {
      toast.error("Failed to move task");
    }
  };

  const filteredTasks = tasks.filter((t) => {
  const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
  const matchStatus = filteredStatus ? t.status === filteredStatus : true;
  return matchSearch && matchStatus && !t.trashed;
});



  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTasks();
  } catch (err) {
    toast.error("Failed to update task status");
    console.error(err);
  }
};


const handleMoveToTrash = async (taskId: string) => {
  try {
    const token = localStorage.getItem("token"); 
    
    if (!token) {
      console.error("No token found");
      return;
    }

    await axios.put(
      `http://localhost:5000/api/tasks/${taskId}/trash`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    fetchTasks();
  } catch (error) {
    console.error("Failed to move task to trash", error);
  }
};



  return (
    <Box sx={{ display: "flex" }}>
{!sidebarOpen && (
  <Box sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300 }}>
    <IconButton onClick={() => setSidebarOpen(true)}>
      <MenuIcon />
    </IconButton>
  </Box>
)}

<Drawer
  variant="persistent"
  anchor="left"
  open={sidebarOpen}
  sx={{
    width: sidebarOpen ? drawerWidth : 60,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: sidebarOpen ? drawerWidth : 60,
      transition: "width 0.3s",
      overflowX: "hidden",
    },
  }}
>
  <Box
    sx={{
      p: 2,
      display: "flex",
      justifyContent: sidebarOpen ? "space-between" : "center",
      alignItems: "center",
    }}
  >
    <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
      {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
    </IconButton>

    {sidebarOpen && (
      <Box display="flex" alignItems="center" gap={1}>
        <img src="icon1.jpg" alt="Tasky Logo" width={40} height={40} />
        <Typography variant="h6" fontWeight="bold">Tasky</Typography>
      </Box>
    )}
  </Box>

  <List>
    <ListItem button onClick={() => navigate("/")}>
      <ListItemIcon><Home /></ListItemIcon>
      {sidebarOpen && <ListItemText primary="Home" />}
    </ListItem>

    <ListItem button onClick={() => setNotifDrawer(true)}>
      <ListItemIcon><MoveToInbox /></ListItemIcon>
      {sidebarOpen && <ListItemText primary="Inbox" />}
    </ListItem>

    <ListItem button onClick={() => navigate("/collaborate")}>
      <ListItemIcon><GroupIcon /></ListItemIcon>
      {sidebarOpen && <ListItemText primary="Collaborate" />}
    </ListItem>

    <ListItem button onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}>
      <ListItemIcon><Checklist /></ListItemIcon>
      {sidebarOpen && <ListItemText primary="All" />}
    </ListItem>

    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <List>
        <ListItem
          button
          onClick={() => {
            setFilteredStatus("Active");
            setAnchorEl(null);
          }}
        >
          <ListItemIcon><FilterList /></ListItemIcon>
          <ListItemText primary="In Progress" />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            setFilteredStatus("Done");
            setAnchorEl(null);
          }}
        >
          <ListItemIcon><FilterList /></ListItemIcon>
          <ListItemText primary="Completed" />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            setPrefillStatus("Pending");
            setIsModalOpen(true);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon><Add /></ListItemIcon>
          <ListItemText primary="New" />
        </ListItem>
      </List>
    </Popover>

    <Divider />

    <ListItem button onClick={() => setSettingsOpen(true)}>
  <ListItemIcon>
    <Settings />
  </ListItemIcon>
  {sidebarOpen && <ListItemText primary="Settings" />}
</ListItem>

<ListItem button onClick={handleLogout}>
  <ListItemIcon>
    <Logout />
  </ListItemIcon>
  {sidebarOpen && <ListItemText primary="Sign Out" />}
</ListItem>

<ListItem button component={Link} to="/trash">
  <ListItemIcon>
<DeleteIcon />
  </ListItemIcon>
  {sidebarOpen && (
    <ListItemText
      primary={
        <div className="flex items-center gap-2">
          <span>Trash</span>
          {trashCount > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
              {trashCount}
            </span>
          )}
        </div>
      }
    />
  )}
</ListItem>



  </List>
</Drawer>

 <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Grid container alignItems="center" spacing={2} mb={3}>
       <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search tasks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item>
            <Tooltip title="Notifications">
              <IconButton>
                <NotificationsActive
                  sx={{ animation: "bounce 1.5s infinite" }}
                />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item display="flex" alignItems="center" gap={1}>
            <Avatar src={profile.profilePic}>
              {!profile.profilePic && <Person />}
            </Avatar>
            <Typography>{profile.name || "User"}</Typography>
          </Grid>
        </Grid>

        <Typography variant="h5" mb={2}>
          Hey {profile.name || "User"}👋, here is whats's on your plate today
        </Typography>
        {filteredStatus && (
          <Button
            onClick={() => setFilteredStatus(null)}
            size="small"
            sx={{ mb: 2 }}
          >
            Clear Filters
          </Button>
        )}

        {loading ? (
          <Box textAlign="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Grid container spacing={2}>
              {statusColumns.map((status) => (
                <Grid item xs={12} sm={6} md={3} key={status}>
                  <Paper
                    sx={{
                      p: 2,
                      minHeight: 400,
                      borderRadius: 3,
                      boxShadow: 3,
                      transition: "0.3s",
                      backgroundColor:
                        highlightedColumn === status
                          ? "rgba(129, 183, 226, 0.2)"
                          : "white",
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="h6">{status}</Typography>
                      <IconButton
                        onClick={() => {
                          setPrefillStatus(status);
                          setIsModalOpen(true);
                        }}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>

                    <Droppable droppableId={status}>
                      {(provided: DroppableProvided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          minHeight={200}
                        >
                         {filteredTasks
  .filter((task) => status === "Trash" ? task.trashed : task.status === status && !task.trashed)
  .map((task, index) => (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided: DraggableProvided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            p: 2,
            mb: 2,
            borderLeft: `5px solid ${task.completed ? "#4caf50" : "#2196f3"}`,
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.02)" },
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={task.completed}
                onChange={() =>
                  handleToggleComplete(task.id, task.completed, task.status)
                }
                sx={{
                  color:
                    task.status === "Done"
                      ? "success.main"
                      : task.status === "Review"
                        ? "warning.main"
                        : task.status === "Pending"
                          ? "info.main"
                          : "primary.main",
                  "&.Mui-checked": {
                    color:
                      task.status === "Done"
                        ? "success.main"
                        : task.status === "Review"
                          ? "warning.main"
                          : "primary.main",
                  },
                }}
              />
            }
            label={<Typography fontWeight={600}>{task.title}</Typography>}
          />

          <Typography variant="body2">{task.description}</Typography>

          {(status === "Review" || status === "Done") && (
          <IconButton
  type="button"
  onClick={(e) => {
    e.preventDefault();
    console.log("Deleting task with ID:", task.id);
    
    handleMoveToTrash(task.id);
  }}
>
  <DeleteIcon fontSize="small" />
</IconButton>


          )}

          <Typography variant="caption">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </Typography>

          <Box mt={1} display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 24, height: 24 }} />
            <Typography variant="caption">Assigned to You</Typography>
          </Box>

          <IconButton onClick={() => setEditingTask(task)}>
            <EditIcon />
          </IconButton>

          {status === "Pending" && (
            <Tooltip title="Mark as Active">
              <IconButton
                onClick={() =>
                  handleStatusChange(task.id, "Active")
                }
                color="success"
              >
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
          )}
        </Paper>
      )}
    </Draggable>
  ))}

                          {provided.placeholder}
                        </Box>)}
                    </Droppable>
                  </Paper>
                </Grid>))}</Grid></DragDropContext>)}
   <AddTaskModal
          open={isModalOpen || Boolean(editingTask)}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
            setPrefillStatus(null);
          }}
          onTaskAdded={fetchTasks}
          taskToEdit={editingTask}
          defaultStatus={prefillStatus || undefined}
        />
      </Box>

      <SwipeableDrawer
        anchor="right"
        open={notifDrawer}
        onOpen={() => setNotifDrawer(true)}
        onClose={() => setNotifDrawer(false)}
      >
        <Box width={300} p={2}>
          <Typography variant="h6">📨 Inbox</Typography>
          <Typography variant="body2" color="text.secondary">
            You have no new notifications.
          </Typography>
        </Box>
      </SwipeableDrawer>

      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
          <TextField
            label="Email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <Button component="label">
            Upload Profile Picture
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfile({
                      ...profile,
                      profilePic: reader.result as string,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
          <Button
            onClick={() => {
              localStorage.setItem("user", JSON.stringify(profile));
              setSettingsOpen(false);
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;


