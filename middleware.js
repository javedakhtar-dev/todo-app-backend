const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const token = req.headers.authorization;

    const isValid = jwt.verify(token, "my-super-secret-key");
    
    if(isValid){
        req.userId = isValid.userId;
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "You are not authorized"
        });
        return;
    }
}

module.exports = {
    authMiddleware
}