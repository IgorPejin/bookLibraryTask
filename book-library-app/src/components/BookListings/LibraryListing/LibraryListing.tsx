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

interface Props {
  books: Book[];
  addBook: (book: Book) => void;
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
  const [isbn, setIsbn] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [genre, setGenre] = useState<string>("");

  const handleIsAdding = () => {
    setIsAdding(!isAdding);
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

  const handleBookAdd = async () => {
    console.log(isbn, title, author, genre, year);
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
        props.addBook(addBookResponse.data);
      }
    }
    console.log("hello");
  };

  return (
    <div className={styles.libraryListingWrapper}>
      <div
        style={isAdding ? { display: "flex" } : { display: "none" }}
        className={styles.libraryListingAdd}
      >
        <IconButton onClick={handleIsAdding} color="primary">
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
        <IconButton onClick={handleBookAdd} color="primary">
          <SendAndArchiveIcon />
        </IconButton>
      </div>

      <div
        style={isAdding ? { display: "none" } : { display: "flex" }}
        className={styles.libraryListingHeader}
      >
        <h2>Browse the library: </h2>
        <div className={styles.libraryListingOptions}>
          <Button
            sx={{ margin: "1rem", fontSize: "1.5rem", textAlign: "center" }}
            size="large"
            variant="outlined"
            onClick={handleIsAdding}
          >
            Add book
          </Button>
          <Button
            sx={{ margin: "1rem", fontSize: "1.5rem", textAlign: "center" }}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
          >
            Import Books
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => console.log(event.target.files)}
              multiple
            />
          </Button>
        </div>
      </div>
      <List sx={{ width: "100%", bgcolor: "azure", marginBottom: "1rem" }}>
        {props.books.map((book) => (
          <ListItem key={book.id} disablePadding>
            <ListItemButton>
              <ListItemText
                inset
                primary={`${book.title} (${book.year}) by ${book.author}`}
                secondary={`Genre: ${book.genre}`}
              />
              <Tooltip title="Edit book">
                <IconButton color="primary">
                  <EditIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete book">
                <IconButton color="error">
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
