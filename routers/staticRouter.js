const express = require('express');
const router = express.Router();
const { restrictTo } = require("../middlewares/auth");

//import url model
const URL = require('../models/url');

router.get('/admin/urls',restrictTo(['admin']),async (req,res)=>
{
  
    const allUrls = await URL.find({});
    res.render('home',{
      urls: allUrls
    });
})

router.get('/', restrictTo(['normal','admin']), async (req, res) => {
   
    const allUrls = await URL.find({ createdBy: req.user._id });
    res.render('home',{
      urls: allUrls
    });
});

router.get("/signup",(req,res) =>{
  return res.render("signup");
})

router.get("/login",(req,res) =>{
  return res.render("login");
})  

module.exports = router;
