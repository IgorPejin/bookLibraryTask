import { useEffect, useState } from "react";
import Book from "./types/book";
import axios from "axios";

function App() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const getBooks = async () => {
      const booksResponse = await axios.get("http://localhost:3000/books");
      setBooks(booksResponse.data);
    };
    getBooks();
  }, []);

  return (
    <div>
      <h1>Connecting frontend and backend</h1>
      <p>Books: </p>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
