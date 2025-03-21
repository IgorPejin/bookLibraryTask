import { useEffect, useRef, useState } from "react";
import styles from "./BookListings.module.css";
import Book from "../../types/book";
import axios from "axios";
import Recommendations from "./Recommendations/Recommendations";
import LibraryListing from "./LibraryListing/LibraryListing";

const BOOKS_PER_PAGE = 10;

function BookListings() {
  const [books, setBooks] = useState<Book[]>([]);
  const [booksForPage, setBooksForPage] = useState<Book[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const startIndex = useRef(0);
  const endIndex = useRef(0);

  useEffect(() => {
    const getBooks = async () => {
      const booksResponse = await axios.get("http://localhost:3000/books");
      setBooks(booksResponse.data);
    };
    if (books.length === 0) {
      setCurrentPage(1);
      getBooks();
    } else {
      startIndex.current = (currentPage - 1) * BOOKS_PER_PAGE;
      endIndex.current = startIndex.current + BOOKS_PER_PAGE;
      setBooksForPage(books.slice(startIndex.current, endIndex.current));
    }
    setTotalPages(Math.ceil(books.length / BOOKS_PER_PAGE));
  }, [books, books.length, currentPage]);

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

  const setPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.bookListingsWrapper}>
      <Recommendations />
      <LibraryListing
        books={booksForPage}
        addBook={addBook}
        updateBooks={updateBooks}
        deleteBook={deleteBook}
        updateBooksBatched={updateBooksBatched}
        totalPages={totalPages}
        currentPage={currentPage}
        setPage={setPage}
      />
    </div>
  );
}

export default BookListings;
