import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../api/utils";
import {login} from "../api/auth";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setAuthToken("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authResponse = await login({ username, password });
      localStorage.setItem("token", authResponse.jwt);
      localStorage.setItem("refreshToken", authResponse.refreshToken);
      localStorage.setItem("userId", authResponse.userId);
      localStorage.setItem("role", authResponse.role);
      setAuthToken(authResponse.jwt);

      if (authResponse.role === "CPA") {
        navigate("/cpa/dashboard");
      } else if (authResponse.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        console.error("Unknown role:", authResponse.role);
        navigate("/login");
      }
    } catch (err) {
      setError("Username or password is incorrect.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 2,
            backgroundColor: "#fff",
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1976d2" }}
          >
            Login
          </Typography>
          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": { backgroundColor: "#115293" },
              }}
            >
              Login
            </Button>
          </form>
          <Typography align="center" sx={{ mt: 2 }}>
            Don’t have an account?{" "}
            <Button color="primary" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
