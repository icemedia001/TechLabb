import mongoose from "mongoose";

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
  file: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'uploads.files' // Collection name for uploaded files in MongoDB
    },
    filename: {
      type: String
    },
    contentType: {
      type: String
    },
    size: {
      type: Number
    }
  }
});

export default mongoose.model('Book', bookSchema);