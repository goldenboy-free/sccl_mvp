export default function authorizeRole(roles) {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({message: 'Unauthorized: No user found'});
        }

        if (!roles.includes(req.user.role)) return res.status(403).send('You are not authorized to perform this action');
        next();
    }
}