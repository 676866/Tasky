import { Box, Grid, Typography, Fade, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Facebook, Instagram, GitHub, X } from "@mui/icons-material";

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
          py: 6,
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

          <Grid item xs={12} md={9}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
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
                        color: "#931297ff",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(5px)"
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(0)"
                      }
                    >
                      {item.label}
                    </Link>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
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

              <Grid item xs={12} sm={4}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Follow me:
                </Typography>
                <Box display="flex" gap={1}>
                  {[
                    {
                      icon: <Facebook />,
                      href: "https://facebook.com/yourprofile",
                      label: "Facebook",
                    },
                    {
                      icon: <Instagram />,
                      href: "https://instagram.com/yourprofile",
                      label: "Instagram",
                    },
                    {
                      icon: <GitHub />,
                      href: "https://github.com/yourprofile",
                      label: "GitHub",
                    },
                    {
                      icon: <X />,
                      href: "https://x.com/yourprofile",
                      label: "X",
                    },
                  ].map((item, index) => (
                    <IconButton
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener"
                      aria-label={item.label}
                      sx={{
                        color: "#931297ff",
                        transition: "transform 0.3s ease",
                        ":hover": {
                          transform: "scale(1.2) rotate(10deg)",
                        },
                      }}
                    >
                      {item.icon}
                    </IconButton>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Typography variant="body2" align="center" mt={6} color="#181818">
          © {new Date().getFullYear()} Tasky. All rights reserved.
        </Typography>
      </Box>
    </Fade>
  );
};

export default Footer;
