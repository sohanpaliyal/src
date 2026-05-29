const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {

  try {

    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {

      const token = req.cookies.accessToken;

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Attach user id to request
      req.user = decoded.id;

      next();

    } else {

      return res.status(401).json({
        message: 'Not authorized, token missing'
      });

    }

  } catch (error) {

    return res.status(401).json({
      message: 'Invalid token'
    });

  }

};

module.exports = protect;