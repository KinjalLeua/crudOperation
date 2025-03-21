const mongoose = require('mongoose');

const bookModel = mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
    book_name: { type: String },
    email: { type: String },
    book_type: { type: String },
    description: { type: String },
    status:  { type: Boolean, default: true }

},
{ timestamps: true })

const Book = mongoose.model('Book',bookModel);
module.exports = Book;