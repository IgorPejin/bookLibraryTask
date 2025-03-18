import Book from "../../../types/book";
import styles from "./LibraryListing.module.css";
interface Props {
  books: Book[];
}

const LibraryListing = (props: Props) => {
  return (
    <div className={styles.libraryListingWrapper}>
      <ul>
        {props.books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LibraryListing;
