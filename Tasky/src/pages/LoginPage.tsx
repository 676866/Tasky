import { useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
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
      type LoginResponse = {
        user: any;
        token: string;
      };

      const res = await axios.post<LoginResponse>(
        "https://tasky-5jyl.onrender.com/api/auth/login",
        form
      );

      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("lastLoginTime", Date.now().toString());

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
          backgroundColor: "#0f0f0f",
          px: 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            p: 4,
            width: "90%",
            maxWidth: 400,
            borderRadius: "20px",
            overflow: "hidden",
            "::before": {
              content: '""',
              position: "absolute",
              top: "-2px",
              left: "-2px",
              width: "calc(100% + 4px)",
              height: "calc(100% + 4px)",
              background: `linear-gradient(45deg, #00f0ff, #ff4081, #00f0ff, #ff4081)`,
              backgroundSize: "400% 400%",
              borderRadius: "20px",
              animation: "rotateBox 6s linear infinite",
              zIndex: 0,
            },
            "::after": {
              content: '""',
              position: "absolute",
              inset: "4px",
              backgroundColor: "#161515ff",
              borderRadius: "15px",
              zIndex: 1,
            },
            zIndex: 2,
          }}
        >
          <Box sx={{ position: "relative", zIndex: 3 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              textAlign="center"
              color="#b172e8ff"
              mb={2}
            >
              LOGIN
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
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#00e5ff" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  input: { color: "#fff" },
                  label: { color: "#ccc" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#00e5ff" },
                    "&:hover fieldset": { borderColor: "#00ffff" },
                  },
                }}
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
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#00e5ff" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  input: { color: "#fff" },
                  label: { color: "#ccc" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#00e5ff" },
                    "&:hover fieldset": { borderColor: "#00ffff" },
                  },
                }}
              />

              <Box mt={3} sx={{ position: "relative", height: 56 }}>
                <Button
                  type="submit"
                  variant="contained"
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
                    backgroundColor: "#00e5ff",
                    color: "#000",
                    fontWeight: "bold",
                    borderRadius: "25px",
                    transition: "all 0.3s",
                    animation: isBouncing ? "bounce 0.3s" : "none",
                    "&:hover": {
                      backgroundColor: "#00ffff",
                    },
                  }}
                >
                  Sign In
                </Button>
                <audio ref={audioRef} src={dodgeSound} />
              </Box>

              <Box
                mt={3}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" color="#bbb">
                  Forgot Password
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#2ae3e9ff", cursor: "pointer" }}
                  onClick={() => navigate("/register")}
                >
                  Sign up
                </Typography>
              </Box>
            </form>
          </Box>
        </Box>

        <style>{`
          @keyframes rotateBox {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

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
