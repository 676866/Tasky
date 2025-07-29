import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Collapse,
  Paper,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

const CollaboratePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSendRequest = () => {
    if (!email) return alert("Please enter an email.");
    console.log("Sending request to:", email);
    alert(`Request sent to ${email}`);
    setEmail("");
    setShowForm(false);
  };

  return (
    <Box p={3} maxWidth={400} mx="auto">
      <Typography variant="h4" mb={3} fontWeight={600}>
        Collaborate 🤝
      </Typography>

      <Box display="flex" flexDirection="column" gap={1.5}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<GroupAddIcon />}
          onClick={handleToggleForm}
        >
          Create Request
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<CheckCircleIcon />}
        >
          Accept Request
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<PeopleAltIcon />}
        >
          View Collaborators
        </Button>
      </Box>

      <Collapse in={showForm} timeout="auto" unmountOnExit>
        <Paper elevation={2} sx={{ mt: 3, p: 2 }}>
          <Typography mb={2} fontSize={14} color="text.secondary">
            Collaborate on projects, tasks, and share ideas once they accept
            your request.
          </Typography>

          <TextField
            fullWidth
            size="small"
            label="Collaborator's Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            size="small"
            endIcon={<SendIcon />}
            onClick={handleSendRequest}
          >
            Send Request
          </Button>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default CollaboratePage;
