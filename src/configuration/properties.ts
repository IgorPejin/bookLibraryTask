import path from "path";

export const INITAL_BOOKS_NUMBER = 50;
export const MAX_BOOK_RATING = 10;

export const LIBRARY_PATH = path.join(
  __dirname,
  "..",
  "repository",
  "books.json"
);
export const SERVER_PORT = 3000;
