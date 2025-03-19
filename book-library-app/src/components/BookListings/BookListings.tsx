import { useEffect, useState } from "react";
import styles from "./BookListings.module.css";
import Book from "../../types/book";
import axios from "axios";
import Recommendations from "./Recommendations/Recommendations";
import LibraryListing from "./LibraryListing/LibraryListing";

function BookListings() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const getBooks = async () => {
      const booksResponse = await axios.get("http://localhost:3000/books");
      setBooks(booksResponse.data);
    };
    getBooks();
  }, []);

  const addBook = (book: Book) => {
    setBooks([...books, book]);
  };

  return (
    <div className={styles.bookListingsWrapper}>
      <Recommendations />
      <LibraryListing books={books} addBook={addBook} />
    </div>
  );
}

export default BookListings;
