const mongoose = require('mongoose');

const socialAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    platform: {
      type: String,
      required: true
    },

    accessToken: {
      type: String,
      required: true
    },

    refreshToken: {
      type: String
    },

    platformUserId: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  'SocialAccount',
  socialAccountSchema
);