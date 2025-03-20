import axios from "axios";
import { getRandomColor } from "../../../utils/randomColor";
import styles from "./Recommendations.module.css";
import RecommendedBook from "./RecommendedBook/RecommendedBook";
import { useEffect, useState } from "react";
import Book from "../../../types/book";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { genres, Option } from "../../../utils/genres";

const Recommendations = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Option | null>(null);

  useEffect(() => {
    const getBooks = async () => {
      const booksResponse = await axios.get(
        `http://localhost:3000/books/recommendations/${selectedGenre?.label}`
      );
      setBooks(booksResponse.data);
    };
    if (selectedGenre) getBooks();
  }, [selectedGenre]);

  const handleChange = (event: React.SyntheticEvent, value: Option | null) => {
    event.preventDefault();
    setSelectedGenre(value);
  };

  const handleClear = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setBooks([]);
  };

  return (
    <div className={styles.recommendationsWrapper}>
      <div className={styles.recommendationsOptions}>
        <h2>Books recommended by genre: </h2>
        <Autocomplete
          options={genres}
          onChange={handleChange}
          onInputChange={handleClear}
          value={selectedGenre}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Genre" />}
        />
      </div>

      <ul className={styles.recommendationsList}>
        {books.length === 0
          ? selectedGenre === null
            ? "Select a genre ✨"
            : "There are no books to recommend at this time 🥺"
          : books.map((book) => (
              <RecommendedBook
                key={book.id}
                book={book}
                backgroundColor={getRandomColor()}
              />
            ))}
      </ul>
    </div>
  );
};

export default Recommendations;
