// backend/models/Article.js
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  credibilityScore: {
    type: Number,
    default: 0,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Article', articleSchema);