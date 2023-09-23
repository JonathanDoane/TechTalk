const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
module.exports.secret = secret;
module.exports.authenticate = (req, res, next) => {
    jwt.verify(req.cookies.userToken, secret, (err, payload) => {
        if (err) {
            console.log(err);
            res.status(401).json({ verified: false });
        } else {
            // req.body.user = payload._id
            // console.log(req.body)
            // console.log(payload)
            next();
        }
    });

}


