import { request, Request, Response } from "express";

export function getAllBooks(request: Request, response: Response) {
  response.send([]);
}

export function getBookById(request: Request, response: Response) {
  response.send({});
}

export function getRecommendations(request: Request, response: Response) {
  response.send([]);
}

export function addBook(request: Request, response: Response) {
  response.send({});
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
