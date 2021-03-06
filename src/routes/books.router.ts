import { Router } from "express";
import { authenticateAdminToken } from "../authentication";
import { UnknownBookError } from "../errors/unknown-book.error";
import { BooksService } from "../services/books.service";
const booksRouter = Router();

const booksService = new BooksService();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Retrieve a list of books
 */
booksRouter.get("/", (req, res) => {
  const books = booksService.getAllBooks();
  res.status(200).send(books);
});

/**
 * @openapi
 * /books:
 *   post:
 *     summary: Create a new book
 *     description: creates a new book
 */
booksRouter.post("/", authenticateAdminToken, (req, res) => {
  try {
    const book = booksService.createBook(req.body);
    res.status(200).send(book);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
/**
 * @openapi
 * /books/:bookID:
 *   put:
 *     summary: Edit a book
 */
booksRouter.put("/:bookID", authenticateAdminToken, (req, res) => {
  try {
    const book = booksService.updateBook(req.params.bookID, req.body);
    res.status(200).send(book);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * @openapi
 * /books/:bookID:
 *   delete:
 *     summary: Delete a book
 */
booksRouter.delete("/:bookID", authenticateAdminToken, (req: any, res) => {
  try {
    booksService.deleteBook(req.params.bookID, req.book.id);
  } catch (error) {
    if (error instanceof UnknownBookError) {
      res.status(404);
    } else {
      res.status(400);
    }
    res.send(error.message);
  }
});

export default booksRouter;
