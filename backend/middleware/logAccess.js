export const logAccess = (req, res, next) => {
    const user = req.user ? req.user.email : "Guest";

    console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - User: ${user}`
    );

    next();
};
