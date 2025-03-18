import express from "express";
import booksRouter from "./routes/books";

const libraryApp = express();

libraryApp.use("/books", booksRouter);

const PORT = 3000;

libraryApp.listen(PORT, () => {
  console.log(`Library app running on port! ${PORT}`);
});
