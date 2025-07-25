import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import Footer from "../components/Footer";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.50",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar
        position="fixed"
        elevation={1}
        sx={{ bgcolor: "white", color: "purple", px: 3 }}
      >
        <Toolbar
          disableGutters
          sx={{ justifyContent: "space-between", width: "100%" }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                bgcolor: "purple",
                color: "white",
                px: 2,
                py: 1.5,
                borderRadius: 2,
                fontWeight: "bold",
                fontSize: "1.6rem",
              }}
            >
              T
            </Box>
            <Typography variant="h6" fontWeight="bold">
              Tasky
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 12, flexGrow: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Task Management <br />
              Made{" "}
              <Box component="span" sx={{ color: "purple" }}>
                Simple.
              </Box>
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4}>
              Simplify your task management. Effortlessly organize, prioritize,
              and track your tasks with Tasky — your intuitive task management
              solution.
            </Typography>
            <Box
              display="flex"
              gap={2}
              justifyContent={{ xs: "center", md: "flex-start" }}
            >
              <Button
                variant="contained"
                sx={{ bgcolor: "purple", "&:hover": { bgcolor: "darkviolet" } }}
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: "purple",
                  borderColor: "purple",
                  "&:hover": { bgcolor: "purple.100" },
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://media.istockphoto.com/id/2093222366/photo/businesswoman-planning-on-a-digital-calendar-and-effective-task-management.jpg?s=1024x1024&w=is&k=20&c=ENimlHY1AYEDUEEgYeE0tSXwdMYVgVo8G05P6Ii0Z3A="
              alt="Task Illustration"
              sx={{ maxWidth: 400, width: "100%", mx: "auto" }}
            />
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default LandingPage;
