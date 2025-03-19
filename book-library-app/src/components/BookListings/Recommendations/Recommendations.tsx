import Book from "../../../types/book";
import styles from "./Recommendations.module.css";
import RecommendedBook from "./RecommendedBook/RecommendedBook";

interface Props {
  books: Book[];
}

const Recommendations = (props: Props) => {
  return (
    <div className={styles.recommendationsWrapper}>
      <h2>Here are our recommendations</h2>
      <ul>
        {props.books.map((book) => (
          <RecommendedBook key={book.id} book={book} />
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
