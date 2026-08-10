import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();
const prisma = new PrismaClient();

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/avatars";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // максимум 2МБ
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/"))
      return cb(new Error("Тільки зображення!"));
    cb(null, true);
  },
});

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        avatarPath: true,
        createdAt: true,
        _count: { select: { libraryItems: true } },
      },
    });

    if (!user)
      return res.status(404).json({ error: "Користувач не знайдений." });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Помилка сервера." });
  }
});

router.put("/", uploadAvatar.single("avatar"), async (req, res) => {
  const { username } = req.body;

  try {
    const current = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    let avatarPath = current.avatarPath;

    if (req.file) {
      if (current.avatarPath) {
        const oldPath = `.${current.avatarPath}`;
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      avatarPath = `/uploads/avatars/${req.file.filename}`;
    }

    const updateData = { avatarPath };
    if (username && username !== current.username) {
      const taken = await prisma.user.findUnique({ where: { username } });
      if (taken)
        return res
          .status(409)
          .json({ error: "Це ім'я користувача вже зайнято." });
      updateData.username = username;
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: { id: true, email: true, username: true, avatarPath: true },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка при обновленні профілю." });
  }
});

export default router;
