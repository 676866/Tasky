import { Box, Grid, Typography, Fade } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Footer = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <Fade in={true} timeout={1000}>
      <Box
        component="footer"
        data-aos="fade-up"
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
          <Grid item xs={12} md={3}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              ➤ Tasky
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track your time, boost your productivity, and maximize your daily earnings.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {[
                { to: "/", label: "Home" },
                { to: "/login", label: "Login" },
                { to: "/register", label: "Register" },
                { to: "/dashboard", label: "Dashboard" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    color: "#1976d2",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(0)";
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Connect
            </Typography>

            {[
              { icon: "📧", label: "Email", value: "franklinekober@gmail.com" },
              { icon: "📞", label: "Phone", value: "+254 794 603 876" },
              { icon: "📍", label: "Location", value: "Murang'a, Kenya" },
            ].map((item, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap={1}
                mt={index === 0 ? 0 : 1}
                sx={{
                  "& span": {
                    display: "inline-block",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    ":hover": {
                      transform: "rotate(10deg) scale(1.2)",
                    },
                  },
                }}
              >
                <span role="img" aria-label={item.label}>
                  {item.icon}
                </span>
                <Typography variant="body2" color="#181818">
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>
        <Typography variant="body2" align="center" mt={4} color="#181818">
          © {new Date().getFullYear()} Tasky. Built with ❤️ by Kober.
        </Typography>
      </Box>
    </Fade>
  );
};

export default Footer;
