import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
} from "@mui/material";
import dodgeSound from "../assets/dodge.mp3";
import Footer from "../components/Footer";

const RegisterPage = () => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [buttonPosition, setButtonPosition] = useState<
    "left" | "right" | "center"
  >("center");
  const [isBouncing, setIsBouncing] = useState(false);

  const isValid =
    Object.values(form).every((v) => v.trim() !== "") &&
    form.password === form.confirmPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMouseEnter = () => {
    if (!isValid) {
      setButtonPosition((prev) => (prev === "left" ? "right" : "left"));
      setIsBouncing(true);
      audioRef.current?.play();
      setTimeout(() => setIsBouncing(false), 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValid) {
      setError("Please fill in all fields correctly");
      return;
    }

    const registerData = {
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
      email: form.email,
      password: form.password,
    };

    try {
      await axios.post("http://localhost:5000/api/auth/register", registerData);
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed";
      setError(message);
    }
  };

  return (
    <>
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          background: "linear-gradient(to bottom right, #fde2e4, #cfe0fc)",
          px: 2,
        }}
      >
        <Paper elevation={6} sx={{ p: 4, maxWidth: 600, width: "100%" }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            color="primary"
            mb={3}
          >
            Register
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Box mt={4} sx={{ position: "relative", height: 56 }}>
              <Button
                type="submit"
                variant="contained"
                color={isValid ? "success" : "primary"}
                disabled={!isValid}
                onMouseEnter={handleMouseEnter}
                sx={{
                  position: "absolute",
                  top: 0,
                  transform: `translateX(${
                    buttonPosition === "center"
                      ? "-50%"
                      : buttonPosition === "left"
                        ? "0"
                        : "calc(100% - 120px)"
                  })`,
                  left:
                    buttonPosition === "center"
                      ? "50%"
                      : buttonPosition === "left"
                        ? 0
                        : "unset",
                  right: buttonPosition === "right" ? 0 : "unset",
                  width: 120,
                  transition: "transform 0.3s, left 0.3s, right 0.3s",
                  animation: isBouncing ? "bounce 0.3s" : "none",
                }}
              >
                Register
              </Button>
              <audio ref={audioRef} src={dodgeSound} />
            </Box>
          </form>

          <Typography variant="body2" align="center" mt={3}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#1976d2" }}>
              Login
            </Link>
          </Typography>

          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
          `}</style>
        </Paper>
      </Box>

      <Footer />
    </>
  );
};

export default RegisterPage;
