import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
},
  author: { 
    type: String, 
    required: true 
},
  description: { 
    type: String,
    required: true
},
  genre: { 
    type: String,
    required: true
},
  ISBN: { 
    type: String, 
    required: true 
},
  imageURL: { 
    type: String ,
    required: true
},
filePath: {
  type: String,
  required: true
}
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;