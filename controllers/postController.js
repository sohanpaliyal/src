const axios = require('axios');

const SocialAccount = require('../models/SocialAccount');
const Post = require('../models/Post');

const postQueue =
  require('../jobs/postQueue');
const createLinkedInPost = async (req, res) => {

  try {

    const { content } = req.body;

    // Find connected LinkedIn account
    const socialAccount =
      await SocialAccount.findOne({
        userId: req.user,
        platform: 'linkedin'
      });

    if (!socialAccount) {

      return res.status(400).json({
        message: 'LinkedIn account not connected'
      });

    }

    const accessToken =
      socialAccount.accessToken;

    const authorUrn =
      `urn:li:person:${socialAccount.platformUserId}`;

    // Create LinkedIn post
    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      {
        author: authorUrn,

        lifecycleState: 'PUBLISHED',

        specificContent: {
          'com.linkedin.ugc.ShareContent': {

            shareCommentary: {
              text: content
            },

            shareMediaCategory: 'NONE'
          }
        },

        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility':
            'PUBLIC'
        }
      },

      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          'X-Restli-Protocol-Version':
            '2.0.0',

          'Content-Type':
            'application/json'
        }
      }
    );

    res.status(200).json({
      message: 'Post created successfully',
      data: response.data
    });

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    res.status(500).json({
      message: 'LinkedIn post failed'
    });

  }

};

const scheduleLinkedInPost =
  async (req, res) => {

    try {

      const {
        content,
        scheduledFor
      } = req.body;

      // Save post
      const post = await Post.create({
        userId: req.user,
        content,
        platforms: ['linkedin'],
        status: 'pending',
        scheduledFor
      });

      // Calculate delay
      const delay =
        new Date(scheduledFor).getTime() -
        Date.now();

      // Add job to queue
      await postQueue.add(
        'linkedinPost',
        {
          postId: post._id
        },
        {
          delay
        }
      );

      res.status(201).json({
        message:
          'Post scheduled successfully',
        post
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

};

module.exports = {
  createLinkedInPost,
  scheduleLinkedInPost
};