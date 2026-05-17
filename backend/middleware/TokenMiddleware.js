const { auth } = require('../config/firebaseadmin');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const idToken = authHeader ? authHeader.split('Bearer ')[1] : null;

  if (!idToken) {
    return res.status(403).send('No token provided');
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).send('Unauthorized');
  }
};

module.exports = verifyToken;