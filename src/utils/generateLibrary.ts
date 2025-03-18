import fs from "fs/promises";
import { faker } from "@faker-js/faker";
import { Book } from "../types/book";
import {
  INITAL_BOOKS_NUMBER,
  MAX_BOOK_RATING,
} from "../configuration/properties";

async function generateBooks(): Promise<Book[]> {
  const books: Book[] = [];
  for (let i = 0; i < INITAL_BOOKS_NUMBER; i++) {
    books.push({
      id: faker.commerce.isbn(10),
      title: faker.book.title(),
      author: faker.book.author(),
      year: faker.date.past({ years: 100 }).getFullYear(),
      genre: faker.book.genre(),
      recommendations: Math.floor(Math.random() * MAX_BOOK_RATING) + 1,
    });
  }
  return books;
}

async function initializeLibrary(books: Book[], path: string) {
  try {
    await fs.access(path);
    console.log("Library already exists! Proceeding . . .");
  } catch (error) {
    console.log(
      `\nError occured: \n ${error}\n No library detected. Generating a new one . . .\n`
    );
    try {
      const booksJson = JSON.stringify(books, null, 2);
      await fs.writeFile(path, booksJson);
    } catch (error) {
      console.log("Path does not exist!");
    }
  }
}

export default async function generateLibrary(path: string) {
  const seededParam = process.argv.slice(2);
  if (seededParam[1] !== "true") return;

  console.log("Generating library . . .");
  const books = await generateBooks();
  initializeLibrary(books, path);
  console.log("Books generated !");
}
