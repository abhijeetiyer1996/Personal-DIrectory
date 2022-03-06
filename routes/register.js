const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonWebToken');
const config = require('config');
const {check, validationResult} = require('express-validator');

router.post('/', 
[
    check('name','Please enter your name').not().isEmpty(),
    check('email','Please enter a proper Email Id').isEmail(),
    check('password', "password should be greater than 6 characters").isLength({min:6})
]
,async(req,res)=>{
    console.log(req.body.email)
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        //bad request
        res.json({errors: errors.array()})
    }
    else{
        const {name, email, password} = req.body;
        try{
            let user = await User.findOne({email}) 
            if(user){
                res.status(200).json({
                    errors:[{"msg":"user already exists"}]
                })
            }
            
            user = new User({
                name,
                email,
                password
            })

            //hashing the password
            let salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password,salt);

            // Return JWT
            await user.save();
            res.json({
                errors:[]
            })
            // res.send("User Registered Successfully")
        }
        catch(err){
            console.log(err);
            res.status(200).send("Server error:" + err);
        }
    }
    
})
module.exports = router;