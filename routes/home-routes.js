const express = require('express');
const passport = require('passport');
const router = express.Router();
const BLOG = require('../model/blogModel');
const USER = require('../model/userModel');

//passport-local-mongoose configuration
passport.use(USER.createStrategy());
passport.serializeUser(USER.serializeUser());
passport.deserializeUser(USER.deserializeUser());

router.get('/',(req,res)=>{
    BLOG.find({}).sort({date: 'desc'}).exec((err,data)=>{err?console.log(err):
        res.render('home/index',{allBlogs:data});
        });
})
router.get('/login',(req,res)=>{
    if(req.isAuthenticated()){
        res.redirect('/blog');
    }else{
        res.render('home/login');
    }    
});
router.post('/login',(req,res)=>{
    const user = new USER({
        username:req.body.username,
        password:req.body.password
    });
    req.login(user,(err)=>{
        if(err){
            console.log(err);
        }else{
            passport.authenticate('local')(req,res,()=>{
                res.redirect('/blog');
            });
        }
    });
});
router.get('/register',(req,res)=>{
    res.render('home/register');
});
router.post('/register',(req,res)=>{
    let email = req.body.username;
    let password = req.body.password;
    console.log(email,password);
    USER.register({username:req.body.username},req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            res.redirect('/register');
        }else{
            passport.authenticate('local')(req,res,()=>{
                res.redirect(`/blog`);
            });
        }
    });
});
router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});
router.get('/post/:link',(req,res)=>{
    BLOG.findById({_id:req.params.link},(err,data)=>{err?console.log(err):
        res.render('home/post',{selectedPost:data});
    })
})
module.exports = router;