var express = require('express');
var router = express.Router();

var productHelpers = require('../helpers/product-helpers')
var userHelpers = require('../helpers/user-helpers')

const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  let banner = [
    {
      name: "banner 1",
      no: 0,
      im: "/images/b1.jpg",
      clas: "active"
    },
    {
      name: "banner 2",
      no: 1,
      im: "/images/b2.jpg",
      clas: ""
    }, {
      name: "banner 3",
      no: 2,
      im: "/images/b3.jpg",
      clas: ""
    },
    {
      name: "banner 4",
      no: 3,
      im: "/images/b4.jpg",
      clas: ""
    },
    {
      name: "banner 5",
      no: 4,
      im: "/images/b5.jpg",
      clas: ""
    }
  ]

  let user = req.session.user
  productHelpers.getAllProducts().then((products) => {
    res.render('index', { products, user, banner, admin: false });
  })
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/login', { "loginErr": req.session.loginErr, admin: false });
    req.session.loginErr = false
  }
})

router.get('/signup', (req, res) => {
  res.render('user/signup', { admin: false })
})

router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    res.redirect('/login')
  })
})

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.Status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr = true
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart',verifyLogin,async (req, res) => {
  let cartProducts=await userHelpers.getCartProducts(req.session.user._id)
  console.log(cartProducts)
  res.render('user/cart', { cartProducts ,admin: false })
})

router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/')
  })
})

module.exports = router;
