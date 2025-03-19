import BookListings from "./BookListings/BookListings";
import styles from "./LibraryApp.module.css";

function App() {
  return (
    <div className={styles.libraryAppWrapper}>
      <h1 className={styles.libraryAppHeading}> 📚 Book library 📚</h1>
      <BookListings />
    </div>
  );
}

export default App;
