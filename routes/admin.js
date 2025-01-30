var express = require('express');

var router = express.Router();

var productHelpers = require('../helpers/product-helpers')
/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelpers.getAllProducts().then((products) => {
    res.render('admin/viewproducts', { products, admin: true })
  })

});

router.get('/addproduct', function (req, res) {
  res.render('admin/addproduct', { admin: true })
})

router.post('/addproduct', (req, res) => {
  productHelpers.addProducts(req.body, (id) => {
    let img = req.files.image
    img.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render('admin/addproduct', { admin: true })
      }
    })

  })
})

router.get('/delete-product/:id', (req, res) => {
  let proId=req.params.id
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin')
  })
})

module.exports = router;
