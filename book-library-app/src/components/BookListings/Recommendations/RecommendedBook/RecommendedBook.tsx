import Book from "../../../../types/book";

interface Props {
  book: Book;
}

const RecommendedBook = (props: Props) => {
  return (
    <li>
      {props.book.title} by {props.book.author}
    </li>
  );
};

export default RecommendedBook;
