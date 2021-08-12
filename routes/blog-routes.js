const express = require('express');
const multer  = require('multer');
const path = require('path');
const BLOG = require('../model/blogModel');
const router = express.Router();

let Storage = multer.diskStorage({
    destination:'./public/uploads',
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
});
let upload = multer({
    storage:Storage
}).single('imgFile');

router.get('/',(req,res)=>{
    if(req.isAuthenticated()){
        BLOG.find({user_id:req.user._id}).sort({date:'desc'}).exec((err,data)=>{err?console.log(err):
        res.render('./blogs/home',{blogList:data});
    });
    }else{
        res.redirect('/login');
    }        
});

router.get('/new',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('./blogs/newBlog',{id:req.user._id});
    }else{
        res.redirect('/login');
    }    
});

router.post('/new',(req,res)=>{
    if(req.isAuthenticated()){
    const newBlog = new BLOG({
        blogTitle : req.body.blogTitle,
        blogBody:req.body.blogBody,
        user_id:req.body.user_id
    })
    newBlog.save((err)=>{err?console.log(err):console.log('insert suucessfully')});
    res.redirect('/blog');
}else{
    res.redirect('/login');
} 
});

router.post('/',upload,(req,res)=>{
    if(req.isAuthenticated()){
    const newBlog = new BLOG({
        blogTitle : req.body.blogTitle,
        blogBody:req.body.blogBody,
        user_id:req.body.user_id,
        imageName:req.file.filename
    })
    newBlog.save((err)=>{err?console.log(err):console.log('insert suucessfully')});
    res.redirect('/blog');
}else{
    res.redirect('/login');
} 
});

router.get('/update/:blogid',(req,res)=>{
    const id = req.params.blogid;
    if(req.isAuthenticated()){
    BLOG.findById({_id:id},(err,data)=>{err?console.log(err):
        res.render('./blogs/updateBlog',{blogData:data});
    });
    }else{
        res.redirect('/login');
    }     
});

router.post('/update/:blogid',(req,res)=>{
    let id = req.params.blogid;
    let title = req.body.blogTitle;
    let body = req.body.blogBody;
    BLOG.findOneAndUpdate({_id:id},{$set:{blogTitle:title,blogBody:body}},(err)=>{err?console.log(err):console.log('update successfully')});
    res.redirect('/blog');
})

router.get('/delete/:blogid',(req,res)=>{
    const id = req.params.blogid;
    if(req.isAuthenticated()){
    BLOG.findOneAndRemove({_id:id},(err)=>err?console.log(err):res.redirect('/blog'));
    }else{
        res.redirect('/login');
    } 
});

module.exports = router;