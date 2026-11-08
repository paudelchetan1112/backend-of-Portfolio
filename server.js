import express from "express";
import dotenv from "dotenv"
import userRoute from "./routes/userRoute.js";
import contactRoute from "./routes/contactRoute.js";
import { dbConnect } from "./database/db.js";
import projectRoute from "./routes/projectRoute.js";
import healthzRoute from "./routes/healthzRoute.js";
import cors from "cors"

const allowedOrigins = [
  'https://chetanpaudel.com.np',
  'http://localhost:3000'
];

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use("/api/", userRoute);
app.use("/api/", projectRoute);
app.use("/api/contact/", contactRoute);
app.use("/api/healthz", healthzRoute);

console.log(process.env.MONGODBURI);
const port = process.env.PORT;
dbConnect();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  

  const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;
  if (RENDER_EXTERNAL_URL) {
    const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes
    
    setInterval(async () => {
      try {

        const response = await fetch(`${RENDER_EXTERNAL_URL}/api/healthz`);
        console.log(`[Keep-Alive] Pinged ${RENDER_EXTERNAL_URL}/api/healthz - Status: ${response.status}`);
      } catch (error) {
        console.error('[Keep-Alive] Failed to ping self:', error.message);
      }
    }, PING_INTERVAL);
  }
});
