import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        color: "#000000",
        py: 4,
        px: 2,
        backgroundColor: "#BBBBBB",
        width: "100%",
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            About Tasky
          </Typography>
          <Typography variant="body2" color="#181818">
            Tasky is your smart task management companion — helping you stay
            productive, organized, and in control of your day-to-day goals.
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Quick Links
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            <Link to="/" style={{ color: "#1976d2", textDecoration: "none" }}>
              Home
            </Link>
            <Link
              to="/login"
              style={{ color: "#1976d2", textDecoration: "none" }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{ color: "#1976d2", textDecoration: "none" }}
            >
              Register
            </Link>
            <Link
              to="/dashboard"
              style={{ color: "#1976d2", textDecoration: "none" }}
            >
              Dashboard
            </Link>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Connect
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <span role="img" aria-label="email">
              📧
            </span>
            <Typography variant="body2" color="#181818">
              franklinekober@gmail.com
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mt={1}>
            <span role="img" aria-label="phone">
              📞
            </span>
            <Typography variant="body2" color="#181818">
              +254 794 603 876
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mt={1}>
            <span role="img" aria-label="location">
              📍
            </span>
            <Typography variant="body2" color="#181818">
              Murang'a, Kenya
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Typography variant="body2" align="center" mt={4} color="#181818">
        © {new Date().getFullYear()} Tasky. Built with ❤️ by Kober.
      </Typography>
    </Box>
  );
};

export default Footer;
