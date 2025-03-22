import {
  Box,
  IconButton,
  ListItemText,
  MenuItem,
  Rating,
  Select,
  Typography,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import Book from "../../../../types/book";
import { useState } from "react";
import axios from "axios";
import styles from "./BookRating.module.css";

interface Props {
  book: Book;
  rating: number;
  handleRatingChange: (bookId: string, newValue: number) => void;
}

function BookRating(props: Props) {
  const [isRatingEnabled, setIsRatingEnabled] = useState<boolean>(false);
  const handleUpdateRating = async (
    event: React.SyntheticEvent | undefined,
    newRating: number | null,
    book: Book
  ) => {
    event?.preventDefault();
    setIsRatingEnabled(true);

    if (newRating !== null) props.handleRatingChange(book.id, newRating);

    book.isSelected = true;

    let toRecommend = newRating && newRating > 5 ? true : false;

    //edge case when user clicks same rating
    if (newRating === null) {
      toRecommend = props.rating > 5 ? true : false;
    }

    let newBookRecommendations = 0;
    let newBookNonRecommendations = 0;

    if (
      book.recommendations !== undefined &&
      book.nonrecommendations !== undefined
    ) {
      newBookRecommendations = toRecommend
        ? ++book.recommendations
        : book.recommendations;

      newBookNonRecommendations = !toRecommend
        ? ++book.nonrecommendations
        : book.nonrecommendations;
    }

    const updatedBook: Book = {
      id: props.book.id,
      title: props.book.title,
      author: props.book.author,
      year: props.book.year,
      genre: props.book.genre,
      recommendations: newBookRecommendations,
      nonrecommendations: newBookNonRecommendations,
    };
    const recommendationsResponse = await axios.put(
      `http://localhost:3000/books/recommendations/${toRecommend}}`,
      updatedBook
    );
    if (recommendationsResponse.data.error) {
      alert(recommendationsResponse.data.error);
    }
  };
  const handleUndoRating = () => {
    setIsRatingEnabled(false);
  };
  return (
    <ListItemText>
      <Box>
        <Typography component="legend">
          <div style={{ display: "flex", alignItems: "center" }}>
            {isRatingEnabled && (
              <>
                <IconButton
                  size="small"
                  sx={{ marginRight: "0.2rem", padding: "0" }}
                  onClick={() => handleUndoRating()}
                  color="primary"
                >
                  <ReplayIcon />
                </IconButton>
              </>
            )}
            {isRatingEnabled ? "✍️ Rated!" : "🤔 Rate this book ?"}
          </div>
        </Typography>
        <div className={styles.bookRating}>
          <Rating
            size="small"
            disabled={isRatingEnabled}
            name="simple-controlled"
            value={props.rating}
            max={10}
            onChange={(event, newValue) =>
              handleUpdateRating(event, newValue, props.book)
            }
          />
        </div>

        <div className={styles.bookRatingMobile}>
          <Select
            onChange={(e) =>
              handleUpdateRating(undefined, Number(e.target.value), props.book)
            }
            defaultValue={1}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
        </div>
      </Box>
    </ListItemText>
  );
}

export default BookRating;
