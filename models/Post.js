const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    content: {
      type: String,
      required: true
    },

    platforms: [
      {
        type: String
      }
    ],

    status: {
      type: String,
      enum: [
        'pending',
        'published',
        'failed'
      ],
      default: 'pending'
    },
    scheduledFor: {
      type: Date
    },

    publishedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  'Post',
  postSchema
);