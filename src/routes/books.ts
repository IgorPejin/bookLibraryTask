import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  addBook,
  updateBookById,
  deleteBookById,
  getRecommendations,
  importBooks,
} from "../handlers/books";

const router = Router();

router.get("/", getAllBooks);
router.post("/", addBook);
router.get("/:id", getBookById);
router.put("/:id", updateBookById);
router.delete("/:id", deleteBookById);

router.get("/recommendations/:genre", getRecommendations);
router.get("/import", importBooks);

export default router;
