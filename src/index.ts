import express from "express";
import cors from "cors";
import booksRouter from "./routes/books";
import generateLibrary from "./utils/generateLibrary";
import { LIBRARY_PATH, SERVER_PORT } from "./configuration/properties";

const libraryApp = express();

const corsOptions = {
  origin: [`http://localhost:4000`],
  optionsSuccessStatus: 200,
};

generateLibrary(LIBRARY_PATH);

libraryApp.use(cors(corsOptions));
libraryApp.use(express.json());

libraryApp.use("/books", booksRouter);

libraryApp.listen(SERVER_PORT, () => {
  console.log(`Library app running on port! ${SERVER_PORT}`);
});
