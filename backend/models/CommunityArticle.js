// backend/models/CommunityArticle.js
const mongoose = require('mongoose');

const communityArticleSchema = new mongoose.Schema({
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
    required: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  votes: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  voters: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      voteType: { type: String, enum: ['upvote', 'downvote'] },
    },
  ],
});

module.exports = mongoose.model('CommunityArticle', communityArticleSchema);