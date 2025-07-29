import { useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dodgeSound from "../assets/dodge.mp3";
import Footer from "../components/Footer";

const LoginPage = () => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [buttonPosition, setButtonPosition] = useState<
    "left" | "right" | "center"
  >("center");
  const [isBouncing, setIsBouncing] = useState(false);

  const isValid = form.email.trim() !== "" && form.password.trim() !== "";

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
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post<{
        token: string;
        user: { id: string; name: string; email: string };
      }>("https://tasky-5jyl.onrender.com/api/auth/login", form);

      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("lastLoginTime", Date.now().toString());

      localStorage.setItem("user", JSON.stringify(user));

      console.log("Login successful, navigating to dashboard...");
      navigate("/dashboard");
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
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
          background: "linear-gradient(to right,#bbbbbb, #e0f7fa, #fce4ec)",
          px: 2,
        }}
      >
        <Paper elevation={6} sx={{ p: 4, maxWidth: 500, width: "100%" }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            color="primary"
            mb={2}
          >
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={handleChange}
              autoComplete="email" 
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password" 
            />

            <Box mt={3} sx={{ position: "relative", height: 56 }}>
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
                Login
              </Button>
              <audio ref={audioRef} src={dodgeSound} />
            </Box>

            <Typography variant="body2" align="center" mt={3}>
              Don’t have an account?{" "}
              <span
                style={{ color: "#1976d2", cursor: "pointer" }}
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </Typography>
          </form>
        </Paper>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </Box>

      <Footer />
    </>
  );
};

export default LoginPage;
