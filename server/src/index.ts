import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import { authenticate } from "./middleware/authMiddleware";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://tasky-umber-two.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", taskRoutes);

app.get("/", (req, res) => {
  res.send("Hello Frankit, your API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
