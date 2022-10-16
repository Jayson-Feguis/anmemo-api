import jwt from 'jsonwebtoken'

//Authenticate token
function auth(req, res, next) {
    const authToken = req.headers.authorization;
    const token = authToken && authToken.split(" ")[1];

    if (!token)
        return res
            .status(401)
            .send(`Access Denied. No token provided  ${authToken}`);
    try {
        const decoded = jwt.verify(token, 'Faculty!System_2022_jwtPK');
        req.player = decoded;
        next();
    } catch (ex) {
        res.status(400).send("Invalid token");
    }
}

export default auth;