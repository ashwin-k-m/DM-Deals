var express = require('express');
var router = express.Router();

var productHelpers=require('../helpers/product-helpers')
var userHelpers=require('../helpers/user-helpers')

/* GET home page. */
router.get('/', function (req, res, next) {
  let banner = [
    {
      name:"banner 1",
      no:0,
      im:"/images/b1.jpg",
      clas:"active"
    },
    {
      name:"banner 2",
      no:1,
      im:"/images/b2.jpg",
      clas:""
    },{
      name:"banner 3",
      no:2,
      im:"/images/b3.jpg",
      clas:""
    },
    {
      name:"banner 4",
      no:3,
      im:"/images/b4.jpg",
      clas:""
    },
    {
      name:"banner 5",
      no:4,
      im:"/images/b5.jpg",
      clas:""
    }
  ]

  productHelpers.getAllProducts().then((products)=>{
    res.render('index', {products,banner, admin: false });
  })
});

router.get('/login',(req,res)=>{
  res.render('user/login')
})

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    res.redirect('/login')
  })
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.Status){
      res.redirect('/')
    }else{
      res.redirect('/login')
    }
  })
})

module.exports = router;
