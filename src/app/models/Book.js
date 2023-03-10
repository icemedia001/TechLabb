import mongoose from "mongoose";
import gridfs from 'mongoose-gridfs';
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  author: {
    type: String,
    required: true
  },
  file: Buffer
});
// Add the GridFS plugin to the schema
bookSchema.plugin(gridfs({
  collection: 'books',
  model: 'BookFile',
  mongooseConnection: mongoose.connection
}));


export default mongoose.model('Book', bookSchema);