const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  contentType: String,
  data: Buffer,
  size: Number
});

// Create a model from the schema
module.exports = mongoose.model('File', fileSchema);
