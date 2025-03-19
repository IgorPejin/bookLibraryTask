import Book from "../../../types/book";
import styles from "./LibraryListing.module.css";
interface Props {
  books: Book[];
}

const LibraryListing = (props: Props) => {
  return (
    <div className={styles.libraryListingWrapper}>
      <h2>Here are all of the books</h2>
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
