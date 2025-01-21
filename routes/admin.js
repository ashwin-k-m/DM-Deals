var express = require('express');

var router = express.Router();

var productHelpers=require('../helpers/product-helpers')
/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/viewproducts', {products, admin: true })
  })
  
});

router.get('/addproduct',function(req,res){
  res.render('admin/addproduct')
})

router.post('/addproduct',(req,res)=>{
  productHelpers.addProducts(req.body,(id)=>{
    let img=req.files.image
    img.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render('admin/addproduct')
      }
    })

  })
})

module.exports = router;
