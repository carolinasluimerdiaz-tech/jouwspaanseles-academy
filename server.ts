
import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, "users.json");

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

function getUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveUsers(users: any[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Email Transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'jouwspaanseles@gmail.com',
      pass: process.env.EMAIL_PASS,
    },
  });

  // API Routes
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, text } = req.body;
    if (!process.env.EMAIL_PASS) {
      return res.status(500).json({ error: "EMAIL_PASS no configurada" });
    }
    try {
      await transporter.sendMail({
        from: `"ZayroLingua Academy" <${process.env.EMAIL_USER || 'jouwspaanseles@gmail.com'}>`,
        to,
        subject,
        text,
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Fallo al enviar email" });
    }
  });

  // User Auth Routes
  app.post("/api/auth/register", (req, res) => {
    const userData = req.body;
    const users = getUsers();
    if (users.find((u: any) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return res.status(400).json({ error: "Este correo ya está registrado." });
    }
    users.push(userData);
    saveUsers(users);
    res.json({ success: true });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();
    
    // Master Creator check
    if (email.toLowerCase() === 'jouwspaanseles@gmail.com' && password === 'ZAYRO_MASTER') {
      let creator = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (!creator) {
        creator = {
          name: 'Zayro Creator',
          email: 'jouwspaanseles@gmail.com',
          password: 'ZAYRO_MASTER',
          stats: { xp: 1000, level: 5, streak: 1, hearts: 5, medals: [], dailyUsageMinutes: 0, lastUsageDate: new Date().toISOString().split('T')[0] },
          completedModules: [],
          completedVideos: [],
          completedTasks: [],
          activityLog: [{ id: 'init', action: 'Cuenta de Creador Activada', timestamp: Date.now(), xpEarned: 1000 }],
          isFreeUser: false
        };
        users.push(creator);
        saveUsers(users);
      }
      return res.json({ success: true, user: creator });
    }

    // Master Carolina check
    if (email.toLowerCase() === 'carolinasluimerdiaz@gmail.com' && password === 'zayro2025') {
      let carolina = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (!carolina) {
        carolina = {
          name: 'Carolina',
          email: 'carolinasluimerdiaz@gmail.com',
          password: 'zayro2025',
          stats: { xp: 500, level: 2, streak: 1, hearts: 5, medals: [], dailyUsageMinutes: 0, lastUsageDate: new Date().toISOString().split('T')[0] },
          completedModules: [],
          completedVideos: [],
          completedTasks: [],
          activityLog: [{ id: 'init', action: 'Cuenta Maestra Activada', timestamp: Date.now(), xpEarned: 500 }],
          isFreeUser: false
        };
        users.push(carolina);
        saveUsers(users);
      }
      return res.json({ success: true, user: carolina });
    }

    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ error: "Email o contraseña inválidos." });
    }
  });

  app.get("/api/auth/user", (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email requerido." });
    
    const users = getUsers();
    const user = users.find((u: any) => u.email.toLowerCase() === (email as string).toLowerCase());
    if (user) {
      // Don't send password back
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } else {
      res.status(404).json({ error: "Usuario no encontrado." });
    }
  });

  app.post("/api/auth/update", (req, res) => {
    const userData = req.body;
    const users = getUsers();
    const idx = users.findIndex((u: any) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (idx !== -1) {
      users[idx] = userData;
      saveUsers(users);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Usuario no encontrado." });
    }
  });

  app.post("/api/check-permission", (req, res) => {
    // Always allowed now to avoid blocking users
    res.json({ allowed: true });
  });

  app.get("/api/config", (req, res) => {
    res.json({
      apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY || ""
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
