import { Request, Response } from "express";
import { LibraryService } from "../services/libraryService";
import { UploadedFile } from "express-fileupload";

export async function getAllBooks(request: Request, response: Response) {
  const books = await LibraryService.readAllBooks();
  response.send(books);
}

export async function getBookById(request: Request, response: Response) {
  const id = request.params.id;
  const book = await LibraryService.getBookById(id);

  if (book instanceof Error) {
    response.send({ error: "Book does not exist" });
  } else {
    response.send(book);
  }
}

export async function getRecommendations(request: Request, response: Response) {
  const genre = request.params.genre;
  const recommendedBooks = await LibraryService.getRecommendations(genre);
  response.send(recommendedBooks);
}

export async function addBook(request: Request, response: Response) {
  const data = request.body;
  const newBook = await LibraryService.addBook(data);

  if (newBook instanceof Error) {
    response.send({ error: "Book already added" });
  } else {
    console.log("Sucesfully added new books !");
    response.send(newBook);
  }
}

export async function importBooks(request: Request, response: Response) {
  const file = request.files?.importBooksFile;
  const appendedBooks = await LibraryService.importBooks(file);
  if (appendedBooks instanceof Error) {
    response.send({ error: "Cant upload this file" });
  } else {
    response.send(appendedBooks);
  }
}

export async function updateBookById(request: Request, response: Response) {
  const updateBookId = request.params.id;
  const newBookData = request.body;
  const updatedBook = await LibraryService.updateBook(
    updateBookId,
    newBookData
  );
  if (updatedBook instanceof Error) {
    response.send({ error: "Book that you wanted to update does not exist" });
  } else {
    console.log("Sucesfully updated book !");
    response.send(updatedBook);
  }
}

export async function deleteBookById(request: Request, response: Response) {
  const deleteBookId = request.params.id;
  const deletedBook = await LibraryService.deleteBook(deleteBookId);
  response.send({ message: "Succesfully deleted book!" });
}
