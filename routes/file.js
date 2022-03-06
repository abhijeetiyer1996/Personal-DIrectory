const express = require('express');
const router = express.Router();
const multer = require('multer');
const  User = require('../Models/User');
const alphanumeric = require('alphanumeric-id');
const fs = require('fs');
const {promisify} = require('util');
const res = require('express/lib/response');
const unlinkAsync = promisify(fs.unlink);
let errors = [];
const path= require("path");
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        const dir =`./uploads/${req.params.id}/`;
        fs.access(dir,(err) => {
            if(err){
                console.log("Dir not found")
                return fs.mkdir(dir, err=> cb(err,dir))
            }
            else{
                console.log("directory exists");
                return cb(null, dir);
            }
        });
    },
    filename: function(req, file,cb){
        let code = alphanumeric(6);
        req.code = code
        cb(null, `${code}-${file.originalname}`);
    }  

})
const upload = multer({storage:storage});

router.patch('/:id',upload.single('file'),async(req,res)=>{
    let files = [];
    let fileDetails = { "fileId": req.code,
                        "fileName":`${req.code}-${req.file.originalname}`,
                        "fileType" : req.file.mimetype,
                        "path" : req.file.path }   
    try{
        const user = await User.findById(req.params.id);
        files = user.files;
        files.push(JSON.stringify(fileDetails));
        await User.updateOne({_id:req.params.id},{files})
        files=[];
        res.json({msg:"Upload Successful"});
        return res.json({errors:[{msg: `no user found with id ${req.params.id}`}]})
    }
    catch(err){
        res.json({errors:[{msg:err}]})
    }
});

router.delete('/:id/:fileId',async(req,res)=>{
    const id = req.params.id;
    const fileId = req.params.fileId;
    let path = ""; 
    try{
        const user = await User.findById(id);
        let updatedFiles = user.files.filter((file)=>{ 
            let currentFile = JSON.parse(file);
            if(currentFile.fileId === fileId)
                path = currentFile.path;
            return currentFile.fileId !== fileId;
        });
        await User.updateOne({_id:id},{files:updatedFiles});
        await unlinkAsync(path);
        res.json("Delete Sucessful");
    }
    catch(err){
        res.json({errors:[{msg:err}]})
    }
})

router.get('/:id/:fileName',(req, res)=>{
    const file = `./uploads/${req.params.id}/${req.params.fileName}`;
    res.download(file);
})
module.exports = router;