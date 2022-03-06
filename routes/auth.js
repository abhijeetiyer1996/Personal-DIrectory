const express = require('express');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonWebToken');
const mongoose = require('mongoose');
const config = require('config')
const authToken = require('../middleware/authToken');
const User = require('../Models/User');
const router = express.Router();

router.get('/', authToken, async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        //bad request
        res.status(400).json({errors: errors.array()})
    }
    try{
        let user = await User.findById(req.user.id).select('-password');
        res.status(200).json({user});
    }
    catch(err){
        console.log(err.message); 
        res.status(500).send("server error")
    }
});


router.post('/', 
[
    check('email','Please enter a proper Email Id').isEmail(),
    check('password', "password is must").exists()
]
,async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        //bad request
        res.json({errors: errors.array()})
    }
    else{
        const {email, password} = req.body;
        try{
            let user = await User.findOne({email}) 
            if(!user){
                return res.status(200).json({
                    errors:[{"msg": "Invalid Credentials"}]
                });
            }
            //hashing the password
            const isMatching = await bcrypt.compare(password, user.password);
            console.log(isMatching);
            if(isMatching){
                // Return JWT
                const payload={
                    user:{
                        id:user.id
                    }
                };
                jwt.sign(payload, config.get('jwtSecret'),{expiresIn:3600000},(err,token)=>{
                    if(err) throw err;
                    res.json({token})
                })
            }
            else{
                res.json({
                    errors:[{"msg": "Invalid Credentials"}]
                });

            }
        }
        catch(err){
            console.log(err);
            res.json({errors:[{"msg":"Server error:" + err}]});
        }
    }
    
})

module.exports = router;