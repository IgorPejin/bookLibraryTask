import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  addBook,
  updateBookById,
  deleteBookById,
  getRecommendations,
  updateRecommendations,
  importBooks,
} from "../handlers/books";
import fileUpload from "express-fileupload";

const router = Router();

router.use(fileUpload());
router.get("/", getAllBooks);
router.post("/", addBook);
router.get("/:id", getBookById);
router.put("/:id", updateBookById);
router.delete("/:id", deleteBookById);

router.get("/recommendations/:genre", getRecommendations);
router.put("/recommendations/:toRecommend", updateRecommendations);
router.post("/import", importBooks);

export default router;
