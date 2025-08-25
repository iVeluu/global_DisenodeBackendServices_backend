import { CorsOptions } from "cors";

const whitelist = [
  "https://global-disenode-backend-services-fr.vercel.app",
  "http://localhost:5173",
  "http://localhost:4000",
];

export const corsOptions: CorsOptions = {
  origin(origin, cb) {
    // Permite tools sin Origin (Postman/cURL)
    if (!origin) return cb(null, true);
    if (whitelist.includes(origin)) return cb(null, true);
    return cb(new Error('CORS: Origin no permitido'));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};