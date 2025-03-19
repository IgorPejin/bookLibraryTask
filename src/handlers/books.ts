import { Request, Response } from "express";
import { LibraryService } from "../services/libraryService";

export async function getAllBooks(request: Request, response: Response) {
  const books = await LibraryService.readAllBooks();
  response.send(books);
}

export function getBookById(request: Request, response: Response) {
  response.send({});
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

export function importBooks(request: Request, response: Response) {
  response.send({});
}

export function updateBookById(request: Request, response: Response) {
  response.send({});
}

export function deleteBookById(request: Request, response: Response) {
  response.send({});
}
