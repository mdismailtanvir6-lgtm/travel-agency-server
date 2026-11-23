// index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.route.js";
import destinationsRouter from "./routes/destinations.route.js";

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://travel-agency-client-omega.vercel.app/",
  ...(process.env.CLIENT_URLS?.split(",") ?? []),
]
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: [...new Set(allowedOrigins)] }));
app.use(express.json());

// Port (hosting platforms such as Render set PORT)
const port = process.env.PORT || 5000;

// Root
app.get("/", (req, res) => {
  res.send("Hello World from the server!");
});

// Mount routes
app.use("/users", usersRouter);
app.use("/destinations", destinationsRouter);

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
