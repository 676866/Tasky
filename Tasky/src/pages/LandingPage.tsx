import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
  Slide,
  Zoom,
} from "@mui/material";
import Footer from "../components/Footer";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    const lastLoginTime = localStorage.getItem("lastLoginTime");

    if (token && lastLoginTime) {
      const hoursSinceLogin =
        (Date.now() - parseInt(lastLoginTime)) / (1000 * 60 * 60);
      if (hoursSinceLogin <= 3) {
        navigate("/dashboard");
        return;
      }
    }

    navigate("/login");
  };

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
            <Slide direction="up" in timeout={600}>
              <Box>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  Task Management <br />
                  Made{" "}
                  <Box component="span" sx={{ color: "purple" }}>
                    Simple.
                  </Box>
                </Typography>
                <Typography variant="h6" color="text.secondary" mb={4}>
                  Simplify your task management. Effortlessly organize,
                  prioritize, and track your tasks with Tasky — your intuitive
                  task management solution.
                </Typography>
                <Box
                  display="flex"
                  gap={2}
                  flexWrap="wrap"
                  justifyContent={{ xs: "center", md: "flex-start" }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "purple",
                      px: 3,
                      "&:hover": { bgcolor: "darkviolet" },
                    }}
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "purple",
                      borderColor: "purple",
                      px: 3,
                      "&:hover": { bgcolor: "purple.100" },
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    variant="text"
                    sx={{
                      color: "darkviolet",
                      fontWeight: "bold",
                      textDecoration: "underline",
                      px: 3,
                      "&:hover": { color: "purple" },
                    }}
                    onClick={handleGetStarted}
                  >
                    Get Started →
                  </Button>
                </Box>
              </Box>
            </Slide>
          </Grid>

          <Grid item xs={12} md={6}>
            <Zoom in timeout={800}>
              <Box
                component="img"
                src="https://media.istockphoto.com/id/2093222366/photo/businesswoman-planning-on-a-digital-calendar-and-effective-task-management.jpg?s=1024x1024&w=is&k=20&c=ENimlHY1AYEDUEEgYeE0tSXwdMYVgVo8G05P6Ii0Z3A="
                alt="Task Illustration"
                sx={{
                  maxWidth: 460,
                  width: "100%",
                  mx: "auto",
                  borderRadius: 3,
                  boxShadow: 4,
                }}
              />
            </Zoom>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default LandingPage;
