const axios = require('axios');

const publishToLinkedIn = async ({
  accessToken,
  authorUrn,
  content
}) => {

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

  return response.data;
};

module.exports = {
  publishToLinkedIn
};