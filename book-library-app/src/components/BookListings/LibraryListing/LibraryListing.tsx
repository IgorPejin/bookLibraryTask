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
import Tooltip from "@mui/material/Tooltip";

interface Props {
  books: Book[];
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
  return (
    <div className={styles.libraryListingWrapper}>
      <div className={styles.libraryListingHeader}>
        <h2>Or browse the library yourself!</h2>
        <div className={styles.libraryListingOptions}>
          <Button
            sx={{ margin: "1rem", fontSize: "1.5rem", textAlign: "center" }}
            size="large"
            variant="outlined"
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
