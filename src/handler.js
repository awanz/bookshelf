/*
* Created by Awan
* Date 03-05-2021
*/
const { nanoid } = require('nanoid');
const books = require('./books');
 
const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    if (name === null || name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    let finished = false;
    
    if (pageCount === readPage) {
      finished = true;
    }else if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }else{
      finished = false;
    }

    const newBook = {
      id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };
   
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
   
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }else{
      const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;
    }
    
};

const getAllBooksHandler = (request) => {

    const { reading } = request.query;
    const { finished } = request.query;
    const { name } = request.query;
    let bookRaw = books
    let bookFillter;
    
    if (reading >= 0) {
      bookFillter = bookRaw.filter((book) => {
        return book.reading == reading;
      });
    }else if (finished >= 0) {
      bookFillter = bookRaw.filter((book) => {
        return book.finished == finished;
      });
    }else if (typeof name !== 'undefined') {
      bookFillter = bookRaw.filter((book) => {
        return book.name.toLowerCase().includes(name.toLowerCase());
      });
    }else{
      bookFillter = bookRaw;
    }
    bookSort = bookFillter
    bookSort = bookFillter.map(book => {
      return {
        'id': book.id,
        'name': book.name,
        'publisher': book.publisher,
      }
    })
    
    return {
      status: 'success',
      data: {
        'books': bookSort,
      },
    };
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  
  const book = books.filter((n) => n.id === id)[0];
   
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
   
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
    if (name === null || name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    let finished = false;
    if (pageCount === readPage) {
      finished = true;
    }else if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }else{
      finished = false;
    }
    const index = books.findIndex((book) => book.id === id);
   
    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt,
      };
   
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
   
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
   
const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
   
    const index = books.findIndex((book) => book.id === id);
   
    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }
   
   const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
   
module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};