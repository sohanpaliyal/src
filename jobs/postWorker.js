const { Worker } = require('bullmq');

const redisConnection =
  require('../config/redis');

const Post = require('../models/Post');

const SocialAccount =
  require('../models/SocialAccount');

const {
  publishToLinkedIn
} = require('../services/linkedinService');

const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const worker = new Worker(
  'postQueue',

  async (job) => {

    const { postId } = job.data;

    console.log(
      `Processing post ${postId}`
    );

    const post =
      await Post.findById(postId);

    if (!post) return;

    const socialAccount =
      await SocialAccount.findOne({
        userId: post.userId,
        platform: 'linkedin'
      });

    if (!socialAccount) return;

    try {

      await publishToLinkedIn({
        accessToken:
          socialAccount.accessToken,

        authorUrn:
          `urn:li:person:${socialAccount.platformUserId}`,

        content: post.content
      });

      post.status = 'published';

      post.publishedAt = new Date();

      await post.save();

      console.log(
        `Post ${postId} published`
      );

    } catch (error) {

      post.status = 'failed';

      await post.save();

      console.log(error.message);

    }

  },

  {
    connection: redisConnection
  }
);