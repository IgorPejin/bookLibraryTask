import styles from "./RecommendedBook.module.css"; // Update the path accordingly
import Book from "../../../../types/book";

interface Props {
  book: Book;
  backgroundColor: string;
}

const RecommendedBook = (props: Props) => {
  return (
    <div className={styles.recommendedBookWrapper}>
      <div
        style={{ background: props.backgroundColor }}
        className={styles.recommendedBook}
      >
        <h3>{props.book.title}</h3>
        <h4>{props.book.author}</h4>
        <div>
          <p>{props.book.year}</p>
          <p>{props.book.genre}</p>
        </div>
      </div>
    </div>
  );
};

export default RecommendedBook;
