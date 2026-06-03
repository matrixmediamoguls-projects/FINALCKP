import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-36aa0f81/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all videos
app.get("/make-server-36aa0f81/videos", async (c) => {
  try {
    const videos = await kv.getByPrefix("video:");
    return c.json({ videos });
  } catch (error) {
    console.log(`Error fetching videos: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Get a single video by ID
app.get("/make-server-36aa0f81/videos/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const video = await kv.get(`video:${id}`);
    if (!video) {
      return c.json({ error: "Video not found" }, 404);
    }
    return c.json({ video });
  } catch (error) {
    console.log(`Error fetching video ${c.req.param("id")}: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Add or update a video
app.post("/make-server-36aa0f81/videos", async (c) => {
  try {
    const body = await c.req.json();
    const { id, title, videoUrl, duration, currentTime, thumbnail } = body;

    if (!id || !title || !videoUrl) {
      return c.json({ error: "Missing required fields: id, title, videoUrl" }, 400);
    }

    const video = {
      id,
      title,
      videoUrl,
      duration: duration || "0:00",
      currentTime: currentTime || 0,
      thumbnail: thumbnail || "",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`video:${id}`, video);
    return c.json({ video });
  } catch (error) {
    console.log(`Error saving video: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

// Initialize sample videos
app.post("/make-server-36aa0f81/init-videos", async (c) => {
  try {
    const sampleVideos = [
      {
        id: "VID-00421",
        title: "Sector 7 — Exterior Feed",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        duration: "12:34",
        currentTime: 261,
        thumbnail: "",
      },
    ];

    for (const video of sampleVideos) {
      await kv.set(`video:${video.id}`, {
        ...video,
        createdAt: new Date().toISOString(),
      });
    }

    return c.json({ message: "Sample videos initialized", count: sampleVideos.length });
  } catch (error) {
    console.log(`Error initializing videos: ${error}`);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);