import {
  Box,
  IconButton,
  ListItemText,
  Rating,
  Typography,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import Book from "../../../../types/book";
import { useState } from "react";
import axios from "axios";

interface Props {
  book: Book;
  rating: number;
  handleRatingChange: (bookId: string, newValue: number) => void;
}

function BookRating(props: Props) {
  const [isRatingEnabled, setIsRatingEnabled] = useState<boolean>(false);
  const handleUpdateRating = async (
    event: React.SyntheticEvent,
    newRating: number | null,
    book: Book
  ) => {
    event.preventDefault();
    setIsRatingEnabled(true);

    if (newRating !== null) props.handleRatingChange(book.id, newRating);

    book.isSelected = true;

    const toRecommend = newRating && newRating > 5 ? true : false;

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
                  sx={{ marginRight: "2rem", padding: "0" }}
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
        <Rating
          disabled={isRatingEnabled}
          name="simple-controlled"
          value={props.rating}
          max={10}
          onChange={(event, newValue) =>
            handleUpdateRating(event, newValue, props.book)
          }
        />
      </Box>
    </ListItemText>
  );
}

export default BookRating;
