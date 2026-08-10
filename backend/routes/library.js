import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/covers";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Тільки зображення!"));
    }
    cb(null, true);
  },
});

router.use(authenticate);

router.get("/", async (req, res) => {
  const { category, search, minRating, favorites, sort = "newest" } = req.query;

  try {
    const where = {
      userId: req.user.id,
    };

    if (category) where.category = category;
    if (favorites === "true") where.isFavorite = true;
    if (minRating) where.rating = { gte: parseInt(minRating) };

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const orderBy = {
      newest: { createdAt: "desc" },
      rating: { rating: "desc" },
      year_new: { year: "desc" },
      year_old: { year: "asc" },
      title: { title: "asc" },
    }[sort] || { createdAt: "desc" };

    const items = await prisma.libraryItem.findMany({ where, orderBy });

    res.json(items);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Помилка сервера при отриманні бібліотеки." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await prisma.libraryItem.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id,
      },
    });

    if (!item) return res.status(404).json({ error: "Елемент не знайдений." });

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка сервера." });
  }
});

router.post("/", upload.single("cover"), async (req, res) => {
  const {
    title,
    category,
    description,
    review,
    rating,
    year,
    status,
    currentProgress,
    totalProgress,
    progressType,
    isFavorite,
  } = req.body;

  if (!title || !category || !status) {
    return res
      .status(400)
      .json({ error: "Заповніть обов'язкові поля: назва, категорія, статус." });
  }

  try {
    const item = await prisma.libraryItem.create({
      data: {
        title,
        category,
        description: description || "",
        review: review || "",
        rating: parseInt(rating) || 0,
        year: parseInt(year) || new Date().getFullYear(),
        status,
        currentProgress: currentProgress ? parseInt(currentProgress) : null,
        totalProgress: totalProgress ? parseInt(totalProgress) : null,
        progressType: progressType || "",
        isFavorite: isFavorite === "true" || isFavorite === true,
        coverPath: req.file ? `/uploads/covers/${req.file.filename}` : null,
        userId: req.user.id,
      },
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка сервера при створенні елемента." });
  }
});

router.put("/:id", upload.single("cover"), async (req, res) => {
  const {
    title,
    category,
    description,
    review,
    rating,
    year,
    status,
    currentProgress,
    totalProgress,
    progressType,
    isFavorite,
  } = req.body;

  try {
    const existing = await prisma.libraryItem.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });

    if (!existing)
      return res.status(404).json({ error: "Елемент не знайдений." });

    let coverPath = existing.coverPath;
    if (req.file) {
      if (existing.coverPath) {
        const oldPath = `.${existing.coverPath}`;
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      coverPath = `/uploads/covers/${req.file.filename}`;
    }

    const updated = await prisma.libraryItem.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        category,
        description: description || "",
        review: review || "",
        rating: parseInt(rating) || 0,
        year: parseInt(year) || new Date().getFullYear(),
        status,
        currentProgress: currentProgress ? parseInt(currentProgress) : null,
        totalProgress: totalProgress ? parseInt(totalProgress) : null,
        progressType: progressType || "",
        isFavorite: isFavorite === "true" || isFavorite === true,
        coverPath,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка сервера при оновленні." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const existing = await prisma.libraryItem.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });

    if (!existing)
      return res.status(404).json({ error: "Елемент не знайдений." });

    if (existing.coverPath) {
      const filePath = `.${existing.coverPath}`;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await prisma.libraryItem.delete({ where: { id: parseInt(req.params.id) } });

    res.json({ message: "Елемент видалений." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка при видаленні." });
  }
});

router.patch("/:id/favorite", async (req, res) => {
  try {
    const existing = await prisma.libraryItem.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
    });

    if (!existing)
      return res.status(404).json({ error: "Елемент не знайдений." });

    const updated = await prisma.libraryItem.update({
      where: { id: parseInt(req.params.id) },
      data: { isFavorite: !existing.isFavorite },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка при оновленні обраного." });
  }
});

export default router;
