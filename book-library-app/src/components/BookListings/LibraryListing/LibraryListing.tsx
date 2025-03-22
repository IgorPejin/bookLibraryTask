import { Button } from "@mui/material";
import Book from "../../../types/book";
import { styled } from "@mui/material/styles";
import styles from "./LibraryListing.module.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Pagination from "@mui/material/Pagination";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendAndArchiveIcon from "@mui/icons-material/SendAndArchive";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import axios from "axios";
import BookRating from "./BookRating/BookRating";

interface Props {
  books: Book[];
  addBook: (book: Book) => void;
  updateBooks: (newBookData: Book) => void;
  updateBooksBatched: (newBooks: Book[]) => void;
  deleteBook: (book: Book) => void;
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
}
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const LibraryListing = (props: Props) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isBookDeleted, setIsBookDeleted] = useState<boolean>(false);

  const [selectedBook, setSelectedBook] = useState<Book>();

  const [ratings, setRatings] = useState<{ [key: string]: number }[]>([]);
  const handleRatingChange = (bookId: string, newValue: number) => {
    setRatings((prevRatings) => {
      const existingRatingIndex = prevRatings.findIndex(
        (rating) => Object.keys(rating)[0] === bookId
      );

      if (existingRatingIndex !== -1) {
        const updatedRatings = [...prevRatings];
        updatedRatings[existingRatingIndex] = { [bookId]: newValue };
        return updatedRatings;
      } else {
        return [...prevRatings, { [bookId]: newValue }];
      }
    });
  };

  const [isbn, setIsbn] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [genre, setGenre] = useState<string>("");

  function clearFields() {
    setIsbn("");
    setTitle("");
    setAuthor("");
    setYear("");
    setGenre("");
  }

  const handleIsAdding = () => {
    clearFields();
    setIsEditing(false);
    setIsAdding(!isAdding);
  };

  const handleBackButton = () => {
    clearFields();
    setIsAdding(false);
    setIsEditing(false);
    if (selectedBook) {
      selectedBook.isSelected = false;
    }
  };

  const handlePageChange = (
    e: React.ChangeEvent<unknown>,
    newPageNumber: number
  ) => {
    e.preventDefault();
    props.setPage(newPageNumber);
  };

  const handleChangeIsbn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsbn(e.target.value);
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeAuthor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
  };

  const handleChangeGenre = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGenre(e.target.value);
  };
  const handleChangeYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (/^\d*$/.test(newValue)) {
      setYear(newValue);
    }
  };

  const handleIsEditing = (book: Book) => {
    clearFields();
    setSelectedBook(book);
    setIsAdding(false);
    setIsEditing(true);
    setIsBookDeleted(true);
    if (!book.isSoftDeleted) {
      setIsBookDeleted(false);
      setIsbn(book.id);
      setTitle(book.title);
      setAuthor(book.author);
      setYear(String(book.year));
      setGenre(book.genre);
    }

    book.isSelected = true;
    if (selectedBook) {
      selectedBook.isSelected = false;
    }
  };
  const findRatingForBook = (bookId: string): number => {
    const ratingObject = ratings.find(
      (rating) => Object.keys(rating)[0] === bookId
    );
    return ratingObject ? ratingObject[bookId] : 0;
  };

  const handleBookEdit = async (selectedBook: Book | undefined) => {
    const editedBook: Book = {
      id: isbn,
      title: title,
      author: author,
      year: Number(year),
      genre: genre,
      recommendations: selectedBook?.recommendations,
      nonrecommendations: selectedBook?.nonrecommendations,
    };
    const updateBookResponse = await axios.put(
      `http://localhost:3000/books/${selectedBook?.id}`,
      editedBook
    );
    if (updateBookResponse.data.error) {
      alert(updateBookResponse.data.error);
    } else {
      alert("Book updated!");
      props.updateBooks(editedBook);
    }
  };

  const handleBookAdd = async () => {
    if (isbn && title && author && genre && year) {
      const book: Book = {
        id: isbn,
        title: title,
        author: author,
        year: Number(year),
        genre: genre,
        recommendations: 0,
        nonrecommendations: 0,
      };
      const addBookResponse = await axios.post(
        "http://localhost:3000/books",
        book
      );
      if (addBookResponse.data.error) {
        alert(addBookResponse.data.error);
      } else {
        alert("Book added!");
        props.addBook(addBookResponse.data);
      }
    } else {
      alert("Fill out all fields");
    }
  };

  const handleDeleteButton = async (book: Book) => {
    if (confirm("Are you sure you want to delete this book?")) {
      const addBookResponse = await axios.delete(
        `http://localhost:3000/books/${book.id}`
      );
      if (addBookResponse.data.error) {
        alert(addBookResponse.data.error);
      } else {
        clearFields();
        //this would couse pagination issues but will re-render state and remove book right away
        // props.deleteBook(book);
        book.isSoftDeleted = true;
        setIsBookDeleted(true);
      }
    }
  };

  async function handleImportBooks(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files;
    if (file && file[0].type === "application/json") {
      const formData = new FormData();
      formData.append("importBooksFile", file[0]);
      const importBooksResponse = await axios.post(
        `http://localhost:3000/books/import`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (importBooksResponse.data.error) {
        alert(importBooksResponse.data.error);
      } else {
        alert("Updated all books!");
        props.updateBooksBatched(importBooksResponse.data);
      }
    } else {
      alert("File is not a JSON file.");
    }
  }

  return (
    <div className={styles.libraryListingWrapper}>
      <div
        style={
          isAdding || isEditing ? { display: "flex" } : { display: "none" }
        }
        className={styles.libraryListingAdd}
      >
        <IconButton onClick={handleBackButton} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <div
          style={isBookDeleted ? { display: "none" } : {}}
          className={styles.libraryListingTextFields}
        >
          <TextField
            id="standard-basic"
            value={isbn}
            onChange={handleChangeIsbn}
            label="isbn"
            variant="standard"
          />
          <TextField
            id="standard-basic"
            value={title}
            onChange={handleChangeTitle}
            label="title"
            variant="standard"
          />
          <TextField
            id="standard-basic"
            value={author}
            onChange={handleChangeAuthor}
            label="author"
            variant="standard"
          />
          <TextField
            id="standard-basic"
            type="text"
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                pattern: "[0-9]*",
              },
            }}
            value={year}
            onChange={handleChangeYear}
            label="year"
            variant="standard"
          />
          <TextField
            id="standard-basic"
            value={genre}
            onChange={handleChangeGenre}
            label="genre"
            variant="standard"
          />
        </div>

        {isAdding && (
          <IconButton onClick={handleBookAdd} color="primary">
            <SendAndArchiveIcon />
          </IconButton>
        )}
        {isEditing && (
          <IconButton
            onClick={() => handleBookEdit(selectedBook)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
        )}
      </div>

      <div
        style={
          isAdding || isEditing ? { display: "none" } : { display: "flex" }
        }
        className={styles.libraryListingHeader}
      >
        <Pagination
          sx={{ margin: "1rem" }}
          count={props.totalPages}
          page={props.currentPage}
          onChange={handlePageChange}
          size="small"
          color="primary"
        />
        <div className={styles.libraryListingOptions}>
          <Button
            sx={{ margin: "1rem", fontSize: "1.2rem", textAlign: "center" }}
            variant="outlined"
            onClick={handleIsAdding}
          >
            Add book
          </Button>
          <Button
            sx={{ margin: "1rem", fontSize: "1.2rem", textAlign: "center" }}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
          >
            Import Books
            <VisuallyHiddenInput
              type="file"
              accept="application/json"
              onChange={(event) => handleImportBooks(event)}
              multiple
            />
          </Button>
        </div>
      </div>
      <List
        sx={{
          width: "100%",
          bgcolor: "azure",
          marginBottom: "1rem",
          justifyContent: "center",
        }}
      >
        {props.books.map((book) => (
          <ListItem
            key={book.id + book.author}
            sx={
              isEditing && selectedBook?.id === book.id
                ? { backgroundColor: "#D4F1F4", height: "120px" }
                : { height: "120px" }
            }
            onClick={() => handleIsEditing(book)}
            disablePadding
          >
            <ListItemButton sx={{ padding: "0", height: "120px" }}>
              <ListItemText
                sx={{ paddingLeft: "0.4rem" }}
                inset
                primary={`${book.title} (${book.year}) by ${book.author}`}
                secondary={`Genre: ${book.genre}`}
              />
              {isEditing && selectedBook?.id === book.id && (
                <>
                  <ListItemText
                    sx={{ padding: "0 0.5rem" }}
                    inset
                    primary={
                      book.isSoftDeleted
                        ? `❌ This book is not available!`
                        : `✅ This book is available!`
                    }
                    secondary={!book.isSoftDeleted && `ISBN: ${book.id}`}
                  />
                  {!book.isSoftDeleted && (
                    <BookRating
                      book={book}
                      rating={findRatingForBook(book.id)}
                      handleRatingChange={handleRatingChange}
                    ></BookRating>
                  )}
                </>
              )}

              <Tooltip title="Delete book">
                <IconButton
                  style={
                    book.isSelected
                      ? { visibility: "visible" }
                      : { visibility: "hidden" }
                  }
                  disabled={book.isSoftDeleted ? true : false}
                  onClick={() => handleDeleteButton(book)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default LibraryListing;
