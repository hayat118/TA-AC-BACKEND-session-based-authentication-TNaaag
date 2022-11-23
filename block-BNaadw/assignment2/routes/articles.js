var express=require('express')
var router=express.Router();

var Article=require('../models/article');
var User=require('../models/user');
var Comment=require('../models/comments')


// create article
router.get('/new',(req,res,next)=>{
  res.render('articleForm')
})
// 
router.post('/',(req,res,next)=>{
  Article.create(req.body,(err,article)=>{
    if(err) return next(err)
    res.redirect('/articles')
  })
})
// read
router.get('/',(req,res,next)=>{
  Article.find({},(err,articles)=>{
    if(err) return next(err)
    res.render('articlesPage',{ articles})
  })
})

// details(1)
router.get('/:id',(req,res,next)=>{
  var id=req.params.id;
  Article.findById(id).populate('commentsId').exec((err,article)=>{
    if(err) return next (err)
    res.render('singleArticle',{article})
  })
})


// details(2)
// router.get('/:slug',(req,res,next)=>{
//   var slug=req.params.slug;
//   Article.findOne({slug:slug}).populate('commentId').exec((err,article)=>{
//     if(err) return next(err)
//     res.render('singleArticle',{article})
//   })
// })

// edit
router.get('/:id/edit',(req,res,next)=>{
  var id=req.params.id;
  Article.findById(id,(err,article)=>{
    if(err) return next(err)
    res.render('EditArticle',{article})
  })
})

router.post('/:id',(req,res,next)=>{
  var id=req.params.id;
  Article.findByIdAndUpdate(id,req.body, (err,updateArticle)=>{
    if(err) return next(err)
    res.redirect('/articles/' + id)
  })
})
// delete
router.get('/:id/delete',(req,res,next)=>{
  var id=req.params.id;
  Article.findByIdAndDelete(id,(err,article)=>{
    if(err) return next(err)
    res.redirect('/articles')
  })
})

// likes
router.get('/:id/likes',(req,res,next)=>{
  var id=req.params.id;
  Article.findByIdAndUpdate(id, {$inc: {likes: 1}},(err,article)=>{
    if(err) return next(err)
    res.redirect('/articles/' + id)
  })
})

// add comment
router.post('/:id/comments',(req,res,next)=>{
  var id=req.params.id;
  req.body.articleId=id;
  Comment.create(req.body,(err,comment)=>{
    if(err) return next(err)
    Article.findByIdAndUpdate(id,{$push:{commentsId:comment.id}},(err,updatedArticle)=>{
      if(err) return next(err)
      res.redirect('/articles/' + id)
    })
  })
})




module.exports=router;