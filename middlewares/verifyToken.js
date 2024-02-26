const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const verifyAccessToken = asyncHandler(async(req, res, next) => {
        if (req && req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            const token = req.headers.authorization.split(' ')[1]
            jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
                if (err) return res.status(401).json({
                    success: false,
                    mes: "Invalid access token"
                })
                console.log(decode);
                req.user = decode
                next()
            })
        } else {
            return res.status(401).json({
                success: false,
                mes: "Require authorization!!!"
            })
        }
    })
    // const verifyAccessToken = asyncHandler(async(req, res, next) => {
    //     try {
    //         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Authorization header missing or malformed"
//             });
//         }

//         const token = authHeader.split(' ')[1];
//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//             if (err) {
//                 return res.status(401).json({
//                     success: false,
//                     message: "Invalid access token"
//                 });
//             }
//             console.log(decoded);
//             req.user = decoded;
//             next();
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// });
module.exports = {
    verifyAccessToken
}