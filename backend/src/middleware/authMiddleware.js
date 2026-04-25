  import jwt from 'jsonwebtoken';

  export default async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(403).send('A token is required for authentication');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(401).send('Invalid Token');
      req.user = user;
      next();
    });
  };
