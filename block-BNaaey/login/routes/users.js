var express = require('express');
var router = express.Router();

var User=require('../models/user')


// create registration form
router.get('/register',(req,res,next)=>{
  res.render('form')
})

/* GET users listing. */
router.get('/', (req, res, next) =>{
  console.log(req.session)
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
// log in
router.get('/login',(req,res,next)=>{
  res.render('login')
})

router.post('/login',(req,res,next)=>{
  var{ email, password}=req.body;
  if(!email || !password){
    res.redirect('/users/login');
  }
  User.findOne({email:email},(err,user)=>{
    if(err) return next(err);
    // no user
    if(!user){
       return res.redirect('/users/login')
    }
    // compare user
    user.verifyPassword(password,(err,result)=>{
      if(err) return next(err)
      if(!result){
        res.redirect('/users/login')
      }
      // persist logged in user info
      req.session.userId=user.id;
      res.redirect('/users')
    })
  })
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
