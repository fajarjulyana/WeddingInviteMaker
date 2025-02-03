import type { Express } from "express";
import { createServer } from "http";
import Database from "better-sqlite3";
import slugify from "slugify";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

// Define constants
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10); // 10MB default

// Set up file storage with multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize multer middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

// Initialize SQLite database
const db = new Database('database.sqlite');

// Create tables if they don't exist
db.prepare(`CREATE TABLE IF NOT EXISTS invitations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE,
  brideNames TEXT,
  groomNames TEXT,
  date TEXT,
  venue TEXT,
  photos TEXT,
  musicUrl TEXT,
  templateId TEXT
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS guestbook (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invitationId INTEGER,
  name TEXT,
  message TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(invitationId) REFERENCES invitations(id)
)`).run();

export function registerRoutes(app: Express) {
  // Create HTTP server
  const httpServer = createServer(app);

  // Ensure uploads directory exists
  (async () => {
    try {
      await fs.access(UPLOAD_DIR);
    } catch {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
  })();

  // Create Invitation
  app.post("/api/invitations", upload.fields([
    { name: 'musicFile', maxCount: 1 },
    { name: 'photos', maxCount: 7 }
  ]), (req, res) => {
    try {
      const { brideNames, groomNames, date, venue, templateId } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const musicFile = files['musicFile']?.[0];
      const photos = files['photos'] || [];

      const combinedNames = `${brideNames}-${groomNames}`;
      const slug = slugify(combinedNames, { lower: true, strict: true });

      const stmt = db.prepare(`INSERT INTO invitations (slug, brideNames, groomNames, date, venue, photos, musicUrl, templateId) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
      const info = stmt.run(
        slug,
        brideNames,
        groomNames,
        date,
        venue,
        JSON.stringify(photos.map(photo => `/uploads/${photo.filename}`)), // Save as a JSON string
        musicFile ? `/uploads/${musicFile.filename}` : null,
        templateId
      );

      const invitation = db.prepare(`SELECT * FROM invitations WHERE id = ?`).get(info.lastInsertRowid);
      // Parse photos when sending response
      invitation.photos = invitation.photos ? JSON.parse(invitation.photos) : [];

      res.json(invitation);
    } catch (error) {
      console.error('Error creating invitation:', error);
      res.status(500).json({ message: "Failed to create invitation" });
    }
  });

  // Get Invitation by Slug
  app.get("/api/invitations/:slug", (req, res) => {
    try {
      const { slug } = req.params;
      const invitation = db.prepare(`SELECT * FROM invitations WHERE slug = ?`).get(slug);

      if (!invitation) {
        return res.status(404).json({ message: "Invitation not found" });
      }

      // Parse 'photos' field into an array
      invitation.photos = invitation.photos ? JSON.parse(invitation.photos) : [];

      res.json(invitation);
    } catch (error) {
      console.error('Error fetching invitation:', error);
      res.status(500).json({ message: "Failed to fetch invitation" });
    }
  });

  // Add Guestbook Entry
  app.post("/api/guestbook/:invitationId", (req, res) => {
    try {
      const { invitationId } = req.params;
      const { name, message } = req.body;

      const stmt = db.prepare(`INSERT INTO guestbook (invitationId, name, message) VALUES (?, ?, ?)`);
      const info = stmt.run(invitationId, name, message);

      const entry = db.prepare(`SELECT * FROM guestbook WHERE id = ?`).get(info.lastInsertRowid);
      res.json(entry);
    } catch (error) {
      console.error('Error creating guestbook entry:', error);
      res.status(500).json({ message: "Failed to create guestbook entry" });
    }
  });

  // Get Guestbook Entries
  app.get("/api/guestbook/:invitationId", (req, res) => {
    try {
      const { invitationId } = req.params;
      const entries = db.prepare(`SELECT * FROM guestbook WHERE invitationId = ? ORDER BY createdAt DESC`).all(invitationId);

      res.json(entries);
    } catch (error) {
      console.error('Error fetching guestbook entries:', error);
      res.status(500).json({ message: "Failed to fetch guestbook entries" });
    }
  });

  return httpServer;
}

