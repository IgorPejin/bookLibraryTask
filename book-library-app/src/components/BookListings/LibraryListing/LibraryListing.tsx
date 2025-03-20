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
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import { useState } from "react";
import axios from "axios";

interface Props {
  books: Book[];
  addBook: (book: Book) => void;
  updateBooks: (newBookData: Book) => void;
  updateBooksBatched: (newBooks: Book[]) => void;
  deleteBook: (book: Book) => void;
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
  const [selectedBook, setSelectedBook] = useState<Book>();
  const [rating, setRating] = useState<number | null>(0);
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
  };

  function handleChangeIsbn(e: React.ChangeEvent<HTMLInputElement>) {
    setIsbn(e.target.value);
  }

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
    setIsbn(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setYear(String(book.year));
    setGenre(book.genre);
  };

  const handleBookEdit = async (selectedBook: Book | undefined) => {
    const editedBook: Book = {
      id: isbn,
      title: title,
      author: author,
      year: Number(year),
      genre: genre,
      recommendations: 0,
    };
    const updateBookResponse = await axios.put(
      `http://localhost:3000/books/${selectedBook?.id}`,
      editedBook
    );
    console.log(updateBookResponse);
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
        props.deleteBook(book);
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
        <h2>Browse the library: </h2>
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
      <List sx={{ width: "100%", bgcolor: "azure", marginBottom: "1rem" }}>
        {props.books.map((book) => (
          <ListItem
            key={book.id + book.author}
            sx={
              isEditing && selectedBook?.id === book.id
                ? { backgroundColor: "#D4F1F4" }
                : {}
            }
            onClick={() => handleIsEditing(book)}
            disablePadding
          >
            <ListItemButton>
              <ListItemText
                inset
                primary={`${book.title} (${book.year}) by ${book.author}`}
                secondary={`Genre: ${book.genre}`}
              />
              {isEditing && selectedBook?.id === book.id && (
                <>
                  <ListItemText
                    inset
                    primary={`✅ This book is available!`}
                    secondary={`ISBN: ${book.id}`}
                  />
                  <ListItemText>
                    <Box>
                      <Typography component="legend">
                        {rating !== 0 ? "✍️ Rated!" : "🤔 Rate this book ?"}
                      </Typography>
                      <Rating
                        name="simple-controlled"
                        value={rating}
                        max={10}
                        onChange={(event, newValue) => {
                          event.preventDefault();
                          setRating(newValue);
                        }}
                      />
                    </Box>
                  </ListItemText>
                </>
              )}

              <Tooltip title="Delete book">
                <IconButton
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
      <Pagination count={10} size="small" />
    </div>
  );
};

export default LibraryListing;
