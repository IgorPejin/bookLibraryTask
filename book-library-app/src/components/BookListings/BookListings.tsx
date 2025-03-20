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
  const updateBooksBatched = (books: Book[]) => {
    setBooks(() => [...books]);
  };
  const updateBooks = (newBookData: Book) => {
    const updatedBooks = books.map((book) =>
      book.id === newBookData.id ? { ...book, ...newBookData } : book
    );
    setBooks(() => [...updatedBooks]);
  };
  const deleteBook = (bookToDelete: Book) => {
    const updatedBooks = books.filter((book) => book.id !== bookToDelete.id);
    setBooks(() => [...updatedBooks]);
  };

  return (
    <div className={styles.bookListingsWrapper}>
      <Recommendations />
      <LibraryListing
        books={books}
        addBook={addBook}
        updateBooks={updateBooks}
        deleteBook={deleteBook}
        updateBooksBatched={updateBooksBatched}
      />
    </div>
  );
}

export default BookListings;
