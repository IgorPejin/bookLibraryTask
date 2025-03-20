import fs from "fs/promises";
import { Book } from "../types/book";
import { LIBRARY_PATH } from "../configuration/properties";

let cache: Book[] = [];
let isWriting = false;
let writeQueue: (() => void)[] = [];

export class LibraryService {
  static async readBooksAndUpdateCache() {
    try {
      console.log("Reading library and updating cache . . .");
      const data = await fs.readFile(LIBRARY_PATH, "utf8");
      cache = JSON.parse(data);
      return cache;
    } catch (error) {
      console.error("Error reading books file:", error);
      return [];
    }
  }

  static async readAllBooks(): Promise<Book[]> {
    if (cache.length) {
      console.log("Returning library from cache!");
      return cache;
    }
    return await LibraryService.readBooksAndUpdateCache();
  }

  static async writeBooks(newBooks: Book[]) {
    if (isWriting) {
      return new Promise((resolve) => {
        writeQueue.push(() => this.writeBooks(newBooks).then(resolve));
      });
    }

    isWriting = true;
    console.log("Writing new books . . .");
    await fs.writeFile(LIBRARY_PATH, JSON.stringify(newBooks, null, 2));
    cache = newBooks;
    isWriting = false;

    if (writeQueue.length > 0) {
      const nextWrite = writeQueue.shift();
      nextWrite?.();
    }
  }

  static async addBook(newBook: Book): Promise<Book | Error> {
    const books = await this.readAllBooks();
    const bookFound = books.find((book) => book.id === newBook.id);
    if (bookFound === undefined) {
      books.push(newBook);
      await this.writeBooks(books);
      return newBook;
    }
    return new Error("Book is already added!");
  }

  static async updateBook(
    updateBookId: string,
    newBookData: Book
  ): Promise<Book | Error> {
    const books = await this.readAllBooks();
    const bookFound = books.find((book) => book.id === updateBookId);
    if (bookFound === undefined) {
      return new Error("Book that you want to update does not exist!");
    } else {
      const updatedBooks = books.map((book) =>
        book.id === updateBookId ? { ...book, ...newBookData } : book
      );
      await this.writeBooks(updatedBooks);
      return bookFound;
    }
  }

  static async getRecommendations(genre: string): Promise<Book[]> {
    const books = await this.readAllBooks();
    const recommendedBooks = books
      .filter((book) => book.recommendations >= 6 && book.genre === genre)
      .slice(0, 4);
    return recommendedBooks;
  }
}
