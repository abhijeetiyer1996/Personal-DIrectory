const  config = require('config');
const jwt = require('jsonWebToken');

module.exports = (req, res, next)=>{
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).json({msg: "no token found"})
    }
    try{   
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user
        next();
    }
    catch(err){
        return res.status(401).json({msg: "invalid token"})
    }

}