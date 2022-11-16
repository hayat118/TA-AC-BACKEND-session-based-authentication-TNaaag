var express = require('express');
var router = express.Router();

var User=require('../models/user')


// create registration form
router.get('/register',(req,res,next)=>{
  res.render('form')
})

/* GET users listing. */
router.get('/', (req, res, next) =>{
   User.find({},(err,users)=>{
     if(err) return next(err)
     res.render('userList',{users})
   })
});
// create user

router.post('/register',(req,res,next)=>{
  User.create(req.body,(err,createdUser)=>{
    if(err) return next (err)
    res.redirect('/users/login')
  })
})
router.get('/login',(req,res,next)=>{
  res.render('login')
})

// details page
router.get('/:id',(req,res,next)=>{
  var id=req.params.id;
  User.findById(id,(err,user)=>{
    if(err) return next (err)
    res.render('detailsPage',{user})
  })
})

module.exports = router;
