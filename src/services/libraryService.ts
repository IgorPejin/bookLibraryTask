import fs from "fs/promises";
import { Book } from "../types/book";
import { LIBRARY_PATH } from "../configuration/properties";

let cache: Book[] = [];

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
}
