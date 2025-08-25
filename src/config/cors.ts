import cors, { CorsOptions } from "cors";

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173", 
  "http://localhost:3000",
];

export const corsConfig: CorsOptions = {
  origin(origin, cb) {
    // Permitir tools como Postman (sin origin) y orígenes en whitelist
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: false, // true solo si usas cookies
};

export const corsMiddleware = cors(corsConfig);
