const axios = require('axios');
const SocialAccount = require('../models/SocialAccount');
const connectLinkedIn = async (req, res) => {

  try {

    const scope = 'openid profile email w_member_social';

    // Store userId in state
    const state = req.user;

    const linkedInURL =
      `https://www.linkedin.com/oauth/v2/authorization` +
      `?response_type=code` +
      `&client_id=${process.env.LINKEDIN_CLIENT_ID}` +
      `&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}` +
      `&scope=${scope}` +
      `&state=${state}`;

    res.status(200).json({
      url: linkedInURL
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

const linkedInCallback = async (req, res) => {

  try {

    const code = req.query.code;

    const userId = req.query.state;

    if (!code) {
      return res.status(400).json({
        message: 'Authorization code missing'
      });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET
        },

        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded'
        }
      }
    );

    const accessToken =
      tokenResponse.data.access_token;

    // Fetch LinkedIn profile
    const profileResponse = await axios.get(
      'https://api.linkedin.com/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const linkedInUser =
      profileResponse.data;

    // Save in DB
    const socialAccount =
      await SocialAccount.findOneAndUpdate(
        {
          userId,
          platform: 'linkedin'
        },
        {
          userId,
          platform: 'linkedin',
          accessToken,
          platformUserId: linkedInUser.sub
        },
        {
          upsert: true,
          new: true
        }
      );

    res.status(200).json({
      message: 'LinkedIn connected successfully',
      socialAccount
    });

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    res.status(500).json({
      message: 'LinkedIn authentication failed'
    });

  }

};

module.exports = {
  connectLinkedIn,
  linkedInCallback
};