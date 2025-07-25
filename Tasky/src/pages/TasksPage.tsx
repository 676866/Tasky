import { Box, Container, Typography } from "@mui/material";

const TasksPage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        minHeight="80vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Your Tasks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is where all your active tasks will appear.
        </Typography>
      </Box>
    </Container>
  );
};

export default TasksPage;
