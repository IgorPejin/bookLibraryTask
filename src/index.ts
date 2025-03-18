import express from "express";
import cors from "cors";
import booksRouter from "./routes/books";

const libraryApp = express();
const PORT = 3000;
const corsOptions = {
  origin: [`http://localhost:4000`],
  optionsSuccessStatus: 200,
};

libraryApp.use(cors(corsOptions));
libraryApp.use(express.json());

libraryApp.use("/books", booksRouter);

libraryApp.listen(PORT, () => {
  console.log(`Library app running on port! ${PORT}`);
});
