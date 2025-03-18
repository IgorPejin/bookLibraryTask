import path from "path";
import express from "express";
import cors from "cors";
import booksRouter from "./routes/books";
import generateLibrary from "./utils/generateLibrary";

const PORT = 3000;
const LIBRARY_PATH = path.join(__dirname, "repository", "books.json");

const libraryApp = express();

const corsOptions = {
  origin: [`http://localhost:4000`],
  optionsSuccessStatus: 200,
};

generateLibrary(LIBRARY_PATH);

libraryApp.use(cors(corsOptions));
libraryApp.use(express.json());

libraryApp.use("/books", booksRouter);

libraryApp.listen(PORT, () => {
  console.log(`Library app running on port! ${PORT}`);
});
